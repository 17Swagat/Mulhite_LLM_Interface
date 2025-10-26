import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

import Image from "next/image";

export default function Navbar() {
  return (
    <>
      <header className="bg-black/90 shadow-sm p-2">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white tracking-wider bg-linear-to-tr from-purple-700 via-teal-600 to-blue-950 p-1.5 rounded-[10px] cursor-pointer hover:bg-linear-to-tr hover:from-red-400 hover:via-gray-600 hover:to-teal-400 transition duration-900 ease-in-out hover:scale-105">
            Nody️
          </h1>

          <div className="space-x-10 text-xl text-gray-500">
            <Link
              href="/features"
              className=" hover:text-white transition duration-300"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className=" hover:text-white transition duration-300"
            >
              Pricing
            </Link>
            <Link
              href="/changelog"
              className=" hover:text-white transition duration-300"
            >
              Tutorial
            </Link>
            <Link
              href="/changelog"
              className=" hover:text-white transition duration-300"
            >
              Changelog
            </Link>
          </div>
          <div className="space-x-4 text-xl flex ">
            <SignedOut>
              <SignInButton>
                <button
                  type="button"
                  className="bg-gradient-to-r from-purple-700  to-teal-500 text-white text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:bg-gradient-to-r hover:from-blue-700 hover:via-teal-500 hover:to-pink-700 transition duration-300 ease-in"
                >
                  Login
                </button>
              </SignInButton>

              <SignUpButton>
                <button
                  type="button"
                  className="bg-gradient-to-r from-purple-700 via-teal-600  to-blue-950 text-white text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:bg-gradient-to-r hover:from-purple-700 hover:via-red-700 hover:to-pink-700 transition duration-300"
                >
                  Create Account
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <div className="bg-gradient-to-br from-purple-500 via-blue-500 to-green-500 flex p-1 rounded-[10px] hover:bg-gradient-to-r hover:from-purple-400 hover:via-blue-600 hover:to-pink-500 transition duration-300">
                <UserButton />
              </div>
            </SignedIn>
          </div>
        </nav>
      </header>
    </>
  );
}
