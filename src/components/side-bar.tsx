"use client";

import { Home, Flag, Plus, Download, Book } from "lucide-react";
import { Separator } from "./ui/separator";
import { Badge } from "@/components/ui/badge";
import { invoke } from "@tauri-apps/api/core";
import { CreateQuickPath } from "./create-quick-path";
import { useEffect, useState } from "react";

interface QuickPath {
  name: string;
  full_path: string;
}

export default function SideBar({
  setSearchPath,
}: {
  setSearchPath: (path: string) => void;
}) {
  const [quickPaths, setQuickPaths] = useState<QuickPath[]>([]);

  const goHome = async () => {
    const response: string = await invoke("get_home_path");
    setSearchPath(response);
  };
  const goDownload = async () => {
    const response: string = await invoke("get_download_path");
    setSearchPath(response);
  };
  const goDocuments = async () => {
    const response: string = await invoke("get_document_path");
    setSearchPath(response);
  };

  async function getQuickPaths() {
    const response: QuickPath[] = await invoke("get_quickpaths");
    setQuickPaths(response);
  }

  useEffect(() => {
    getQuickPaths();
  }, []);

  return (
    <div className="w-full h-full border-stone-200 border rounded-md p-2">
      <div className="flex flex-col items-left justify-left w-full mb-4">
        <span>Quick routes</span>
        <div
          className="flex gap-2 items-center pl-2 hover:cursor-pointer"
          onClick={goHome}
        >
          <Home className="h-4 w-4" />
          Home
        </div>
        <div
          className="flex gap-2 items-center pl-2 hover:cursor-pointer"
          onClick={goDocuments}
        >
          <Book className="h-4 w-4" />
          Documents
        </div>
        <div
          className="flex gap-2 items-center pl-2 hover:cursor-pointer"
          onClick={goDownload}
        >
          <Download className="h-4 w-4" />
          Download
        </div>
        {quickPaths.map((quickPath, index) => (
          <div
            key={index}
            className="flex gap-2 items-center pl-2 hover:cursor-pointer"
            onClick={() => setSearchPath(quickPath.full_path)}
          >
            <Flag className="h-4 w-4" />
            {quickPath.name}
          </div>
        ))}
        <CreateQuickPath />
      </div>
      <Separator />
      <div className="my-4">
        <span>Labels</span>
        <div className="flex flex-col gap-2 pl-2">
          <Badge className="flex gap-2 items-center bg-orange-600 hover:bg-orange-500 hover:cursor-pointer">
            <Flag className="h-4 w-4" />
            Memories
          </Badge>
          <Badge className="flex gap-2 items-center pl-2 bg-red-600 hover:bg-red-500 hover:cursor-pointer">
            <Flag className="h-4 w-4" />
            Game files
          </Badge>
          <Badge className="flex gap-2 items-center pl-2 text-black border border-stone-300 bg-stone-50 hover:bg-stone-100 hover:cursor-pointer">
            <Plus className="h-4 w-4 " />
            Add a label
          </Badge>
        </div>
      </div>
      <Separator />
    </div>
  );
}
