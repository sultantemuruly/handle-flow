import { create } from "zustand";

export interface NodeData {
  id: string;
  x: number;
  y: number;
  label: string;
  description?: string;
}

export interface EdgeData {
  id: string;
  source: string;
  target: string;
  selected?: boolean;
}

interface FlowState {
  nodes: NodeData[];
  edges: EdgeData[];
  setInitialData: (nodes: NodeData[], edges: EdgeData[]) => void;
  updateNodePosition: (id: string, x: number, y: number) => void;
  addNode: (node: NodeData) => void;
  addEdge: (sourceId: string, targetId: string) => void;
  deleteNode: (id: string) => void;
  duplicateNode: (id: string) => void;
}

export const useFlowStore = create<FlowState>((set) => ({
  nodes: [],
  edges: [],

  setInitialData: (nodes, edges) => set({ nodes, edges }),

  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),

  updateNodePosition: (id, x, y) =>
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === id ? { ...n, x, y } : n)),
    })),

  addEdge: (sourceId, targetId) =>
    set((state) => ({
      edges: [
        ...state.edges,
        {
          id: `e${sourceId}-${targetId}`,
          source: sourceId,
          target: targetId,
          selected: false,
        },
      ],
    })),

  deleteNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter(
        (edge) => edge.source !== id && edge.target !== id
      ),
    })),

  duplicateNode: (id) =>
    set((state) => {
      const node = state.nodes.find((n) => n.id === id);
      if (!node) return state;

      const newNode = {
        ...node,
        id: Date.now().toString(),
        x: node.x + 40,
        y: node.y + 40,
        label: `${node.label} (copy)`,
      };

      return { nodes: [...state.nodes, newNode] };
    }),
}));
