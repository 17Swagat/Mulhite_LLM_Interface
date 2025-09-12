import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export default function Graph(){
    return (
    <div className="w-[85%] h-[90%] bg-gray-700  text-6xl">
        <ReactFlow
            fitView
         >
            <Background color='rgba(255, 255, 0)' size={3} />
        </ReactFlow>
    </div>)
}