// 'use client';
// import { permanentRedirect } from "next/navigation";
import Link from "next/link";

export default function Blogs() {

    // await new Promise((resolve)=>{
    // // new Promise((resolve)=>{
    //     setTimeout(()=>{
    //         resolve('Intentional Delay Complete')
    //     }, 1200);
    // }).then((res)=>{
    //     console.log(res)
    // });

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
            <Link
                href={'/'}
                className="text-white bg-purple-400 p-2 rounded-[10px] ml-10 text-3xl"
            >
                Home
            </Link>

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
