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
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import type { Dir } from "@/lib/types";
import FolderItem from "@/components/folder-item";
import FileItem from "@/components/file-item";
import { Input } from "./ui/input";
interface ETab {
  id: number;
  path: string;
}
export default function ExplorerTab({
  tab,
  tabs,
  setTabs,
}: {
  tab: ETab;
  tabs: ETab[];
  setTabs: Function;
}) {
  const [searchPath, setSearchPath] = useState<string>(tab.path);
  const [dirs, setDirs] = useState<Dir[]>([]);
  const [search, setSearch] = useState<string>("");

  async function getDirs() {
    let response: Dir[] = await invoke("get_custom_dir", {
      customPath: searchPath,
    });
    console.log(response);
    setDirs(response);
  }
  useEffect(() => {
    getDirs();
    setTabs(
      tabs.map((newTab) =>
        newTab.id === tab.id ? { id: tab.id, path: searchPath } : newTab
      )
    );
  }, [searchPath]);

  function goBack() {
    setSearchPath(searchPath.slice(0, searchPath.lastIndexOf("\\")));
  }

  return (
    <div className="w-full p-4 bg-stone-100 rounded-md -mt-4 min-h-[90vh]">
      <div className="flex flex-row gap-2 items-center mb-4">
        <ArrowLeft
          onClick={goBack}
          className="hover:cursor-pointer transition duration-300"
        />
        <ArrowRight className="text-stone-300" />
        {/* {searchPath} */}
        <Input
          value={searchPath}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        ></Input>
      </div>

      <div className="grid grid-cols-2">
        {dirs.map((dir, index) => (
          <div key={index}>
            {dir.is_dir ? (
              <FolderItem
                dir={dir}
                index={index}
                setMainDir={setDirs}
                setMainPath={setSearchPath}
              />
            ) : (
              <FileItem dir={dir} index={index} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
