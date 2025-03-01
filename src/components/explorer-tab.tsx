"use client";

import { useEffect, useState, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { ImperativePanelHandle } from "react-resizable-panels";

import {
  Folder,
  ArrowLeft,
  ArrowRight,
  Sidebar,
  ScanEye,
  Search,
} from "lucide-react";
import type { Dir } from "@/lib/types";
import FolderItem from "@/components/folder-item";
import FileItem from "@/components/file-item";
import { Input } from "./ui/input";
import SideBar from "./side-bar";

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
  setTabs: (tabs: ETab[]) => void;
}) {
  const [searchPath, setSearchPath] = useState<string>(tab.path);
  const [dirs, setDirs] = useState<Dir[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPreCollapsed, setIsPreCollapsed] = useState(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const refSide = useRef<ImperativePanelHandle>(null);
  const refPreview = useRef<ImperativePanelHandle>(null);

  async function getDirs() {
    const response: Dir[] = await invoke("get_custom_dir", {
      customPath: searchPath,
    });
    console.log(response);
    setDirs(response);
  }

  async function handleSearch() {
    const response: Dir[] = await invoke("search", {
      customPath: searchPath,
      searchQuery: search,
    });
    setDirs(response);
    console.log("results");
    console.log(response);
  }

  useEffect(() => {
    if (search) {
      handleSearch();
    }
    else{
      getDirs();
    }
  }, [search]);

  useEffect(() => {
    getDirs();
    setTabs(
      tabs.map((newTab) =>
        newTab.id === tab.id ? { id: tab.id, path: searchPath } : newTab
      )
    );
  }, [searchPath, refresh]);

  function goBack() {
    setSearchPath(searchPath.slice(0, searchPath.lastIndexOf("\\")));
  }

  return (
    <div className="w-full p-4 bg-stone-100 rounded-md -mt-4 min-h-[94vh] max-h-[94vh]">
      <div className="flex flex-row gap-2 items-center mb-4">
        <Sidebar
          onClick={() => {
            refSide.current?.resize(isCollapsed ? 10 : 0);
            setIsCollapsed(!isCollapsed);
          }}
          className={`hover:cursor-pointer transition-colors  ${
            !isCollapsed ? "text-black" : "text-stone-300 hover:text-stone-500"
          }`}
        />
        <ArrowLeft
          onClick={goBack}
          className="hover:cursor-pointer transition duration-300"
        />
        <ArrowRight className="text-stone-300" />
        {/* {searchPath} */}
        <Input value={searchPath}></Input>
        <Input
          className="w-1/4"
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search onClick={handleSearch} />
        <ScanEye
          className={`hover:cursor-pointer transition-colors h-8 ${
            !isPreCollapsed ? "text-black" : "text-stone-400"
          }`}
          onClick={() => {
            refPreview.current?.resize(isPreCollapsed ? 10 : 0);
            setIsPreCollapsed(!isPreCollapsed);
          }}
        />
      </div>

      <ResizablePanelGroup
        direction="horizontal"
        className="w-full h-full gap-2"
      >
        <ResizablePanel
          defaultSize={10}
          maxSize={20}
          ref={refSide}
          className="bg-stone-100 rounded-md"
        >
          <SideBar setSearchPath={setSearchPath} />
        </ResizablePanel>
        <ResizableHandle />

        <ResizablePanel minSize={50}>
          <div className="flex flex-col overflow-auto max-h-[83vh] h-[93vh] border bg-stone-100 border-stone-200 rounded-md p-2">
            {dirs.map((dir, index) => (
              <div key={index} className="col-span-1 row-span-1">
                {dir.is_dir ? (
                  <FolderItem
                    dir={dir}
                    index={index}
                    setMainDir={setDirs}
                    setMainPath={setSearchPath}
                    refresh={refresh}
                    setRefresh={setRefresh}
                  />
                ) : (
                  <FileItem
                    dir={dir}
                    index={index}
                    refresh={refresh}
                    setRefresh={setRefresh}
                  />
                )}
              </div>
            ))}
          </div>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel
          defaultSize={15}
          maxSize={25}
          ref={refPreview}
          className="bg-stone-100 rounded-md"
        >
          <div className="w-full h-full border-stone-200 border rounded-md p-2 flex flex-col items-center">
            <span className="w-full text-left text-stone-300">Preview</span>
            <Folder className="w-32 h-32" />
            <h3>{searchPath}</h3>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      <div className="flex flex-row gap-2 items-center"></div>
    </div>
  );
}
