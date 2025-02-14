"use client";

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { Dir } from "@/lib/types";
import FolderItem from "@/components/folder-item";
import FileItem from "@/components/file-item";
import ExplorerTab from "@/components/explorer-tab";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface ETab {
  id: number;
  path: string;
}

export default function Home() {
  const [tabAmount, setTabAmout] = useState<number>(0);
  const [initialDir, setInitialDir] = useState("");
  const [tabs, setTabs] = useState<ETab[]>([]);

  async function getInitDir() {
    let response: string = await invoke("get_home_path");
    setInitialDir(response);
    setTabs([...tabs, { id: tabAmount + 1, path: response }]);
    setTabAmout(tabAmount + 1);
  }
  useEffect(() => {
    getInitDir();
  }, []);
  return (
    <div className="w-full p-4">
      <Tabs defaultValue="account+0">
        <SidebarTrigger />
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger
              value={`account-${tab.id}`}
              key={tab.id}
              id={`account-${tab.id}`}
            >
              {tab.path.slice(tab.path.lastIndexOf("\\"))}
            </TabsTrigger>
          ))}
          <Plus
            className="hover:cursor-pointer"
            onClick={() => {
              setTabAmout(tabAmount + 1);
              setTabs([...tabs, { id: tabAmount + 1, path: initialDir }]);
            }}
          ></Plus>
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={`account-${tab.id}`}>
            <ExplorerTab tab={tab} tabs={tabs} setTabs={setTabs} />
          </TabsContent>
        ))}
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
}
