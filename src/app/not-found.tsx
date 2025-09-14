'use client';
import Image from "next/image";
import '@/app/globals.css';
import { Navbar } from "@/components/my/navbar";
import Link from "next/link";


export default function NotFound() {

    let imgURL_linkNotFound = 'https://img.freepik.com/free-vector/hand-drawn-404-error_23-2147746234.jpg?semt=ais_incoming&w=740&q=80';
    // let imgURL_linkNotFound = 'https://static.vecteezy.com/system/resources/previews/008/255/803/non_2x/page-not-found-error-404-system-updates-uploading-computing-operation-installation-programs-system-maintenance-a-hand-drawn-layout-template-of-a-broken-robot-illustration-vector.jpg';
    

    return (
        <div className="w-screen h-screen flex flex-col bg-blue-300 justify-center items-center">
            <div className="fixed top-0 left-0">
                <Navbar/>
            </div>
            <h1 className="text-4xl">404 - Page Not Found</h1>
            <h2 className="text-3xl bg-red-700 p-1 rounded-[5px]">
                <Link href='/' replace>
                    Go To Home
                </Link>
            </h2>
            <hr className="mt-2 mb-4 border-2 border-gray-300 w-[500px]" />
            <Image
                src={imgURL_linkNotFound}
                alt="404 - Page Not Found"
                width={500}
                height={500}
            />
        </div>
    );
}