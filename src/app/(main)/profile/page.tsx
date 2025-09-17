'use client';
import Link from "next/link";
import { useState } from "react";
import { LoadingCircle } from "@/components/3rdParty/loading";

function getRandomInt(count: number){
    return Math.floor(
        Math.random() * count
    )
}

export default function Profile() {

    const [isLoading, setIsLoading] = useState(false)
    const onBtnClick = ()=> {
        setIsLoading(true)
        setTimeout(()=>  {
            setIsLoading(false)
        }, 1200);
    }

    const random = getRandomInt(2);
    if (random == 1) {
        throw new Error('Error Loading Page')
    }


    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-purple-900 ">
            <h1>Profile Page</h1>
            <p>This is the profile page of our application.</p> 

            <Link
                href="/"
                className="text-white bg-purple-400 p-2 rounded-[10px] ml-10 text-3xl"
            >
                Home
            </Link>
            <div className="bg-blue-400 mt-5 text-3xl">
                {!isLoading && <button type="button" onClick={onBtnClick} className="bg-red-400 p-1 hover:brightness-75">Loading Text button</button>}
                {isLoading && <LoadingCircle/>}
            </div>
        </div>
    );
}