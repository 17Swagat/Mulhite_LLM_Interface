// #2
"use client";

import Link from "next/link";
import { useState } from "react";
// import {
//   SignInButton,
//   SignUpButton,
//   SignedIn,
//   SignedOut,
//   UserButton,
// } from "@clerk/nextjs";
import { Menu, X } from "lucide-react"; // nice lightweight icons

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-black/90 shadow-sm  w-full z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold text-white tracking-wider bg-linear-to-tr from-purple-700 via-teal-600 to-blue-950 px-2 py-1 rounded-lg cursor-pointer hover:bg-linear-to-tr hover:from-red-400 hover:via-gray-600 hover:to-teal-400 transition duration-700 ease-in-out hover:scale-105">
            Nody
          </h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-10 text-lg text-gray-400 ">
          <Link href="#features" className="hover:text-white transition">
            Features
          </Link>
          <Link href="#pricing" className="hover:text-white transition">
            Pricing
          </Link>
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
        </div>
      </div>
    </header>
  );
}
