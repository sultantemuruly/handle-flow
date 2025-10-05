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
}));
