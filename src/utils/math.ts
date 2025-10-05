export const snapToGrid = (value: number, gridSize = 5): number => {
  return Math.round(value / gridSize) * gridSize;
};
