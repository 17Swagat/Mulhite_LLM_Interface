// 'use client';

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">

        <h2 className="text-4xl leading-tight md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-500 to-purple-500 bg-clip-text text-transparent
        mb-4">
          BEST <span className='bg-purple-700/30 rounded-2xl p-1.5 decoration-purple-600 decoration-6'>LLM INTERFACE</span> FOR STUDYING AND LEARNING SOMETHING!!
        </h2>

        <p className="text-2xl text-gray-600 mb-8">
          Use LLMs to help you study and learn better!
        </p>



        {/* #1.1 */}
        {/* <Link href="/chat" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700">
          Get Started
        </Link> */}
        
        {/* #1.2 */}
        {/* [Experimental] */}
        <Link href="/experi_chat" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700">
          Experimental Chat
        </Link>


        <div className="mt-12">
          {/* Placeholder for Hero Image */}
          <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Hero Image Placeholder</span>
          </div>
        </div>
      </section>


      {/* Problem vs Solution Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Tired of Unfinished Side Projects?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-red-600 mb-4">Without ProjectPlannerAI</h3>
              <ul className="space-y-2 text-gray-600">
                <li>❌ Waste time catching up where you left off</li>
                <li>❌ Juggle between multiple tools and tabs</li>
                <li>❌ Lose track of project expenses</li>
                <li>❌ Overwhelmed by chaos, leading to unfinished projects</li>
                <li>❌ Struggle to recall or locate the next steps</li>
              </ul>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-600 mb-4">With ProjectPlannerAI</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✅ Streamline all side projects in one intuitive dashboard</li>
                <li>✅ Share projects and collaborate with team members</li>
                <li>✅ Maintain budget control with integrated expense tracking</li>
                <li>✅ Stay motivated with visible progress and organized tasks</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Side Project Mastery, Effortlessly Within Reach
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Resources</h3>
              <p className="text-gray-600">
                Add and favorite resources to quickly access essential tools and information directly.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Collaboration</h3>
              <p className="text-gray-600">
                Invite collaborators for access and contributions to project tasks and finances.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">In-app Messaging</h3>
              <p className="text-gray-600">
                Send messages, create AI-generated work items, and collaborate efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Manage Your Projects Today!
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Basic Plan</h3>
              <p className="text-4xl font-bold text-gray-900 mb-4">Free</p>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>Manage 1 Project</li>
                <li>Access to Work Items</li>
                <li>Access to Finances</li>
                <li>In-app Messaging</li>
              </ul>
              <Link href="/signin" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700">
                Sign In to Start
              </Link>
              <p className="text-gray-500 mt-4">Free. No subscription</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Premium Plan</h3>
              <p className="text-4xl font-bold text-gray-900 mb-4">$5 <span className="text-lg font-normal">USD / Month</span></p>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>Manage Many Projects</li>
                <li>Access to Work Items</li>
                <li>Access to Finances</li>
                <li>In-app Messaging</li>
                <li>Access to AI Features</li>
              </ul>
              <Link href="/subscribe" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700">
                Sign In to Subscribe
              </Link>
              <p className="text-gray-500 mt-4">Billed Monthly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 ProjectPlannerAI. All rights reserved.</p>
        </div>
      </footer>
    </>
    // </div>
  );
}