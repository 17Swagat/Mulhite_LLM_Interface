'use client';
import { useState } from "react";

export default function ClientComponent2() {
    // Including some sort of Client-Only Operation
    const [name, setName] = useState("Superman");

    return <h1>Client Component 2: {name}</h1>
}
