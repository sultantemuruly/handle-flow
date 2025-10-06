import React from "react";
import { useDrag } from "react-dnd";

const nodeTypes = [
  { type: "process", label: "Process" },
  { type: "decision", label: "Decision" },
  { type: "end", label: "End" },
];

export const Palette: React.FC = () => {
  return (
    <div className="absolute top-0 right-0 w-48 h-full bg-white border-l border-gray-200 shadow-md p-3">
      <h3 className="font-semibold text-gray-700 mb-2 text-center">Palette</h3>

      {nodeTypes.map((node) => (
        <DraggableNode key={node.type} node={node} />
      ))}
    </div>
  );
};

const DraggableNode = ({ node }: { node: { type: string; label: string } }) => {
  const [, drag] = useDrag(() => ({
    type: "node",
    item: node,
  }));

  return (
    <div
      ref={(el) => {
        if (el) drag(el);
      }}
      className="p-2 mb-2 bg-slate-100 hover:bg-slate-200 cursor-grab rounded-md text-center border text-sm font-medium"
    >
      {node.label}
    </div>
  );
};
