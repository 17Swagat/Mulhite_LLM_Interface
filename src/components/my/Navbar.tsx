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

import { font_GMonoTrustDisplay } from "@/fonts";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-[#0a0b10]/95 backdrop-blur-sm shadow-sm w-full z-50 border-b border-white/5">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <h1
            className={`text-3xl text-white tracking-wide bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400 px-2 py-1 rounded-lg cursor-pointer transition duration-500 ease-in-out hover:from-indigo-400 hover:via-violet-400 hover:to-indigo-500 shadow-lg shadow-indigo-500/20 ${font_GMonoTrustDisplay.className}`}
          >
            MULHITE
          </h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-10 text-lg text-slate-400 ">
          <Link href="#features" className="hover:text-white transition-colors duration-200">
            Features
          </Link>
          {/* <Link href="#pricing" className="hover:text-white transition">
            Pricing
          </Link> */}
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
        className={`md:hidden bg-[#0a0b10]/98 backdrop-blur-sm px-6 pb-4 transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col space-y-4 text-lg text-slate-300 mt-2">
          <Link
            href="#features"
            className="hover:text-white transition"
            onClick={() => setIsOpen(false)}
          >
            Features
          </Link>
          {/* <Link
            href="/pricing"
            className="hover:text-white transition"
            onClick={() => setIsOpen(false)}
          >
            Pricing
          </Link> */}
        </div>
      </div>
    </header>
  );
}
