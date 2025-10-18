// Learning About Convex Auth

"use client";

import { Authenticated, AuthLoading, Unauthenticated, useConvexAuth, useMutation, usePaginatedQuery } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from '@/../convex/_generated/api'
import { useState } from "react";
import { PaginatedPosts } from "./PaginatedPosts";

export default function Home() {
    return (
        <>
            <Authenticated>
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

    // const { results: pagiPostsByUser, isLoading, loadMore, status: paginateStatus } = usePaginatedQuery(
    // api.testing.messages.messagesByUserPaginated, {}, { initialNumItems: 2 })

    return (
        <div className="h-screen bg-black text-white flex flex-col justify-center items-center">

            <div className="fixed top-0">
                <UserButton />
            </div>

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
            {/* {!postsByUser && <div className="w-10 h-10 rounded-full animate-spin border-2 border-pink-500"></div>} */}

            {/* Collect */}
            {/* {postsByUser &&
                <div className="flex flex-col text-2xl gap-2 space-y-2">
                    {postsByUser?.map((doc) => {
                        return (<div key={doc._id} className="bg-green-500">
                            {doc.message}
                        </div>)
                    })}

                </div>
            } */}

            <PaginatedPosts />

        </div>
    )


}