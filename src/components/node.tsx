import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface NodeProps {
  x: number;
  y: number;
  label: string;
  description?: string;
  selected?: boolean;
}

export const Node: React.FC<NodeProps> = ({
  x,
  y,
  label: initialLabel,
  description: initialDescription = "",
  selected,
}) => {
  const [label, setLabel] = useState(initialLabel);
  const [description, setDescription] = useState(initialDescription);

  return (
    <div
      className={cn(
        "absolute select-none w-48",
        "bg-white rounded-2xl shadow-md border px-4 py-3",
        selected
          ? "border-blue-500 shadow-blue-200"
          : "border-gray-200 shadow-gray-100"
      )}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
    >
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
