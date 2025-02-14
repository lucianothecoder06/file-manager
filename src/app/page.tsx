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


export default function Home() {
  const [tabAmount, setTabAmout] = useState<number>(1);
  const [tabs, addTab] = useState();
  const [initialDir, setInitialDir] = useState("");

  async function getInitDir() {
    let response: string = await invoke("get_home_path"); 
    setInitialDir(response);
  }
  useEffect(()=>{getInitDir()},[])

  return (
    <div className="w-full p-4">
      <Tabs defaultValue="account+0">
        <SidebarTrigger />
        <TabsList>
        
          {Array.from({ length: tabAmount }, (_, index) => (
            <TabsTrigger
              value={`account-${index}`}
              key={index}
              id={`account-${index}`}
            >
              {"tab " + index}
            </TabsTrigger>
          ))}
          <Plus
            className="hover:cursor-pointer"
            onClick={() => {
              setTabAmout(tabAmount + 1);
            }}
          ></Plus>
        </TabsList>
        {Array.from({ length: tabAmount }, (_, index) => (
          <TabsContent key={index} value={`account-${index}`}>
            <ExplorerTab path={initialDir}/>
          </TabsContent>
        ))}
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
}
