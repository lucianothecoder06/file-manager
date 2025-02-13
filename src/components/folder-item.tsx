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

export default function FolderItem({
  dir,
  index,
}: {
  dir: Dir;
  index: number;
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
      <CollapsibleTrigger className="flex gap-2 transition duration-300 ">
        {open ? <FolderOpen /> : <Folder />} {dir.name}
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-4">
        {dirs.map((dir, subindex) => (
          <div key={subindex}>
            {dir.is_dir ? (
              <FolderItem dir={dir} index={subindex} />
            ) : (
              <div className="text-black flex col-span-1 gap-2" key={subindex}>
                <File className="h-6 w-auto" />
                <span>{dir.name}</span>
              </div>
            )}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
