"use client";

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

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
  const [dirs, setDirs] = useState<string[]>([]);
  async function get_dirs() {
    let response: string[] = await invoke("get_download_dirs");
    console.log(response);
    setDirs(response);
  }
  useEffect(() => {
    get_dirs();
  }, []);
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <Collapsible className="duration-300 transition-transform">
              <SidebarMenu>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>C drive</SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {dirs.map((dir, index) => (
                      <SidebarMenuSubItem key={index}>
                        <SidebarMenuSubButton asChild>
                          {/* <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a> */}
                          <span>{dir}</span>
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
