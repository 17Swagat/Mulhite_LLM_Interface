import Link from "next/link";

export default function F1_Page(){
    return (
        <div>
            <h1 className="text-4xl">F1 Page</h1>
            <div className="flex flex-col gap-2">
                <Link href='/f1/f2' className="w-fit bg-amber-600 text-3xl p-2">F2 Intercepting</Link>
                <Link href='/f3' className="w-fit bg-amber-600 text-3xl p-2">F3 Intercepting</Link>
            </div>
        </div>
    );
}