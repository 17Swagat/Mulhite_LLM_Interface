// 'use client'

import Link from "next/link";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

export default function F2_Page(){

    // const router = useRouter();

    // useEffect(()=>{
    //     router.replace('/f1')
    // }, [])

    return (
        <div>
            <h1 className="text-4xl">F2 Page</h1>
            <div className="flex flex-col gap-2">
                <Link href='/f1' className="w-fit bg-amber-600 text-3xl p-2">F1</Link>
                <Link href='/f4' className="w-fit bg-red-600 text-3xl p-2">F4</Link>
            </div>
        </div>
    );
}