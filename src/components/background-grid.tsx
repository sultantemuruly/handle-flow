import React from "react";
import { snapToGrid } from "@/utils/math";

interface BackgroundGridProps {
  width: number;
  height: number;
  gridSize?: number; // spacing between dots
  dotSize?: number;
  dotColor?: string;
  symbol?: "." | "+" | "x";
  opacity?: number;
}

export const BackgroundGrid: React.FC<BackgroundGridProps> = ({
  width,
  height,
  gridSize = 20,
  dotSize = 2,
  dotColor = "gray",
  symbol = ".",
  opacity = 0.7,
}) => {
  const columns = Math.ceil(width / gridSize);
  const rows = Math.ceil(height / gridSize);

  const dots = [];
  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col <= columns; col++) {
      const x = snapToGrid(col * gridSize, gridSize);
      const y = snapToGrid(row * gridSize, gridSize);

      dots.push(
        symbol === "." ? (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r={dotSize}
            fill={dotColor}
            opacity={opacity}
          />
        ) : (
          <text
            key={`${x}-${y}`}
            x={x}
            y={y + dotSize}
            fontSize={dotSize * 4}
            fill={dotColor}
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {symbol}
          </text>
        )
      );
    }
  }

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      {dots}
    </svg>
  );
};
