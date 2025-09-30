'use client';
import { useState } from "react";
import ClientComponent2 from "./client-component-2";
import ServerComponent1 from "./server-component-1";

export default function ClientComponent1({children}: {children: React.ReactNode}) {
    // Including some sort of Client-Only Operation
    const [name, setName] = useState("Batman");

    return (
        <div className="bg-amber-700 p-3">
            <h1>Client Component 1: {name}</h1>
            <ClientComponent2/>
            {/* <ServerComponent1/> */}
            {children}
        </div>
    )
}