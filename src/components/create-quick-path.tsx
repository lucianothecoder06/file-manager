"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useState } from "react";

import { invoke } from "@tauri-apps/api/core";

export function CreateQuickPath() {
  const [name, setName] = useState<string>("");
  const [path, setPath] = useState<string>("");
  const [creating, setCreating] =useState<boolean>(false)

  const createQuickPath = async () => {
    setCreating(true)
    const data = {
        name: name,
        path: path,
    };
    await invoke("create_quickpath", {
        newQuickpath: data,
    });
    setCreating(false)
    
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Badge className="flex gap-2 items-center pl-2 text-black border border-stone-300 bg-stone-50 hover:bg-stone-100 hover:cursor-pointer">
          <Plus className="h-4 w-4 " />
          Add a quick
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="w-80" side="right">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">New Quick route</h4>
            <p className="text-sm text-muted-foreground">Fill out the form.</p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Name</Label>
              <Input id="width" className="col-span-2 h-8" defaultValue={name} onChange={(e)=>setName(e.target.value)} />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Full path</Label>
              <Input id="maxWidth" className="col-span-2 h-8" defaultValue={path} onChange={(e)=>setPath(e.target.value)} />
            </div>
          </div>
          <Button onClick={createQuickPath}>{creating ?  "Create" : "Creating"}</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
