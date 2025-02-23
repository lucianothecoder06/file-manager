"use client";
import { useEffect, useState } from "react";
import { Folder, File, FolderOpen, Ellipsis } from "lucide-react";
import type { Dir } from "@/lib/types";
import { invoke } from "@tauri-apps/api/core";
import { readFile } from "@tauri-apps/plugin-fs";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";

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
    return <img src={`${dir.path}`} width="24px" height="24px" />;
  } else if (dir.file_type === "tsx") {
    return (
      <img src={`vivid/ts.svg`} width="16px" height="16px" />
    );
  } else {
    return (
      <img src={`vivid/${dir.file_type}.svg`} width="16px" height="16px" />
    );
  }
}

export default function FileItem({ dir, index }: { dir: Dir; index: number }) {
  const lastAccessed = timeAgo(dir.last_accessed.secs_since_epoch);

  return (
    <div
      className="text-black flex justify-between pr-4 col-span-1 gap-4"
      key={index}
    >
      <div className="flex gap-4  hover:cursor-pointer">
        {getFileIcon(dir)}

        <span>{dir.name.substring(0, 30)}</span>
      </div>
      <div className="flex items-center justify-center gap-2">
        <span>{lastAccessed}</span>
        <Popover>
          <PopoverTrigger>
            <Ellipsis />
          </PopoverTrigger>
          <PopoverContent className="w-44">
            <div className="text-sm flex flex-col gap-4">
              <Button>Open</Button>
              <Button>Copy</Button>
              <Button>Move</Button>
              <Button>Properties</Button>
              <Button>Delete</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
