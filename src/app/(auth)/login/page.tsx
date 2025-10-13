// Desgin a Login Page with Clerk Authentication for a Next.js Application

import {
    SignInButton,
    SignUpButton,
    // SignUp,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'


export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <header className="bg-amber-400 w-full absolute top-0 flex justify-end items-center p-4 gap-4 h-16">
                <SignedOut>
                    <SignInButton>
                        <button type='button' className="bg-[#085c79ff] text-white text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                            Login
                        </button>
                    </SignInButton>
                    <SignUpButton>
                        <button type='button' className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                            Create Account
                        </button>
                    </SignUpButton>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </header>
        </div>
    )
}