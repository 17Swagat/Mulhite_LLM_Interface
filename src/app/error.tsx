'use client';

import { useRouter } from "next/navigation";
import { startTransition } from "react";

/*
About `error.tsx`:=>
-> NOTE: error.tsx won't get trigger for error in a layout.tsx in the same segment.
*/

export default function ProductPage_Error({error, reset}: {error: Error, reset: ()=> void}){
    // NOTE: "Here, the `re-try` function will attempt to re-render Client Side."

    // Let's Try to hit server side Re-Trying:->
    const router = useRouter()
    const reload = ()=>{
        startTransition(()=>{
            router.refresh()
            reset()
        })
    }

    return (
        <div className="w-screen h-screen bg-pink-400 flex flex-col justify-center items-center">
            <h1 className="text-5xl font-bold">Error - Occured</h1>
            <h2 className="text-4xl font-bold">{error.message}</h2>
            <button type="button" onClick={reload} className="bg-green-700 text-2xl p-1 font-bold rounded-[10px]">Try Again</button>
        </div>
    );
}