import Link from "next/link";

export default function F4_Page(){
    return (
        <div>
            <h1 className="text-4xl">F4 Page</h1>
            <div className="flex flex-col gap-2">
                <Link href='/f1' className="w-fit bg-pink-600 text-3xl p-2">F1</Link>
            </div>
        </div>
    );
}