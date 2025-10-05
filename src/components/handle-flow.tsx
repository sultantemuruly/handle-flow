import React, { useState } from "react";
import { useFlowStore } from "@/store/useFlowStore";

import { Node } from "./node";
import { Edge } from "./edge";
import { BackgroundGrid } from "./background-grid";

export const HandleFlow: React.FC = () => {
  const nodes = useFlowStore((state) => state.nodes);
  const edges = useFlowStore((state) => state.edges);
  const updateNodePosition = useFlowStore((state) => state.updateNodePosition);
  const addEdge = useFlowStore((state) => state.addEdge);

  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

  const handleNodeSelect = (id: string) => {
    setSelectedNodes((prev) => {
      if (prev.includes(id)) return prev.filter((nid) => nid !== id);
      return [...prev, id];
    });
  };

  const handleConnectNodes = () => {
    if (selectedNodes.length === 2) {
      addEdge(selectedNodes[0], selectedNodes[1]);
      setSelectedNodes([]); // reset selection
    } else {
      alert("Select exactly 2 nodes to connect.");
    }
  };

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

      {/* Connect button */}
      <button
        className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded z-10"
        onClick={handleConnectNodes}
      >
        Connect Nodes
      </button>

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
          selected={selectedNodes.includes(node.id)}
          onClick={() => handleNodeSelect(node.id)}
          onDrag={(x, y) => updateNodePosition(node.id, x, y)}
        />
      ))}
    </div>
  );
};
