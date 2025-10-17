'use client';

import { useCounterStore } from "@/stores/learn_zustandStore";
import { useState } from "react";

export default function LearnZustandPage() {

    const { count, increament, decrement, update } = useCounterStore()

    const [input, setInput] = useState<number>(0);

    return (
        <div className="w-screen h-screen bg-black flex flex-col justify-center items-center text-white text-3xl">
            <div className="fixed top-2 w-full flex flex-col items-center">
                <h1 >Learn Zustand</h1>
                <hr className="bg-pink-300 w-full" />
            </div>

            <div>
                <h2>Counter Count</h2>
                <h3>{count}</h3>

                <div className="flex flex-col">
                    <button type="button" onClick={increament}>
                        Increase
                    </button>
                    <button type="button" onClick={decrement}>
                        Decrease
                    </button>

                </div>

                <form className="flex flex-col">
                    <input value={input} onChange={(e) => {
                        setInput(Number(e.target.value))
                    }} placeholder="Enter count" name="input" type="text" className="bg-white text-black border-2" />

                    <button type="button" onClick={() => { update(input) }}>
                        Update
                    </button>
                </form>
            </div>

        </div>
    );
}
