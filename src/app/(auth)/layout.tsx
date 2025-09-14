import { Geist, Geist_Mono, Protest_Guerrilla } from "next/font/google";
import "@/app/globals.css";
import Link from "next/link";

const protestGuerrilla = Protest_Guerrilla({
  variable: "--font-protest-guerrilla",
  weight: "400",
  subsets: ["latin"]
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${protestGuerrilla.variable} antialiased`}
      >
        <Link href='/' className="fixed bg-gray-600 m-2 p-2 text-4xl rounded-[10px]">
            Home 🔙
        </Link>
        {/* <h1 className="text-4xl">Auth Stuff</h1> */}
        {children}
      </body>
    </html>
  );
}