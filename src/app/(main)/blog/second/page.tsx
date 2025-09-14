'use client';
import Link from "next/link";
import { useRouter } from 'next/navigation'

export default function SecondBlog() {
    const router = useRouter();

    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#174c9bff] gap-2">
            <h1>Second Blog Page</h1>
            <p>This is the Second blog page of our application.</p>
            <Link
                href="/"
                className="text-white bg-purple-400 p-2 rounded-[10px] ml-10 text-3xl"
            >
                Home
            </Link>
            <button
                type="button"
                onClick={() => router.back()}
                // href="/blog"
                className="text-white bg-purple-400 p-2 rounded-[10px] ml-10 text-3xl"
            >
                Go back the Page
            </button>
        </div>);
}