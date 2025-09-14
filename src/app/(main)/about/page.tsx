import Link from "next/link";
export default function About() {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-green-900 ">
            <h1>About Page</h1>
            <p>This is the about page of our application.</p>
            <Link
                href="/profile"
                className="text-white bg-purple-400 p-2 rounded-[10px] ml-10 text-3xl"
            >
                Profile
            </Link>
        </div>
    );
}
