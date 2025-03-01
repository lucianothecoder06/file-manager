"use client";
import { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Folder, FolderOpen, Wrench, Notebook, Trash } from "lucide-react";
import type { Dir } from "@/lib/types";
import { invoke } from "@tauri-apps/api/core";
import FileItem from "./file-item";
import { formatSize } from "@/lib/utils";



export default function FolderItem({
  dir,
  index,
  setMainDir,
  setMainPath,
  refresh,
  setRefresh,
}: {
  dir: Dir;
  index: number;
  setMainDir: (dirs: Dir[]) => void;
  setMainPath: (path: string) => void;
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
}) {
  const [dirs, setDirs] = useState<Dir[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  async function getDirs() {
    const response: Dir[] = await invoke("get_custom_dir", {
      customPath: dir.path,
    });
    console.log(response);
    setDirs(response);
  }
  const handleDelete = async () => {
    await invoke("delete_folder", {
      customPath: dir.path,
    });
    setRefresh(!refresh);
  };

  useEffect(() => {
    getDirs();
  }, []);

  return (
    <ContextMenu>
      <Collapsible
        key={index}
        onOpenChange={() => {
          setOpen(!open);
        }}
      >
        <ContextMenuTrigger>
          <CollapsibleTrigger
            className="flex gap-2 transition duration-300 "
            onDoubleClick={() => {
              setMainDir(dirs);
              setMainPath(dir.path);
            }}
          >
            {open ? <FolderOpen /> : <Folder />} {dir.name}
          </CollapsibleTrigger>
        </ContextMenuTrigger>
        <CollapsibleContent className="pl-4 text-popover-foreground outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-20 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
          {dirs.map((dir, subindex) => (
            <div key={subindex} className="border-b border-stone-200">
              {dir.is_dir ? (
                <FolderItem
                  dir={dir}
                  index={subindex}
                  setMainDir={setMainDir}
                  setMainPath={setMainPath}
                  refresh={refresh}
                  setRefresh={setRefresh}
                />
              ) : (
                <FileItem
                  dir={dir}
                  index={subindex}
                  refresh={refresh}
                  setRefresh={setRefresh}
                />
              )}
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
      <ContextMenuContent>
        <ContextMenuItem>Profile</ContextMenuItem>
        <ContextMenuItem>Billing</ContextMenuItem>
        <ContextMenuItem onClick={handleDelete}>
          <Trash className="h-5" />
          Delete
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => navigator.clipboard.writeText(dir.path)}
          className="flex items-center gap-2"
        >
          <Notebook className="h-5" /> Copy as path
        </ContextMenuItem>
        <ContextMenuItem className="flex items-center gap-2">
          <Wrench className="h-5" /> <span>Propperties </span>
        </ContextMenuItem>
        <ContextMenuItem>{formatSize(dir.size)}</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
