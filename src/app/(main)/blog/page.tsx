'use client';
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function Blogs() {
    const router = useRouter();
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-green-900 gap-4">
            <h1>Blogs</h1>
            <p>This is the blogs page of our application.</p>
            {/* <Link
                href="/"
                className="text-white bg-purple-400 p-2 rounded-[10px] ml-10 text-3xl"
            >
                Home
            </Link> */}
            <button
                type="button"
                onClick={()=>{
                    router.push('/')
                }}
                className="text-white bg-purple-400 p-2 rounded-[10px] ml-10 text-3xl"
            >
                Home
            </button>

            <Link
                href="/blog/first"
                className="text-white bg-purple-400 p-2 rounded-[10px] ml-10 text-3xl"
            >
                First Blog
            </Link>

            <Link
                href="/blog/second"
                className="text-white bg-purple-400 p-2 rounded-[10px] ml-10 text-3xl"
            >
                Second Blog
            </Link>
        </div>
    );
}
