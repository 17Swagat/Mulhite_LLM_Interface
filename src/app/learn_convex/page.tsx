// Learning About Convex Auth

"use client";

import { Authenticated, AuthLoading, Unauthenticated, useConvexAuth, useMutation } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from '@/../convex/_generated/api'
import { useState } from "react";

export default function Home() {
    return (
        <>
            <Authenticated>
                <UserButton />
                <Content />
            </Authenticated>
            <Unauthenticated>
                <SignInButton />
            </Unauthenticated>
            <AuthLoading>
                <div>Loading...</div>
            </AuthLoading>
        </>
    );
}

function Content() {

    // useA(api.testing.messages.getForCurrentUser);
    const [inputText, setInputText] = useState<string>('');

    const postMessage = useMutation(api.testing.messages.postMessageByUser)

    const postsByUser = useQuery(api.testing.messages.messagesByUser)


    return (
        <div className="w-screen h-screen bg-black text-white flex flex-col justify-center items-center">
            {/* Post Messages By User: */}
            <form onSubmit={(e) => {
                e.preventDefault()
                postMessage({ message: inputText })
                setInputText('')
            }} className="bg-purple-600 flex flex-col">
                <input value={inputText} onChange={(e) => {
                    setInputText(e.target.value)
                }} type="text" placeholder="Enter Post:" className="p-1 bg-white text-black placeholder:text-black placeholder:text-3xl text-3xl" />
                <button type="submit" className="text-2xl">
                    Post
                </button>

            </form>

            {/* Retrive Messages By User: */}
            <div className="flex flex-col text-2xl gap-2 space-y-2">
                {postsByUser?.map((doc) => {
                    return (<div key={doc._id} className="bg-green-500">
                        {doc.message}
                    </div>)
                })}

            </div>
        </div>
    )


}