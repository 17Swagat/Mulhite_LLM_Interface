// NOTE:
// params & searchParams:
// * [params]:=> "Its is a promise that resolves to an object containing the dynamic route parameters (like id)"
// * [searchParams]:=> "It is a promise that resolves to an object containing the query parameters (like filters & sorting)"

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
      
      <Link href="/complex-dashboard" className="text-white bg-purple-900 p-2 rounded-[10px] ml-10 text-3xl">
        Dashboard
      </Link> 

      <Link href="/f1" className="text-white bg-green-400/40 p-2 rounded-[10px] text-3xl">
        Goto F1
      </Link> 

      {/* Examples to learn about `params` & `searchParams` :=> */}
      <div className="flex gap-5.5 bg-pink-400/40 p-4">
        <Link href="/articles/breaking-news-123?lang=en" className="text-white bg-purple-400 p-2 rounded-[10px] text-3xl">
          Article Read (en)
        </Link>

        <Link href= "/articles/breaking-news-123?lang=fr" className="text-white bg-purple-400 p-2 rounded-[10px] text-3xl">
          Article Read (fr)
        </Link>
      </div>
    
    </div>
  );
}
