import "@/app/globals.css";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Products",
  description: "This is the products page.",
};


export default function ProductLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <div className="h-screen w-screen flex justify-center items-center bg-gradient-to-r from-blue-900 via-purple-400 to-blue-500">
            {children}
        </div>
  );
}