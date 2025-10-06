import { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { useFlowStore } from "./store/useFlowStore";
import { HandleFlow } from "./components/handle-flow";
import { Palette } from "./components/palette";

function App() {
  const nodes = useFlowStore((state) => state.nodes);

  const setInitialData = useFlowStore((state) => state.setInitialData);

  // initialize nodes and edges once
  useEffect(() => {
    const initialNodes = [
      { id: "1", x: 200, y: 120, label: "Start" },
      { id: "2", x: 350, y: 250, label: "Process 1" },
      { id: "3", x: 600, y: 380, label: "Process 2" },
      { id: "4", x: 800, y: 100, label: "End" },
    ];

    const initialEdges = [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
    ];

    setInitialData(initialNodes, initialEdges);
  }, []); // run only once on mount

  // simple loading state if needed
  if (nodes.length === 0) {
    return <div className="text-center mt-10">Loading flow...</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative w-full h-screen flex">
        <div className="flex-1">
          <HandleFlow />
        </div>
        <Palette />
      </div>
    </DndProvider>
  );
}

export default App;
