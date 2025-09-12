"use client";
// import { useEffect } from "react";
import { useCallback } from "react";

import {
    ReactFlow,
    Background,
    MiniMap,
    Node,
    Edge,
    Controls,
    useNodesState,
    useEdgesState,
    Connection,
    addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes: Node[] = [
    {
        id: "1",
        position: { x: 0, y: 0 },
        data: { label: "Node 1" },
        style: { color: "red", backgroundColor: "rgba(16, 211, 110, 1)" },
    },
    {
        id: "2",
        position: { x: 100, y: 100 },
        data: { label: "Node 2" },
        style: { color: "blue", backgroundColor: "rgba(16, 211, 110, 1)" },
    },
    {
        id: "3",
        position: { x: 100, y: 200 },
        data: { label: "Node 3" },
        style: { color: "blue", backgroundColor: "rgba(16, 211, 110, 1)" },
    },
];

const initialEdges: Edge[] = [
    {
        id: "e1-2",
        source: "1",
        target: "2",
        animated: true,
        style: { stroke: "red" },
    },
];


export default function Graph() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback((connection: Connection) => {
        const edge:Edge = { ...connection, animated: true, id: `${edges.length + 1}`, style: { stroke: "red" } };
        setEdges(prevEdges => addEdge(edge, prevEdges))
    }, [setEdges]);

    return (
        // <div className="w-[85%] h-[90%] bg-gray-700  text-6xl rounded-2xl">
        <div className="w-screen h-screen bg-gray-700  text-6xl rounded-2xl">
            <ReactFlow fitView nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} >
                <Background color="rgba(255, 255, 0)" size={3} />
                <Controls style={{ color: "black" }} />
                <MiniMap style={{ backgroundColor: "pink" }} />
            </ReactFlow>
        </div>
    );
}
