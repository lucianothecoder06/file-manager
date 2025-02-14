"use client";
import { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Folder, File, FolderOpen } from "lucide-react";
import type { Dir } from "@/lib/types";
import { invoke } from "@tauri-apps/api/core";
import FileItem from "./file-item";
export default function FolderItem({
  dir,
  index,
  setMainDir,
}: {
  dir: Dir;
  index: number;
  setMainDir: Function,
}) {
  const [dirs, setDirs] = useState<Dir[]>([]);
  const [open, setOpen] = useState<Boolean>(false);

  async function getDirs() {
    let response: Dir[] = await invoke("get_custom_dir", {
      customPath: dir.path,
    });
    console.log(response);
    setDirs(response);
  }
  useEffect(() => {
    getDirs();
  }, []);

  return (
    <Collapsible
      key={index}
      onOpenChange={() => {
        setOpen(!open);
      }}
    >
      <CollapsibleTrigger className="flex gap-2 transition duration-300 " onDoubleClick={()=>{setMainDir(dirs)}}>
        {open ? <FolderOpen /> : <Folder />} {dir.name}
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-4 text-popover-foreground outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
        {dirs.map((dir, subindex) => (
          <div key={subindex}>
            {dir.is_dir ? (
              <FolderItem dir={dir} index={subindex} setMainDir={setMainDir}/>
            ) : (
              <FileItem dir={dir} index={subindex} />
            )}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
