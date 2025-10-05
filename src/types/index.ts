export interface EdgeData {
  id: string;
  source: string; // source node id
  target: string; // target node id
  selected?: boolean;
}

export interface NodeData {
  id: string;
  x: number;
  y: number;
  label: string;
}
