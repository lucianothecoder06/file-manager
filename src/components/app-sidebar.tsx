"use client";

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  Calendar,
  ChevronRight,
  Home,
  Inbox,
  Search,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function AppSidebar() {
  const [dirs, setDirs] = useState<{name: string, path: string}[]>([]);
//   async function get_dirs() {
//     let response: string[] = await invoke("get_download_dirs");
//     console.log(response);
//     setDirs(response);
//   }
//   useEffect(() => {
//     get_dirs();
//   }, []);

  async function getHomeDirs() {
    let response: {name: string, path: string}[] = await invoke("get_home");
    console.log(response);
    setDirs(response);
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <Collapsible className="group">
              <SidebarMenu>
                <SidebarMenuButton className="flex items-center justify-start" onClick={getHomeDirs}>
                  <Home />
                  Home
                </SidebarMenuButton>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="flex items-center justify-between">
                    C drive
                    <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden transition-all duration-300 ease-in-out">
                  <SidebarMenuSub className="space-y-1 pt-1">
                    {dirs.map((dir, index) => (
                      <SidebarMenuSubItem key={index}>
                        <SidebarMenuSubButton asChild>
                          <span>{dir.name}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenu>
            </Collapsible>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
