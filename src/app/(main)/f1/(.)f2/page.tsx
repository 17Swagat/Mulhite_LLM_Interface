import Link from "next/link";

export default function F2_PageIntercepting(){
    return (
        <div>
            <h1 className="text-4xl">F2 Intercepting Page</h1>
            <Link href='/f1' className="bg-amber-600 text-3xl p-2">F1</Link>
        </div>
    );
}