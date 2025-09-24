'use client'
import { LoadingCircle } from "@/components/3rdParty/loading";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function F3_Page(){
    const router = useRouter();
    useEffect(()=>{
        router.replace('/f1')
    }, [])

    return (
        <div>
            {/* <h1 className="text-4xl">F3 Page</h1>
            <Link href='/f1' className="bg-amber-600 text-3xl p-2">F1</Link> */}
            <LoadingCircle/>
        </div>
    );
}