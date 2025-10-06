import { useDrop } from "react-dnd";
import { v4 as uuidv4 } from "uuid";
import { useFlowStore } from "@/store/useFlowStore";
import { Node } from "./node";
import { Edge } from "./edge";
import { BackgroundGrid } from "./background-grid";
import React, { useState } from "react";

interface DragNodeItem {
  type: "node";
  label: string;
}

export const HandleFlow: React.FC = () => {
  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);
  const addNode = useFlowStore((s) => s.addNode);
  const updateNodePosition = useFlowStore((s) => s.updateNodePosition);
  const addEdge = useFlowStore((s) => s.addEdge);

  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

  // Handle drag-and-drop from palette
  const [, drop] = useDrop(
    () => ({
      accept: "node",
      drop: (item: DragNodeItem, monitor) => {
        const offset = monitor.getClientOffset();
        if (!offset) return;

        const canvasRect = (
          document.querySelector(".handleflow-canvas") as HTMLDivElement
        )?.getBoundingClientRect();

        if (!canvasRect) return;

        // calculate position relative to canvas
        const x = offset.x - canvasRect.left;
        const y = offset.y - canvasRect.top;

        addNode({
          id: uuidv4(),
          x,
          y,
          label: item.label,
        });
      },
    }),
    [addNode]
  );

  const handleNodeSelect = (id: string) => {
    setSelectedNodes((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const handleConnectNodes = () => {
    if (selectedNodes.length === 2) {
      addEdge(selectedNodes[0], selectedNodes[1]);
      setSelectedNodes([]);
    } else {
      alert("Select exactly 2 nodes to connect.");
    }
  };

  return (
    <div
      ref={(el) => {
        if (el) drop(el);
      }}
      className="handleflow-canvas relative w-full h-full bg-slate-100 overflow-hidden"
    >
      <BackgroundGrid
        width={2000}
        height={2000}
        gridSize={20}
        dotSize={1}
        symbol="."
        opacity={0.7}
      />

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
