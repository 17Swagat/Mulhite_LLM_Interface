import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
//   title: 'Profile',
  title: {
    absolute: 'Profile'
  },
  description: "Profile Page",
};


export default function Profile() {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-purple-900 ">
            <h1>Profile Page</h1>
            <p>This is the profile page of our application.</p> 

            <Link
                href="/"
                className="text-white bg-purple-400 p-2 rounded-[10px] ml-10 text-3xl"
            >
                Home
            </Link>
        </div>
    );
}