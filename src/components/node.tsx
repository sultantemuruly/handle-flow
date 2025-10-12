import React, { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useDragNode } from "@/hooks/useDragNode";
import { NodeActions } from "./node-actions";

type ResizeEdge = "right" | "bottom" | "corner";

interface NodeProps {
  id: string;
  x: number;
  y: number;
  label: string;
  description?: string;
  selected?: boolean;
  onDrag?: (x: number, y: number) => void;
  onClick?: () => void;

  // NEW (optional)
  width?: number; // initial width (px)
  height?: number; // initial height (px)
  minWidth?: number; // default 160
  minHeight?: number; // default 96
  maxWidth?: number; // optional hard cap
  maxHeight?: number; // optional hard cap
  onResize?: (w: number, h: number) => void;
  lockAspectRatio?: boolean; // keep aspect ratio when resizing from the corner
}

export const Node: React.FC<NodeProps> = ({
  id,
  x,
  y,
  label: initialLabel,
  description: initialDescription = "",
  selected,
  onDrag,
  onClick,

  // NEW (optional)
  width,
  height,
  minWidth = 160,
  minHeight = 96,
  maxWidth,
  maxHeight,
  onResize,
  lockAspectRatio = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [label, setLabel] = useState(initialLabel);
  const [description, setDescription] = useState(initialDescription);
  const [isResizing, setIsResizing] = useState(false);

  // Size state (defaults match your old ~w-48 = 192px)
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: width ?? 192,
    height: height ?? 120,
  });

  // If no explicit height was passed, measure once after mount
  useLayoutEffect(() => {
    if (height == null && containerRef.current) {
      const measured = containerRef.current.offsetHeight;
      setSize((s) => ({ ...s, height: Math.max(s.height, measured) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { position, handleMouseDown, isDragging } = useDragNode({
    x,
    y,
    onDrag,
  });

  const clamp = (val: number, min: number, max?: number) =>
    Math.max(min, max != null ? Math.min(val, max) : val);

  const startResize = (edge: ResizeEdge, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = size.width;
    const startH = size.height;
    const ratio = startW / startH;

    setIsResizing(true);

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      let newW = startW;
      let newH = startH;

      if (edge === "right" || edge === "corner") {
        newW = clamp(startW + dx, minWidth, maxWidth);
      }
      if (edge === "bottom" || edge === "corner") {
        newH = clamp(startH + dy, minHeight, maxHeight);
      }

      if (edge === "corner" && lockAspectRatio) {
        // Adjust one dimension to preserve aspect ratio based on the larger change
        const useWidth = Math.abs(newW - startW) >= Math.abs(newH - startH);
        if (useWidth) {
          newH = clamp(Math.round(newW / ratio), minHeight, maxHeight);
        } else {
          newW = clamp(Math.round(newH * ratio), minWidth, maxWidth);
        }
      }

      setSize({ width: newW, height: newH });
    };

    const onUp = () => {
      setIsResizing(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      onResize?.(size.width, size.height);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={isResizing ? undefined : handleMouseDown}
      onClick={onClick}
      className={cn(
        "absolute top-0 left-0 select-none cursor-move active:cursor-grabbing transition-all group",
        "bg-white rounded-2xl shadow-md border px-4 py-3",
        "overflow-auto", // allow scroll when content exceeds height
        selected
          ? "border-blue-500 shadow-blue-200"
          : "border-gray-200 shadow-gray-100",
        (isDragging || isResizing) && "shadow-lg"
      )}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition:
          isDragging || isResizing ? "none" : "transform 0.1s ease-out",
        width: `${size.width}px`,
        height: `${size.height}px`,
        // optional: prevent text selection during resize (inputs still ok because handles stop propagation)
        userSelect: isResizing ? "none" : undefined,
      }}
      data-node-id={id}
      data-resizing={isResizing ? "true" : "false"}
    >
      <NodeActions nodeId={id} />

      {/* Label input */}
      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className={cn(
          "w-full text-sm font-semibold bg-transparent outline-none",
          "border-b border-transparent focus:border-gray-300"
        )}
        placeholder="Node label"
      />

      {/* Description input */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={cn(
          "w-full mt-1 text-xs bg-transparent outline-none resize-none",
          "border-b border-transparent focus:border-gray-200"
        )}
        placeholder="Description..."
        rows={2}
      />

      {/* === Resize handles === */}
      {/* Right edge */}
      <div
        aria-label="resize-right"
        onMouseDown={(e) => startResize("right", e)}
        className={cn(
          "absolute top-0 right-0 h-full w-1.5 cursor-ew-resize",
          "opacity-0 group-hover:opacity-100 transition-opacity",
          "bg-blue-500/0 group-hover:bg-blue-500/10"
        )}
      />

      {/* Bottom edge */}
      <div
        aria-label="resize-bottom"
        onMouseDown={(e) => startResize("bottom", e)}
        className={cn(
          "absolute left-0 bottom-0 w-full h-1.5 cursor-ns-resize",
          "opacity-0 group-hover:opacity-100 transition-opacity",
          "bg-blue-500/0 group-hover:bg-blue-500/10"
        )}
      />

      {/* Bottom-right corner */}
      <div
        aria-label="resize-corner"
        onMouseDown={(e) => startResize("corner", e)}
        className={cn(
          "absolute bottom-0 right-0 w-3 h-3 rounded-br-2xl cursor-nwse-resize",
          "opacity-0 group-hover:opacity-100 transition-opacity",
          "bg-blue-500/60"
        )}
        title="Drag to resize"
      />
    </div>
  );
};
