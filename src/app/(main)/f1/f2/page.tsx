'use client'

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function F2_Page(){

    const router = useRouter();

    useEffect(()=>{
        router.replace('/f1')
    }, [])

    return (
        <div>
            {/* <h1 className="text-4xl">F2 Page</h1>
            <Link href='/f1' className="bg-amber-600 text-3xl p-2">F1</Link> */}
        </div>
    );
}