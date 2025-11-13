import Link from "next/link";
import Image from "next/image";
import { Oswald } from "next/font/google";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";

const available_models = [
  {
    name: "Claude",
    imgSrc: "/ai-models/claude.svg",
  },
  {
    name: "Deepseek",
    imgSrc: "/ai-models/deepseek.svg",
  },
  {
    name: "GPT",
    imgSrc: "/ai-models/openai.svg",
  },
  {
    name: "Grok",
    imgSrc: "/ai-models/grok.svg",
  },
  {
    name: "Mistral",
    imgSrc: "/ai-models/mistral.svg",
  },
  {
    name: "Gemini",
    imgSrc: "/ai-models/gemini.svg",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 text-center">
        <h2
          className="text-2xl leading-snug sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-linear-to-r from-purple-400 via-blue-500 to-purple-500 bg-clip-text text-transparent
        mb-4 px-2"
        >
          <span className="bg-linear-to-tr from-purple-900 via-teal-800 to-pink-700 rounded-xl sm:rounded-2xl p-1 sm:p-1.5 hover:cursor-pointer  hover:bg-linear-to-r hover:bg-green-500 hover:via-purple-500 hover:from-red-500 transition duration-500 ease-in-out decoration-purple-600 decoration-6  text-white inline-block">
            LLM INTERFACE
          </span>{" "}
          FOR{" "}
          <span className="decoration-white underline decoration-2 sm:decoration-4 md:decoration-5 underline-offset-2 sm:underline-offset-3">
            STUDYING
          </span>{" "}
          AND{" "}
          <span className="decoration-white underline decoration-2 sm:decoration-4 md:decoration-5 underline-offset-2 sm:underline-offset-3">
            LEARNING
          </span>{" "}
          SOMETHING!!
        </h2>

        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-8 px-4">
          Use LLMs to help you study and learn better!
        </p>

        {/* #1.1 */}
        <Link
          href="/chat"
          className="inline-block bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md text-base sm:text-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Get Started
        </Link>

        {/* Temporary Test Div for Text-Selection and showing a PopupOver Context Menu on Text Highlight */}
        <div className="mt-8 sm:mt-12">
          {/* Placeholder for Hero Image */}
          <div className="w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center p-1">
            <iframe
              src="https://www.youtube.com/embed/jX4dLxiso6A?si=130UNzeK5VFA8vAx"
              title="YouTube video player"
              className="w-full h-full rounded-lg"
              allowFullScreen={true}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section className="bg-black py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-700 text-center mb-8 sm:mb-12">
            F E A T U R E S
          </h2>

          {/* Features Panel */}
          <div className="flex flex-col gap-8 sm:gap-12 md:gap-16 lg:gap-20 items-center">
            <div className="text-white justify-center items-center p-4 sm:p-6 md:p-8 mb-8 sm:mb-12 md:mb-16 bg-linear-to-r bg-green-500 via-purple-500 from-red-500 rounded-2xl sm:rounded-3xl shadow-2xl w-full">
              <h3 className="text-xl text-center sm:text-2xl md:text-3xl text-white font-bold mb-3 sm:mb-4 leading-relaxed">
                Support for Multiple LLMs
              </h3>
              <p className="text-base sm:text-lg md:text-xl lg:text-3xl mb-4 sm:mb-6 max-w-3xl mx-auto font-semibold px-2">
                Simply put your{" "}
                <span className="text-yellow-200 font-bold underline underline-offset-2 sm:underline-offset-4">
                  VERCEL AI GATEWAY API KEY
                </span>{" "}
                and use multiple LLMs.
              </p>

              {/* Infinite - Scrolls */}
              <div className="flex items-center justify-center p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-slate-300 via-purple-200 to-slate-200">
                <ul className="flex space-x-8 sm:space-x-12 md:space-x-16 max-w-3xl p-1.5 sm:p-2">
                  {available_models.map((model, index) => (
                    <li
                      key={model.name + index}
                      // className="inline-block mx-4 sm:mx-6"
                    >
                      <Image
                        src={model.imgSrc}
                        alt={model.name}
                        width={80}
                        height={80}
                        className="rounded-lg w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Highlighting */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 md:gap-8 w-full">
              <div className="bg-gray-800 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl w-full md:w-1/2 max-w-2xl">
                <Image
                  src="/landing/text-highlighting.png"
                  alt="Highlighting Text in AI Responses"
                  width={800}
                  height={800}
                  className="rounded-lg w-full h-auto"
                />
              </div>
              <div className="w-full md:w-1/2 px-4">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-blue-500 mb-2 sm:mb-4 leading-relaxed text-center md:text-left">
                  <span className="bg-[#ffe606] rounded-[5px] p-[3px]">
                    Highlight Text
                  </span>{" "}
                  in AI Responses
                </h3>
              </div>
            </div>

            {/* Explain-Sidechat-Thread */}
            <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 sm:gap-6 md:gap-8 w-full">
              <div className="w-full md:w-1/2 px-4">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-blue-500 mb-2 sm:mb-4 text-center md:text-left">
                  Explain Sidechat Thread
                </h3>
              </div>

              <div className="bg-gray-800 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl w-full md:w-1/2 max-w-2xl">
                <Image
                  src="/landing/explainsidechat.png"
                  alt="Highlighting Text in AI Responses"
                  width={800}
                  height={800}
                  className="rounded-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12 px-4">
            Side Project Mastery, Effortlessly Within Reach
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Resources
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Add and favorite resources to quickly access essential tools and
                information directly.
              </p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Collaboration
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Invite collaborators for access and contributions to project
                tasks and finances.
              </p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                In-app Messaging
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Send messages, create AI-generated work items, and collaborate
                efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-white py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12 px-4">
            Manage Your Projects Today!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm text-center">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                Basic Plan
              </h3>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Free
              </p>
              <ul className="text-sm sm:text-base text-gray-600 space-y-2 mb-4 sm:mb-6">
                <li>Manage 1 Project</li>
                <li>Access to Work Items</li>
                <li>Access to Finances</li>
                <li>In-app Messaging</li>
              </ul>
              <Link
                href="/signin"
                className="inline-block bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md text-base sm:text-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Sign In to Start
              </Link>
              <p className="text-sm sm:text-base text-gray-500 mt-3 sm:mt-4">
                Free. No subscription
              </p>
            </div>
            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm text-center">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                Premium Plan
              </h3>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                $5{" "}
                <span className="text-base sm:text-lg font-normal">
                  USD / Month
                </span>
              </p>
              <ul className="text-sm sm:text-base text-gray-600 space-y-2 mb-4 sm:mb-6">
                <li>Manage Many Projects</li>
                <li>Access to Work Items</li>
                <li>Access to Finances</li>
                <li>In-app Messaging</li>
                <li>Access to AI Features</li>
              </ul>
              <Link
                href="/subscribe"
                className="inline-block bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md text-base sm:text-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Sign In to Subscribe
              </Link>
              <p className="text-sm sm:text-base text-gray-500 mt-3 sm:mt-4">
                Billed Monthly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base">
            &copy; 2025 ProjectPlannerAI. All rights reserved.
          </p>
        </div>
      </footer>
    </>
    // </div>
  );
}
