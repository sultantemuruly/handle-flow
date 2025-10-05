// import { useEffect } from "react";
// import { useFlowStore } from "@/store/useFlowStore";
// import { HandleFlow } from "@/components/handle-flow";

// function App() {
//   const { nodes, setInitialData } = useFlowStore((state) => ({
//     nodes: state.nodes,
//     setInitialData: state.setInitialData,
//   }));

//   useEffect(() => {
//     const nodes = [
//       { id: "1", x: 200, y: 120, label: "Start" },
//       { id: "2", x: 350, y: 250, label: "Process" },
//       { id: "3", x: 600, y: 380, label: "End" },
//     ];

//     const edges = [
//       { id: "e1-2", source: "1", target: "2" },
//       { id: "e2-3", source: "2", target: "3" },
//     ];

//     setInitialData(nodes, edges);
//   }, [setInitialData]);

//   if (nodes.length === 0) {
//     return <div className="text-center mt-10">Loading flow...</div>;
//   }

//   return (
//     <div className="w-full h-screen">
//       <HandleFlow />
//     </div>
//   );
// }

// export default App;

import { HandleFlow } from "@/components/handle-flow";

function App() {
  return (
    <div className="w-full h-screen">
      <HandleFlow />
    </div>
  );
}

export default App;
