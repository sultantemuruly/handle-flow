import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, MoreVertical } from "lucide-react";
import { useFlowStore } from "@/store/useFlowStore";

interface NodeActionsProps {
  nodeId: string;
}

export const NodeActions = ({ nodeId }: NodeActionsProps) => {
  const { deleteNode, duplicateNode } = useFlowStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0 absolute top-2 right-2"
        >
          <MoreVertical className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem onClick={() => duplicateNode(nodeId)}>
          <Copy className="mr-2 h-4 w-4" /> Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => deleteNode(nodeId)}>
          <Trash2 className="mr-2 h-4 w-4 text-red-500" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
