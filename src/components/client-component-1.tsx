'use client';
import { useState } from "react";

export default function ClientComponent1() {
    // Including some sort of Client-Only Operation
    const [name, setName] = useState("Batman");

    return <h1>Client Component 1: {name}</h1>
}