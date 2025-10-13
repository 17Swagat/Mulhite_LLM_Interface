// Temporary Checking

"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
// import { api } from "../convex/_generated/api";
// import { api } from "@/convex/_generated/api";
import {api} from '@/../convex/_generated/api'

export default function Home() {
    return (
        <div className="bg-white w-screen h-screen flex justify-center items-center">
            <Authenticated>
                <UserButton />
                <Content />
            </Authenticated>
            <Unauthenticated>
                <SignInButton />
            </Unauthenticated>
        </div>
    );
}

function Content() {
    const messages = useQuery(api.messages.getForCurrentUser);
    return <div>Authenticated content: {messages?.length}</div>;
}