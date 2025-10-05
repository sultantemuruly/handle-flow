import React from "react";

interface EdgeProps {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  selected?: boolean;
}

export const Edge: React.FC<EdgeProps> = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  selected,
}) => {
  // simple cubic bezier curve between source and target
  const dx = targetX - sourceX;
  //   const dy = targetY - sourceY;
  const curvature = 0.3; // curve smoothness
  const path = `M${sourceX},${sourceY} C${
    sourceX + dx * curvature
  },${sourceY} ${targetX - dx * curvature},${targetY} ${targetX},${targetY}`;

  return (
    <path
      d={path}
      fill="none"
      stroke={selected ? "#3b82f6" : "#9ca3af"} // blue if selected, gray otherwise
      strokeWidth={2}
      className="transition-all duration-150"
    />
  );
};
