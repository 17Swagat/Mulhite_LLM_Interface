// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// // import "./globals.css";
// import "@/app/globals.css";
// import { Navbar } from "@/components/my/navbar";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// // Learning More About `MetaData <title>`
// export const metadata: Metadata = {
//   // title: "Learn Next.js",
//   title: {
//     default: 'NextJS-Learn',
//     template: 'NextJS-Learn | %s',
//     // absolute: '',
//   },
//   description: "Learn Next.js with this comprehensive guide",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <Navbar/>
//         {children}
//       </body>
//     </html>
//   );
// }

import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { Navbar } from "@/components/my/navbar";
import { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'NextJS-Learn',
    template: 'NextJS-Learn | %s',
  },
  description: "Learn Next.js with this comprehensive guide",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}