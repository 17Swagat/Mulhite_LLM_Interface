'use client'
import {
    SignInButton,
    // SignIn, 
    // SignInButton, 
    useAuth
} from "@clerk/nextjs";
// import { Authenticated, Unauthenticated } from "convex/react";

// Convex Stuff:
import { Authenticated, Unauthenticated, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";



export default function LearnConvexPage() {

    const { isLoaded, userId, isSignedIn } = useAuth(); // isLoaded: boolean
    const [message, setMessage] = useState('');
    const [optionalTag, setOptionalTag] = useState<string | null>(null);

    const addEntry = useMutation(api.testing.test_table.addEntry_to_test_table);
    const fetchEntries = useQuery(api.testing.test_table.getData_from_test_table);



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

                if (message.trim() != '') {
                    // DB Insertion
                    // addEntry({ message, optionalTag: optionalTag ?? undefined });
                    addEntry({ message, optionalTag: optionalTag });
                }

                setMessage('');
                setOptionalTag(null)
            }}>

                <div className="flex flex-col mb-2 gap-1">

                    {/* Message-Input */}
                    <input value={message} onChange={(e) => {
                        setMessage(e.currentTarget.value)
                    }} type="text" name="message" placeholder="Enter your message" className="border border-gray-300 p-2 rounded-lg mr-4" />

                    {/* Optional Tag */}
                    <input value={optionalTag ?? ''} onChange={(e) => {
                        setOptionalTag(e.currentTarget.value)
                    }} type="text" name="optionalTag" placeholder="Enter an optional tag" className="border border-gray-300 p-2 rounded-lg mr-4" />

                </div>

                {/* Submit */}
                <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600">
                    Send Message
                </button>

            </form>

            <div className="mt-8 w-full max-w-xl">
                <h2 className="text-2xl font-bold mb-4">Messages</h2>
                {/* {fetchEntries === undefined && <p>Loading messages...</p>} */}
                <div className="space-y-4">
                    {fetchEntries === undefined &&
                        <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-purple-500"></div>
                    }
                    {fetchEntries && fetchEntries.map((entry) => (
                        <div key={entry._id} className="border border-gray-300 p-4 rounded-lg">
                            <p className="font-bold">{entry.message}</p>
                            {entry.optionalTag && <p className="text-gray-500">Tag: {entry.optionalTag}</p>}
                        </div>
                    ))}
                </div>
            </div>

        </div>

        // Viewing Inserted Messages in the `test_table` table

    );
}



function LoadingSpinner() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-5 border-purple-500"></div>
        </div>
    );
}