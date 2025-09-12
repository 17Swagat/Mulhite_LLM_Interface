import "@/app/globals.css";
import Link from "next/link";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <Link href="/">
          <div className="fixed top-2 left-2 p-2 bg-white rounded-[10px]  text-5xl  hover:brightness-150 hover:cursor-pointer select-none active:brightness-75 z-3000">
            🔙
          </div>
        </Link>
        <div className="w-screen h-screen flex justify-center items-center bg-gray-900">
          {children}
        </div>
      </body>
    </html>
  );
}
