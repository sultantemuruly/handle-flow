import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useDragNode } from "@/hooks/useDragNode";
import { NodeActions } from "./node-actions";

interface NodeProps {
  id: string;
  x: number;
  y: number;
  label: string;
  description?: string;
  selected?: boolean;
  onDrag?: (x: number, y: number) => void;
  onClick?: () => void;
}

export const Node: React.FC<NodeProps> = ({
  id,
  x,
  y,
  label: initialLabel,
  description: initialDescription = "",
  selected,
  onDrag,
  onClick,
}) => {
  const [label, setLabel] = useState(initialLabel);
  const [description, setDescription] = useState(initialDescription);
  const { position, handleMouseDown, isDragging } = useDragNode({
    x,
    y,
    onDrag,
  });

  return (
    <div
      onMouseDown={handleMouseDown}
      onClick={onClick}
      className={cn(
        "absolute top-0 left-0 select-none w-48 cursor-move active:cursor-grabbing transition-all group",
        "bg-white rounded-2xl shadow-md border px-4 py-3",
        selected
          ? "border-blue-500 shadow-blue-200"
          : "border-gray-200 shadow-gray-100",
        isDragging && "shadow-lg"
      )}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isDragging ? "none" : "transform 0.1s ease-out",
      }}
    >
      <NodeActions nodeId={id} />

      {/* Label input */}
      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className={cn(
          "w-full text-sm font-semibold bg-transparent outline-none",
          "border-b border-transparent focus:border-gray-300"
        )}
        placeholder="Node label"
      />

      {/* Description input */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={cn(
          "w-full mt-1 text-xs bg-transparent outline-none resize-none",
          "border-b border-transparent focus:border-gray-200"
        )}
        placeholder="Description..."
        rows={2}
      />
    </div>
  );
};
