'use client'
import { SignIn, SignInButton, useAuth } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";

export default function LearnConvexPage() {

    const { isLoaded } = useAuth(); // isLoaded: boolean


    // Handling Loading State:
    // As <Authenticated> and <Unauthenticated> takes a little time to load its children
    if (!isLoaded) {
        return (
            <>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-5 border-purple-500"></div>
                </div>
            </>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-4xl font-bold mb-8">Learn Convex</h1>
            <Authenticated>
                <p className="text-lg text-center max-w-2xl">
                    This is the Convex Placeholder
                </p>
            </Authenticated>

            <Unauthenticated>
                <div className="flex flex-col items-center">
                    <p className="text-lg text-center max-w-2xl">
                        Please sign in to access this content.
                    </p>
                    <SignInButton>
                        <div className="bg-yellow-500 text-center p-2 rounded w-fit hover:cursor-pointer">
                            Sign-In
                        </div>
                    </SignInButton>
                </div>
            </Unauthenticated>
        </div>
    );
}