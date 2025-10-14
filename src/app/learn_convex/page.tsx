'use client'
import {
    SignInButton,
    // SignIn, 
    // SignInButton, 
    useAuth
} from "@clerk/nextjs";
// import { Authenticated, Unauthenticated } from "convex/react";

// Convex Stuff:
import { Authenticated, Unauthenticated, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";

function LoadingSpinner() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-5 border-purple-500"></div>
        </div>
    );
}

export default function LearnConvexPage() {

    const { isLoaded, userId, isSignedIn } = useAuth(); // isLoaded: boolean
    const sendMessage = useMutation(api.chat.sendMessage)
    const [message, setMessage] = useState('');


    // Handling Loading State:
    if (!isLoaded) {
        return (
            <>
                <LoadingSpinner />
            </>
        )
    }

    if (!isSignedIn) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
                <div className="mb-4 text-xl">Please sign in to send messages.</div>
                <SignInButton>
                    <div className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 cursor-pointer">Sign In</div>
                </SignInButton>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">

            <h1 className="text-4xl font-bold mb-8">Learn Convex</h1>
            <form onSubmit={async (e) => {
                e.preventDefault();

                if (!userId) {
                    alert("User not signed in");
                    return;
                }

                await sendMessage({
                    user: userId,
                    body: message
                })
                setMessage('');
            }}>
                <input value={message} onChange={(e) => {
                    setMessage(e.currentTarget.value)
                }} type="text" name="message" placeholder="Enter your message" className="border border-gray-300 p-2 rounded-lg mr-4" />
                <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600">
                    Send Message
                </button>

            </form>


        </div>
    );
}