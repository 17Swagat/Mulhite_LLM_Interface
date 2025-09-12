import Link from "next/link";
export default function FirstBlog() {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-amber-500 ">
            <h1>First Blog Page</h1>
            <p>This is the first blog page of our application.</p>
            <Link
                href="/"
                className="text-white bg-purple-400 p-2 rounded-[10px] ml-10 text-3xl"
            >
                Home
            </Link>
        </div>);
}