import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col gap-2 items-center justify-center bg-blue-900 text-9xl">
      Home Page
      <Link href="/about" className="text-white bg-purple-400 p-2 rounded-[10px] ml-10 text-3xl">
        About
      </Link>
      <Link href="/profile" className="text-white bg-purple-400 p-2 rounded-[10px] ml-10 text-3xl">
        Profile
      </Link>
      <Link href="/blog" className="text-white bg-purple-400 p-2 rounded-[10px] ml-10 text-3xl">
        Blogs
      </Link>
      <Link href="/products" className="text-white bg-purple-400 p-2 rounded-[10px] ml-10 text-3xl">
        Products
      </Link>
    </div>
  );
}
