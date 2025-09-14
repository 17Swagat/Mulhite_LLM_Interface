'use client';

import { useState } from "react";


export function Counter(){
    const [count, setCount] = useState(0);

    const incrementCount = ()=>{
        setCount(prev => (++prev));
    }

    return (
        <div className="w-screen h-screen bg-amber-600 flex flex-col items-center justify-center text-white text-5xl">
            <div>
                Counter: {count}
            </div>
            <button type="button" onClick={incrementCount} className="bg-blue-400 p-2 rounded-2xl">Add</button>
        </div>
    );
}