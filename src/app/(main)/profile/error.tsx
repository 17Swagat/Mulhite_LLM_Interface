'use client';

import { useRouter } from "next/navigation";
import { startTransition } from "react";

/*
About `error.tsx`:=>
-> "It automatically wraps route segments and their nested children in a React Error Boundary."
-> "You can create custom error UIs for specific segments using the file-system hierarchy."
-> "It isolates errors to affected segments while keeping the rest of your app functional."
-> "It enables you to attempt to recover from an error without requiring a full page reload."
*/

export default function ProfilePage_Error({error, reset}: {error: Error, reset: ()=> void}){
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
            <button type="button" onClick={()=>reload()} className="bg-green-700 text-2xl p-1 font-bold rounded-[10px]">Try Again</button>
        </div>
    );
}