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

// Learning More About `MetaData <title>`
export const metadata: Metadata = {
  // title: "Learn Next.js",
  title: {
    default: 'NextJS-Learn',
    template: 'NextJS-Learn | %s',
    // absolute: '',
  },
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
        <nav className="fixed bg-gray-600 w-full p-2 text-4xl flex justify-between">
          <Link href="/">N A V B A R</Link>
          <div>
            <ul className="flex gap-5">
              <li>
                <Link href={'/'}>Home</Link>
              </li>
              <li>
                <Link href={'/profile'}>Profile</Link>
              </li>
              <li>
                <Link href={'/login'}>Auth</Link>
              </li>
            </ul>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}