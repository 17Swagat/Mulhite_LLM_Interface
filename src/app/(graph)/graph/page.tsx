import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  MiniMap,
  Node,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const nodes: Node[] = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: { label: "Node 1" },
    style: { color: "red", backgroundColor: 'rgba(16, 211, 110, 1)' },
  },
  { id: "2", position: { x: 100, y: 100 }, data: { label: "Node 2" }, style: { color: "blue", backgroundColor: 'rgba(16, 211, 110, 1)' } },
];

const edges: Edge[] = [];

export default function Graph() {
  return (
    <div className="w-[85%] h-[90%] bg-gray-700  text-6xl">
      <ReactFlow fitView nodes={nodes}>
        <Background color="rgba(255, 255, 0)" size={3} />
      </ReactFlow>
    </div>
  );
}
