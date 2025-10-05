import React from "react";
import { Node } from "./node";
import { Edge } from "./edge";
import { useFlowStore } from "@/store/useFlowStore";

export const HandleFlow: React.FC = () => {
  // Read-only subscription
  const nodes = useFlowStore((state) => state.nodes);
  const edges = useFlowStore((state) => state.edges);

  // Write function (won't trigger rerenders)
  const updateNodePosition = useFlowStore((state) => state.updateNodePosition);

  return (
    <div className="relative w-full h-full bg-slate-100 overflow-hidden">
      <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded">
        Render test
      </div>

      {/* Edges */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {edges.map((edge) => {
          const source = nodes.find((n) => n.id === edge.source);
          const target = nodes.find((n) => n.id === edge.target);
          if (!source || !target) return null;

          return (
            <Edge
              key={edge.id}
              sourceX={source.x + 100}
              sourceY={source.y + 40}
              targetX={target.x + 100}
              targetY={target.y + 40}
              selected={edge.selected}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node) => (
        <Node
          key={node.id}
          {...node}
          onDrag={(x, y) => updateNodePosition(node.id, x, y)}
        />
      ))}
    </div>
  );
};
