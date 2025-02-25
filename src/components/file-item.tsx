"use client";

import type { Dir } from "@/lib/types";
import { invoke } from "@tauri-apps/api/core";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Wrench, Notebook, Trash } from "lucide-react";

function timeAgo(timestampSeconds: number): string {
  const pastDate = new Date(timestampSeconds * 1000); // Convert seconds to milliseconds
  const now = new Date();
  const diffMs = now.getTime() - pastDate.getTime(); // Difference in milliseconds

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.44); // Approximate month length
  const years = Math.floor(days / 365.25); // Account for leap years

  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
}

function getFileIcon(dir: Dir) {
  console.log(dir.file_type);

  if (
    dir.file_type === "jpg" ||
    dir.file_type === "png" ||
    dir.file_type === "jpeg"
  ) {
    console.log("hola");
    return (
      <picture>
        <img src={`${dir.path}`} width="24px" height="24px" alt="." />;
      </picture>
    );
  } else if (dir.file_type === "tsx") {
    return (
      <picture>
        <img src={`vivid/ts.svg`} width="16px" height="16px" alt="." />;
      </picture>
    );
  } else {
    return (
      <picture>
        <img
          src={`vivid/${dir.file_type}.svg`}
          width="16px"
          height="16px"
          alt="."
        />
      </picture>
    );
  }
}

export default function FileItem({ dir, index }: { dir: Dir; index: number }) {
  const lastAccessed = timeAgo(dir.last_accessed.secs_since_epoch);

  const handleDelete = async ()=>{
    await invoke("delete_file", {
      customPath: dir.path,
    })
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger
        className="text-black flex justify-between pr-4 col-span-1 gap-4"
        key={index}
      >
        <div className="flex gap-4  hover:cursor-pointer">
          {getFileIcon(dir)}

          <span>{dir.name.substring(0, 30)}</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <span>{lastAccessed}</span>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Profile</ContextMenuItem>
        <ContextMenuItem onClick={handleDelete}>
          <Trash className="h-5"/>
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
        <ContextMenuItem>{dir.size} bytes</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
