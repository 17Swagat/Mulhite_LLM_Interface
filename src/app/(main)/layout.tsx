import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
import "@/app/globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Learn Next.js",
  description: "Learn Next.js with this comprehensive guide",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="fixed bg-gray-600 w-full p-2 text-4xl">
          <Link href="/">N A V B A R</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}