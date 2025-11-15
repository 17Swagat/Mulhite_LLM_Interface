import Link from "next/link";
import Image from "next/image";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { font_GMonoTrustDisplay } from "../layout";
import {
  Info,
  Highlighter,
  MessageSquare,
  CircleDollarSign,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
          className={`text-2xl leading-snug sm:text-3xl md:text-4xl lg:text-5xl font-extralight bg-linear-to-r from-purple-400 via-blue-500 to-purple-500 bg-clip-text text-transparent
        mb-4 px-2 ${font_GMonoTrustDisplay.className} `}
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

      <section id="features" className="bg-black py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-semibold text-purple-400 text-center mb-8 sm:mb-12 
             ${font_GMonoTrustDisplay.className}
              `}
          >
            F E A T U R E S
          </h2>

          {/* Features Panel */}
          <div
            className={`flex flex-col gap-8 sm:gap-12 md:gap-16 lg:gap-20 items-center`}
          >
            <div className="text-white justify-center items-center p-4 sm:p-6 md:p-8 mb-8 sm:mb-12 md:mb-16 bg-linear-to-r bg-green-600 via-purple-900 from-purple-700 rounded-2xl sm:rounded-3xl shadow-2xl w-full">
              <h3
                className={`text-sm text-center sm:text-2xl md:text-3xl text-white  mb-3 sm:mb-4 leading-relaxed ${font_GMonoTrustDisplay.className}`}
              >
                Support for Multiple LLMs
              </h3>
              <p className="text-center text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-2 max-w-4xl mx-auto font-semibold px-2">
                Simply put your{" "}
                <span className="text-yellow-200 font-bold underline underline-offset-2 sm:underline-offset-4">
                  VERCEL AI GATEWAY API KEY
                  <sup>
                    <HoverCard openDelay={200} closeDelay={200}>
                      <HoverCardTrigger asChild>
                        <Info
                          className="text-green-300 inline-block ml-1 mr-2 size-4 lg:size-5"
                          strokeWidth={3}
                        />
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="flex justify-between gap-4">
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">
                              Vercel AI Gateway
                            </h4>
                            <ul className=" text-sm flex flex-col gap-0.5">
                              <li className="font-semibold text-purple-500">
                                Get one endpoint to access multiple LLMs.
                              </li>
                              <li className="text-blue-500 font-semibold">
                                Offers tokens at list price from the upstream
                                providers with{" "}
                                <span className="text-yellow-500">
                                  no markup.
                                </span>
                              </li>
                            </ul>
                            <div className="text-xs mt-2">
                              <Link
                                href={"https://vercel.com/ai-gateway"}
                                target="_blank"
                                className="font-semibold text-blue-500 hover:text-green-800 bg-blue-200 p-1 hover:brightness-90  rounded-lg transition duration-200 ease-in"
                              >
                                More information on Vercel AI Gateway{" "}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </sup>
                </span>
                and use multiple LLMs.
              </p>

              <p className="text-center text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 max-w-4xl mx-auto font-semibold px-2">
                Pay credits for what you use. No overhead cost for using LLMs.
              </p>

              <div className="flex items-center justify-center p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-linear-to-r from-slate-300 via-purple-200 to-slate-200">
                <ul className="flex space-x-8 sm:space-x-12 md:space-x-16 max-w-3xl p-1.5 sm:p-2">
                  {available_models.map((model, index) => (
                    <li key={model.name + index}>
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
              <div className="bg-gray-800 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl w-full md:w-1/2 max-w-2xl hover:scale-130 transition-transform duration-300 ease-in-out hover:cursor-pointer">
                <ImageModalCard
                  imageSrc="/landing/text-highlighting.png"
                  altText="Highlight Text in AI Responses"
                />
              </div>
              <div className="w-full md:w-1/2 px-4">
                <div className="flex items-center space-x-2">
                  <Highlighter
                    className="text-yellow-300 inline-block mb-2 size-6 sm:size-7 md:size-8"
                    strokeWidth={1.5}
                  />
                  <h3
                    className={`text-xl sm:text-2xl md:text-3xl font-light text-blue-500 mb-2 sm:mb-4 leading-relaxed text-center md:text-left ${font_GMonoTrustDisplay.className}`}
                  >
                    <span className="bg-[#ffe606] rounded-[5px] p-[3px]">
                      Highlight Text
                    </span>{" "}
                    in AI Responses
                  </h3>
                </div>
                <p className="text-gray-200 text-md font-semibold mt-4">
                  <span className="underline decoration-2 underline-offset-2 text-yellow-400">
                    Highlight Text
                  </span>{" "}
                  from responses that seems important to you.
                  <br />
                  Helps during{" "}
                  <span className="underline decoration-2 underline-offset-2 text-green-400">
                    revision
                  </span>{" "}
                  🤓🧠
                </p>
              </div>
            </div>

            {/* Explain-Sidechat-Thread */}
            <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 sm:gap-6 md:gap-8 w-full">
              <div className="w-full md:w-1/2 px-4">
                <div className="flex items-center space-x-2">
                  <MessageSquare
                    className="text-orange-300 inline-block mb-2 size-6 sm:size-7 md:size-8"
                    strokeWidth={2.5}
                  />
                  <h3
                    className={`bg-blue-200 w-fit text-xl sm:text-2xl md:text-3xl font-light text-blue-500 mb-2 sm:mb-4 text-center md:text-left rounded-[5px] p-[3px] ${font_GMonoTrustDisplay.className}`}
                  >
                    Explain Sidechat Thread
                  </h3>
                </div>
                <p className="text-gray-200 text-md font-semibold mt-4">
                  Unable to understand a certain part of the response? <br />{" "}
                  <span className="text-amber-500">
                    Just{" "}
                    <span className="underline decoration-2 underline-offset-2">
                      select
                    </span>{" "}
                    that portion and start a{" "}
                    <span className="underline decoration-2 underline-offset-2">
                      sidechat thread
                    </span>{" "}
                    related to that portion.
                  </span>
                </p>
              </div>

              <div className="bg-gray-800 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl w-full md:w-1/2 max-w-2xl hover:scale-130 transition-transform duration-300 ease-in-out hover:cursor-pointer">
                <ImageModalCard
                  imageSrc="/landing/explainsidechat.png"
                  altText="Explain Sidechat Thread"
                />
              </div>
            </div>

            {/* Credits-Left */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 md:gap-8 w-full">
              <div className="bg-gray-800 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl w-full md:w-1/2 max-w-2xl hover:scale-130 transition-transform duration-300 ease-in-out">
                <ImageModalCard
                  imageSrc="/landing/credits_left2.png"
                  altText="Credits-Left"
                />
              </div>
              <div className="w-full md:w-1/2 px-4">
                <div className="flex items-center space-x-2">
                  <CircleDollarSign
                    className="text-green-400 inline-block mb-2 size-6 sm:size-7 md:size-8"
                    strokeWidth={2.3}
                  />
                  <h3
                    className={`text-xl sm:text-2xl md:text-3xl font-light text-blue-500 mb-2 sm:mb-4 leading-relaxed text-center md:text-left ${font_GMonoTrustDisplay.className}`}
                  >
                    <span className="bg-[#96ff34] rounded-[5px] p-[3px]">
                      Credits-Left
                    </span>{" "}
                    {/* in AI Responses */}
                  </h3>
                </div>
                <p className="text-gray-200 text-md font-semibold mt-4">
                  View{"  "}
                  <span className="underline decoration-2 underline-offset-2 text-green-400">
                    Credits-Left
                  </span>{" "}
                  💸💸 in your Vercel AI Gateway Account{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="bg-black text-white py-8 sm:py-12 md:py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className={`text-2xl sm:text-3xl lg:text-7xl font-bold text-center mb-8 sm:mb-12 px-4 ${font_GMonoTrustDisplay.className} 
              bg-clip-text text-transparent bg-linear-to-t from-purple-700 via-blue-500 to-purple-400 
           `}
          >
            P L A N S
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto ">
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
            &copy; 2025 Nody. All rights reserved.
          </p>
        </div>
      </footer>
    </>
    // </div>
  );
}

function ImageModalCard({
  imageSrc,
  altText,
}: {
  imageSrc: string;
  altText: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image
          src={imageSrc}
          alt={altText}
          width={800}
          height={800}
          className="rounded-lg w-full h-auto "
        />
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="bg-transparent border-none! border-purple-500! p-0! m-0! max-w-[95vw] md:max-w-[90vw] lg:max-w-[1000px] w-full"
      >
        <DialogHeader className="sr-only">
          <DialogTitle></DialogTitle>
        </DialogHeader>

        <div className="w-full flex items-center justify-center p-2! border-0! sm:p-4 md:p-6 ">
          <Image
            src={imageSrc}
            alt={altText}
            width={1800}
            height={1800}
            className="rounded-lg w-full h-auto max-w-full object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
