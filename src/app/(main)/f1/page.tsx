import Link from "next/link";

export default function F1_Page(){
    return (
        <div>
            <h1 className="text-4xl">F1 Page</h1>
            <Link href='/f1/f2' className="bg-amber-600 text-3xl p-2">F2 Intercepting</Link>
        </div>
    );
}