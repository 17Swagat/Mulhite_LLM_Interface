import Link from "next/link";
import Image from "next/image";
import { Oswald } from "next/font/google";

const fontStyle1 = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});

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
  }
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2
          className="text-4xl leading-snug md:text-5xl font-bold bg-linear-to-r from-purple-400 via-blue-500 to-purple-500 bg-clip-text text-transparent
        mb-4"
        >
          <span className="bg-linear-to-tr from-purple-900 via-teal-800 to-pink-700 rounded-2xl p-1.5 hover:cursor-pointer  hover:bg-linear-to-r hover:bg-green-500 hover:via-purple-500 hover:from-red-500 transition duration-500 ease-in-out decoration-purple-600 decoration-6  text-white ">
            LLM INTERFACE
          </span>{" "}
          FOR{" "}
          <span className="decoration-white underline decoration-5 underline-offset-3">
            STUDYING
          </span>{" "}
          AND{" "}
          <span className="decoration-white underline decoration-5 underline-offset-3">
            LEARNING
          </span>{" "}
          SOMETHING!!
        </h2>

        <p className="text-2xl text-gray-600 mb-8">
          Use LLMs to help you study and learn better!
        </p>

        {/* #1.1 */}
        <Link
          href="/chat"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700"
        >
          Get Started
        </Link>

        {/* Temporary Test Div for Text-Selection and showing a PopupOver Context Menu on Text Highlight */}
        <div className="mt-12">
          {/* Placeholder for Hero Image */}
          <div className="w-full h-200 bg-gray-900 rounded-lg flex items-center justify-center p-1">
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
      <section className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold text-purple-700 text-center mb-12">
            F E A T U R E S
          </h2>

          {/* Features Panel */}
          <div className="flex flex-col gap-25 items-center">
            <div className="text-white justify-center items-center">
              <h3 className="text-3xl font-semibold text-blue-500 mb-4 leading-relaxed">
                Support for Multiple LLMs
              </h3>
              <p>
                Simply put your VERCEL AI GATEWAY API Key and use multiple LLMs.
              </p>

              {/* Infinite - Scrolls */}
              <div className="flex bg-white overflow-hidden">
                <ul className="flex space-x-16 animate-infinite-scroll max-w-3xl p-2">
                  {/* {[...available_models, ...available_models].map( */}
                  {[...available_models, ...available_models].map(
                    (model, index) => {
                      return (
                        <li
                          key={model.name + index}
                          className="shrink-0 max-w-none"
                        >
                          <Image
                            src={model.imgSrc}
                            alt={model.name}
                            width={80}
                            height={80}
                            className="rounded-lg"
                          />
                        </li>
                      );
                    }
                  )}
                </ul>
              </div>
            </div>

            {/* Highlighting */}
            <div className="flex justify-between items-center gap-5">
              <div className="bg-gray-800 p-2 rounded-2xl">
                <Image
                  src="/landing/text-highlighting.png"
                  alt="Highlighting Text in AI Responses"
                  width={800}
                  height={800}
                  className="rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-3xl font-semibold text-blue-500 mb-4 leading-relaxed">
                  <span className="bg-[#ffe606] rounded-[5px] p-[3px]">
                    Highlight Text
                  </span>{" "}
                  in AI Responses
                </h3>
              </div>
            </div>

            {/* Explain-Sidechat-Thread */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-semibold text-blue-500 mb-4">
                  Explain Sidechat Thread
                </h3>
              </div>

              <div className="bg-gray-800 p-2 rounded-2xl">
                <Image
                  src="/landing/explainsidechat.png"
                  alt="Highlighting Text in AI Responses"
                  width={800}
                  height={800}
                  className="rounded-lg"
                />
              </div>
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Resources
              </h3>
              <p className="text-gray-600">
                Add and favorite resources to quickly access essential tools and
                information directly.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Collaboration
              </h3>
              <p className="text-gray-600">
                Invite collaborators for access and contributions to project
                tasks and finances.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                In-app Messaging
              </h3>
              <p className="text-gray-600">
                Send messages, create AI-generated work items, and collaborate
                efficiently.
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
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Basic Plan
              </h3>
              <p className="text-4xl font-bold text-gray-900 mb-4">Free</p>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>Manage 1 Project</li>
                <li>Access to Work Items</li>
                <li>Access to Finances</li>
                <li>In-app Messaging</li>
              </ul>
              <Link
                href="/signin"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700"
              >
                Sign In to Start
              </Link>
              <p className="text-gray-500 mt-4">Free. No subscription</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Premium Plan
              </h3>
              <p className="text-4xl font-bold text-gray-900 mb-4">
                $5 <span className="text-lg font-normal">USD / Month</span>
              </p>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>Manage Many Projects</li>
                <li>Access to Work Items</li>
                <li>Access to Finances</li>
                <li>In-app Messaging</li>
                <li>Access to AI Features</li>
              </ul>
              <Link
                href="/subscribe"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700"
              >
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
