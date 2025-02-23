import { Home, Flag, Plus } from "lucide-react";
import { Separator } from "./ui/separator";
import { Badge } from "@/components/ui/badge";

export default function SideBar() {
  return (
    <div className="w-full h-full border-stone-200 border rounded-md p-2">
      <div className="flex flex-col items-left justify-left w-full h-16">
        <span>Quick routes</span>
        <div className="flex gap-2 items-center pl-2">
          <Home className="h-4 w-4" />
          Home
        </div>
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
