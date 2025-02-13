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


export default function Home() {
  const [dirs, setDirs] = useState<
    Dir[]
  >([]);
  //   async function get_dirs() {
  //     let response: string[] = await invoke("get_download_dirs");
  //     console.log(response);
  //     setDirs(response);
  //   }
  //   useEffect(() => {
  //     get_dirs();
  //   }, []);

  async function getHomeDirs() {
    let response: Dir[] =
      await invoke("get_home");
    console.log(response);
    setDirs(response);
  }
  useEffect(() => {
    getHomeDirs();
  }, []);

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-2">
        {dirs.map((dir, index) => (
          <div key={index}>
            {dir.is_dir ? (
              <FolderItem dir={dir} index={index}/>
            ) : (
              <div className="text-black flex col-span-1 gap-2" key={index}>
                <File className="h-6 w-auto" />
                <span>{dir.name}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
