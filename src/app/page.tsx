"use client";

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ExplorerTab from "@/components/explorer-tab";
import { Plus, X } from "lucide-react";

interface ETab {
  id: number;
  path: string;
}

export default function Home() {
  const [tabAmount, setTabAmout] = useState<number>(1);
  const [initialDir, setInitialDir] = useState("");
  const [tabs, setTabs] = useState<ETab[]>([]);

  async function getInitDir() {
    const response: string = await invoke("get_home_path");
    setInitialDir(response);
    setTabs([{ id: tabAmount + 1, path: response }]);
    setTabAmout(tabAmount + 1);
  }

  useEffect(() => {
    getInitDir();

  },[]);
  return (
    <div className="w-full p-4">
      <Tabs defaultValue="account+0">
        <TabsList className="max-w-[85vw] overflow-x-auto h-fit ml-8 bg-stone-100" >
          {tabs.map((tab) => (
            <TabsTrigger
              className="flex items-center justify-between gap-8"
              value={`account-${tab.id}`}
              key={tab.id}
              id={`account-${tab.id}`}
            >
              {tab.path.slice(tab.path.lastIndexOf("\\"))}
              <X
                className="h-4"
                onClick={() => {
                  setTabs(tabs.filter((t) => t.id !== tab.id));
                }}
              />
            </TabsTrigger>
          ))}
          <Plus
            className="hover:cursor-pointer h-5 ml-4"
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
      </Tabs>
    </div>
  );
}
