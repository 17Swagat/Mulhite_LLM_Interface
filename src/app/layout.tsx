import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { dark } from "@clerk/themes";

// ClerkAuth:
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/convex_related/ConvexClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const font_GMonoTrustDisplay = localFont({
//   src: "../../public/fonts/momofont.ttf", // ← Correct relative path
//   display: "swap",
//   variable: "--font-gmono-trust", // Optional: for CSS variable usage
// });

export const metadata: Metadata = {
  title:
    "Mulhite - Multimodal LLM Chat interface with Highlighting & in-chat Threads.",
  description:
    "Chat with AI models and highlight important information in conversations and create in-chat threads for better context management.",
  // viewport: {
  //   width: "device-width",
  //   initialScale: 1,
  //   viewportFit: "cover",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="./highlightStuff.css" />
        <link rel="icon" href="/logo_02.svg" sizes="any" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider
          appearance={{
            theme: dark,
            layout: { logoImageUrl: "/logo_02.svg" },
          }}
        >
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
