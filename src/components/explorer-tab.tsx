"use client";

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Calendar,
  ChevronRight,
  Inbox,
  Search,
  Settings,
  File,
  Folder,
} from "lucide-react";
import type { Dir } from "@/lib/types";
import FolderItem from "@/components/folder-item";
import FileItem from "@/components/file-item";
import { Input } from "./ui/input";

export default function ExplorerTab({ path }: { path: string }) {
  const [searchPath, setSearchPath] = useState<string>(path);
  const [dirs, setDirs] = useState<Dir[]>([]);
  const [search, setSearch] = useState<string>("");
  //   async function get_dirs() {
  //     let response: string[] = await invoke("get_download_dirs");
  //     console.log(response);
  //     setDirs(response);
  //   }
  //   useEffect(() => {
  //     get_dirs();
  //   }, []);

  async function getHomeDirs() {
    let response: Dir[] = await invoke("get_custom_dir", {
      customPath: searchPath,
    });
    console.log(response);
    setDirs(response);
  }
  useEffect(() => {
    getHomeDirs();
  }, []);

  return (
    <div className="w-full p-4 bg-stone-100 rounded-md -mt-4">
      <Input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      ></Input>
      <div className="grid grid-cols-2">
        {dirs.map((dir, index) => (
          <div key={index}>
            {dir.is_dir ? (
              <FolderItem dir={dir} index={index} setMainDir={setDirs} />
            ) : (
              <FileItem dir={dir} index={index} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
