import { useState, useCallback, useEffect } from "react";
import { snapToGrid } from "@/utils/math";

interface UseDragNodeProps {
  x: number;
  y: number;
  onDrag?: (newX: number, newY: number) => void;
}

export const useDragNode = ({ x, y, onDrag }: UseDragNodeProps) => {
  const [position, setPosition] = useState({ x, y });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsDragging(true);

      setOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    },
    [position]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;

      setPosition({ x: newX, y: newY });
      onDrag?.(newX, newY);
    },
    [isDragging, offset, onDrag]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    setPosition((prev) => {
      const snappedX = snapToGrid(prev.x);
      const snappedY = snapToGrid(prev.y);
      onDrag?.(snappedX, snappedY);
      return { x: snappedX, y: snappedY };
    });
  }, [isDragging, onDrag]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    position,
    isDragging,
    handleMouseDown,
  };
};
