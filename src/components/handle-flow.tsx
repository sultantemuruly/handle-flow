import React from "react";
import { useFlowStore } from "@/store/useFlowStore";

import { Node } from "./node";
import { Edge } from "./edge";

import { BackgroundGrid } from "./background-grid";

export const HandleFlow: React.FC = () => {
  // Read-only subscription
  const nodes = useFlowStore((state) => state.nodes);
  const edges = useFlowStore((state) => state.edges);

  // Write function (won't trigger rerenders)
  const updateNodePosition = useFlowStore((state) => state.updateNodePosition);

  return (
    <div className="relative w-full h-full bg-slate-100 overflow-hidden">
      <BackgroundGrid
        width={2000}
        height={2000}
        gridSize={20}
        dotSize={1}
        symbol="."
        opacity={0.7}
      />

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
