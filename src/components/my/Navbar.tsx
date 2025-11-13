// #2
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Menu, X } from "lucide-react"; // nice lightweight icons

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-black/90 shadow-sm  w-full z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold text-white tracking-wider bg-gradient-to-tr from-purple-700 via-teal-600 to-blue-950 px-2 py-1 rounded-lg cursor-pointer hover:bg-gradient-to-tr hover:from-red-400 hover:via-gray-600 hover:to-teal-400 transition duration-700 ease-in-out hover:scale-105">
            Nody
          </h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-10 text-lg text-gray-400">
          <Link href="/features" className="hover:text-white transition">
            Features
          </Link>
          <Link href="/pricing" className="hover:text-white transition">
            Pricing
          </Link>
          <Link href="/tutorial" className="hover:text-white transition">
            Tutorial
          </Link>
          <Link href="/changelog" className="hover:text-white transition">
            Changelog
          </Link>
        </div>

        {/* Right side buttons */}
        <div className="hidden md:flex space-x-4 items-center">
          <SignedOut>
            <SignInButton>
              <button className="bg-gradient-to-r from-purple-700 to-teal-500 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 hover:from-blue-700 hover:to-pink-700 transition">
                Login
              </button>
            </SignInButton>

            <SignUpButton>
              <button className="bg-gradient-to-r from-purple-700 via-teal-600 to-blue-950 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 hover:from-purple-700 hover:via-red-700 hover:to-pink-700 transition">
                Create Account
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <div className="bg-gradient-to-br from-purple-500 via-blue-500 to-green-500 p-1 rounded-[10px] hover:from-purple-400 hover:via-blue-600 hover:to-pink-500 transition">
              <UserButton />
            </div>
          </SignedIn>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white hover:text-gray-300 transition"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-black/95 px-6 pb-4 transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col space-y-4 text-lg text-gray-300 mt-2">
          <Link
            href="/features"
            className="hover:text-white transition"
            onClick={() => setIsOpen(false)}
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="hover:text-white transition"
            onClick={() => setIsOpen(false)}
          >
            Pricing
          </Link>
          <Link
            href="/tutorial"
            className="hover:text-white transition"
            onClick={() => setIsOpen(false)}
          >
            Tutorial
          </Link>
          <Link
            href="/changelog"
            className="hover:text-white transition"
            onClick={() => setIsOpen(false)}
          >
            Changelog
          </Link>

          <div className="flex flex-col gap-3 pt-4 border-t border-gray-700">
            <SignedOut>
              <SignInButton>
                <button className="bg-gradient-to-r from-purple-700 to-teal-500 text-white rounded-full font-medium text-base h-10 px-4 hover:from-blue-700 hover:to-pink-700 transition">
                  Login
                </button>
              </SignInButton>

              <SignUpButton>
                <button className="bg-gradient-to-r from-purple-700 via-teal-600 to-blue-950 text-white rounded-full font-medium text-base h-10 px-4 hover:from-purple-700 hover:via-red-700 hover:to-pink-700 transition">
                  Create Account
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <div className="bg-linear-to-br from-purple-500 via-blue-500 to-green-500 p-1 rounded-[10px] hover:from-purple-400 hover:via-blue-600 hover:to-pink-500 transition w-10 h-10">
                <UserButton />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}

// #1
// import Link from "next/link";
// import {
//   SignInButton,
//   SignUpButton,
//   SignedIn,
//   SignedOut,
//   UserButton,
// } from "@clerk/nextjs";

// export default function Navbar() {
//   return (
//     <>
//       <header className="bg-black/90 shadow-sm p-2">
//         <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
//           <h1 className="text-3xl font-bold text-white tracking-wider bg-linear-to-tr from-purple-700 via-teal-600 to-blue-950 p-1.5 rounded-[10px] cursor-pointer hover:bg-linear-to-tr hover:from-red-400 hover:via-gray-600 hover:to-teal-400 transition duration-900 ease-in-out hover:scale-105">
//             Nody️
//           </h1>

//           <div className="space-x-10 text-xl text-gray-500">
//             <Link
//               href="/features"
//               className=" hover:text-white transition duration-300"
//             >
//               Features
//             </Link>
//             <Link
//               href="/pricing"
//               className=" hover:text-white transition duration-300"
//             >
//               Pricing
//             </Link>
//             <Link
//               href="/changelog"
//               className=" hover:text-white transition duration-300"
//             >
//               Tutorial
//             </Link>
//             <Link
//               href="/changelog"
//               className=" hover:text-white transition duration-300"
//             >
//               Changelog
//             </Link>
//           </div>
//           <div className="space-x-4 text-xl flex ">
//             <SignedOut>
//               <SignInButton>
//                 <button
//                   type="button"
//                   className="bg-linear-to-r from-purple-700  to-teal-500 text-white text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:bg-linear-to-r hover:from-blue-700 hover:via-teal-500 hover:to-pink-700 transition duration-300 ease-in"
//                 >
//                   Login
//                 </button>
//               </SignInButton>

//               <SignUpButton>
//                 <button
//                   type="button"
//                   className="bg-linear-to-r from-purple-700 via-teal-600  to-blue-950 text-white text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:bg-linear-to-r hover:from-purple-700 hover:via-red-700 hover:to-pink-700 transition duration-300"
//                 >
//                   Create Account
//                 </button>
//               </SignUpButton>
//             </SignedOut>

//             <SignedIn>
//               <div className="bg-linear-to-br from-purple-500 via-blue-500 to-green-500 flex p-1 rounded-[10px] hover:bg-linear-to-r hover:from-purple-400 hover:via-blue-600 hover:to-pink-500 transition duration-300">
//                 <UserButton />
//               </div>
//             </SignedIn>
//           </div>
//         </nav>
//       </header>
//     </>
//   );
// }
