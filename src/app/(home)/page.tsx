// import NextVideo from "next-video";
// import productDemoVideoPath from "../../../videos/MULHITE_DEMO_04.mp4.json";

import Link from "next/link";
import Image, { StaticImageData } from "next/image";
// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger,
// } from "@/components/ui/hover-card";

import { font_GMonoTrustDisplay } from "@/fonts";
import {
  Info,
  Highlighter,
  MessageSquare,
  CircleDollarSign,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import img_textHighlighting from "@/../public/landing/compressed/text-highlighting.png";
import img_explainSideChat from "@/../public/landing/compressed/explainsidechat.png";
import img_creditsLeft from "@/../public/landing/compressed/credits_left2.png";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
// import img_multiLLMs from "@/../public/landing/compressed/multiple-llms.png";

const available_models = [
  {
    name: "Grok",
    imgSrc: "/ai-models/grok2.svg",
  },

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

        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 mb-6 sm:mb-8 px-4">
          Use LLMs to help you study and learn better!
        </p>

        {/* Get-Started -> [Login] -> [/chat Area] */}
        <Link
          href="/chat"
          className="inline-block bg-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md text-base sm:text-lg font-medium hover:brightness-85 active:brightness-110 transition duration-300 ease-in-out"
        >
          Get Started
        </Link>

        {/* Temporary Test Div for Text-Selection and showing a PopupOver Context Menu on Text Highlight */}
        <div className="mt-8 sm:mt-12">
          {/* Placeholder for Hero Image */}
          <div className="w-full aspect-video bg-gray-800 rounded-lg flex items-center justify-center p-1">
            {/* Youtube Dummy */}
            {/* <iframe
              src="https://www.youtube.com/embed/jX4dLxiso6A?si=130UNzeK5VFA8vAx"
              title="YouTube video player"
              className="w-full h-full rounded-lg"
              allowFullScreen={true}
              loading="lazy"
            /> */}

            {/* NextVideo -Mux */}
            {/*<NextVideo
              // NOTE: Without this link feature gives TS error. As productDemoVideoPath is of type json and src expects a string:
              // @ts-ignore
              src={productDemoVideoPath}
              className="w-full h-full rounded-lg bg-amber-300"
              // controls
              // autoplay={false}
              // muted={false}
              // loop={false}
              // preload="metadata"
            />*/}
            <iframe
              src="https://player.mux.com/LZZ00U1tAEVIqcgnDa2NLcXbhwbp5QMo00JWQRvPiXwKw?accent-color=%23000000&primary-color=%237c33a3"
              // src="https://player.mux.com/aYZiRoLkUUlx8btbf700yXJ3J2io6SzOelvJcCVF9orQ?accent-color=%23000000&primary-color=%237c33a3"
              style={{ width: "100%", border: "none", aspectRatio: "16/9" }} //"width: 100%; border: none; aspect-ratio: 16/9;"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen
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
            {/* Multiple LLM Support */}

            {/* ************* */}

            {/* Modified LLM Support Block - Optimized for Small Screens */}
            <div className="flex justify-center p-4">
              {/* The main card container */}
              <div className="bg-gray-800 text-gray-200 p-6 rounded-2xl sm:p-8 sm:rounded-3xl  max-w-5xl w-full">
                {/* 1. Header Section */}
                <div className="text-center mb-4 sm:mb-6">
                  <h2
                    className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-1 ${font_GMonoTrustDisplay.className}`}
                  >
                    Unified AI Gateway
                  </h2>
                  <p className="text-gray-400 text-sm sm:text-xl font-medium">
                    Access Multiple AI Models Through Single API
                  </p>
                </div>

                {/* 2. AI Model Icons - CRITICAL FIX FOR ICON SIZE AND SPACING */}
                {/* Changed p-4 mb-8 to p-2 mb-6 for slightly less vertical space */}
                <div className="flex items-center justify-center p-2 mb-6">
                  {/* Reduced space-x-6 to space-x-4 for better fit on narrow screens */}
                  <ul className="flex space-x-4 sm:space-x-8 md:space-x-16 lg:space-x-24">
                    {/* max-w-3xl */}
                    {available_models.map((model, index) => (
                      <li key={model.name + index} className="p-1">
                        <Image
                          src={model.imgSrc}
                          alt={model.name}
                          // Base size set for small screens (w-10 h-10). Scales up at 'sm' breakpoint.
                          width={80}
                          height={80}
                          className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20  object-contain drop-shadow-lg"
                        />
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. Button and Bullet Points - Layout (Side-by-Side on large, Stacked on small) */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-6 sm:gap-8 p-0">
                  {/* Action Button (Full width on mobile) */}
                  <div className="w-full sm:w-auto shrink-0">
                    <Link
                      target="_blank"
                      href="https://vercel.com/ai-gateway"
                      className={`m-2.5 px-[45px] py-[15px] text-center uppercase transition-all duration-500 bg-linear-to-r from-[#1D2B64] via-[#ad214b] to-[#1D2B64] bg-size-[200%_auto]  text-white shadow-[0_0_5px_#eee] 
                      rounded-[10px] block hover:bg-position-[right_center] hover:text-white hover:no-underline  ${font_GMonoTrustDisplay.className}`}
                    >
                      G e t &nbsp; A P I &nbsp; K e y
                    </Link>
                  </div>

                  {/* Benefits List - CRITICAL FIX FOR TEXT SIZE */}
                  <div className="w-full sm:w-3/5">
                    {/* Text size reduced from text-xl to text-base (mobile) / text-lg (tablet) */}
                    <ul className="space-y-3 text-base sm:text-lg">
                      <li className="flex items-start">
                        {/* Reduced bullet size slightly */}
                        <span className="text-green-500 text-xl mr-2 mt-[-1px]">
                          •
                        </span>
                        <p className="text-gray-400 font-semibold">
                          <span className="font-bold text-purple-400">
                            Single Vercel AI Gateway API key
                          </span>{" "}
                          simplifies access.
                        </p>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 text-xl mr-2 mt-[-1px]">
                          •
                        </span>
                        <p className="text-gray-400 font-semibold">
                          <span className="font-bold text-red-400">
                            Pay For What You Use
                          </span>{" "}
                          — zero overhead, zero extra costs.
                          {/* No overhead cost or extra associated cost. */}
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Highlighting */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 md:gap-8 w-full">
              <div className="bg-gray-800 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl w-full md:w-1/2 max-w-2xl hover:scale-130 transition-transform duration-300 ease-in-out hover:cursor-pointer">
                <ImageModalCard
                  image={img_textHighlighting} //"/landing/text-highlighting.png"
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
                  image={img_explainSideChat} //"/landing/explainsidechat.png"
                  altText="Explain Sidechat Thread"
                />
              </div>
            </div>

            {/* Credits-Left */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 md:gap-8 w-full">
              <div className="bg-gray-800 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl w-full md:w-1/2 max-w-2xl hover:scale-130 cursor-pointer transition-transform duration-300 ease-in-out">
                <ImageModalCard
                  image={img_creditsLeft} //"/landing/credits_left2.png"
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
      {/*
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
      */}

      {/* Footer */}
      {/* <footer className="bg-gray-800 text-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base">
            &copy; 2025 Mulhite. All rights reserved. Created by 17Swagat with
            ❤️.
          </p>
        </div>
      </footer> */}
      <Footer />
    </>
    // </div>
  );
}

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-sm">
          {/* Left: Brand */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-8">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              MULHITE
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm hidden xs:block">
              Building amazing experiences with passion and precision.
            </p>
          </div>

          <div>
            {/* Copyright */}
            <p className="text-sm text-gray-400 leading-relaxed text-center">
              © 2025 <span className="text-gray-300 font-bold">MULHITE</span>.
              All rights reserved. <br />
              <br className="sm:hidden" />
              Built with ❤️{" "}
              <span className="text-gray-300 font-medium">by 17Swagat</span>
            </p>
          </div>

          {/* Center/Right: Social + Copyright (stacked on mobile, side-by-side on larger) */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 text-center sm:text-right">
            {/* Social */}
            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-xs uppercase tracking-wider hidden sm:block">
                Social
              </span>
              <Link
                href="https://x.com/SwagatKB17"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-gray-800/60 rounded-full hover:bg-gray-700/80 hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="Follow on X"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-gray-400"
                >
                  <path d="M18.244 2h3.308l-7.227 8.26L22 22h-6.558l-4.63-6.078L5.64 22H2.332l7.73-8.836L2 2h6.642l4.247 5.662L18.244 2zm-1.161 17.52h1.833L8.084 4.39H6.117l10.966 15.13z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Optional subtle accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
    </footer>
  );
}

function ImageModalCard({
  image,
  altText,
}: {
  image: StaticImageData;
  altText: string;
}) {
  const width = image.width;
  const height = image.height;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image
          src={image}
          alt={altText}
          width={width}
          height={height}
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

        {/* <div className="w-full flex items-center justify-center p-2! border-0! sm:p-4 md:p-6 "> */}
        <div className="w-full flex items-center justify-center p-0!  sm:p-0 md:p-0 border-none!">
          <Image
            src={image}
            alt={altText}
            width={width}
            height={height}
            className="rounded-lg w-full h-auto max-w-full object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
