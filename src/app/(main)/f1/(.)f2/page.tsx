import Link from "next/link";

export default function F2_PageIntercepting(){
    return (
        <div>
            <h1 className="text-4xl">F2 Intercepting Page</h1>
            <div className="flex flex-col">
                <Link href='/f1' className="w-fit bg-amber-600 text-3xl p-2">F1</Link>

                {/* Don't like this */}
                <Link href='/f1/(.)f2/(..)(..)f4' className="w-fit bg-amber-600 text-3xl p-2">F4 Intercepted</Link>

                <Link href='/f3' className="w-fit bg-amber-600 text-3xl p-2">F3 Intercepted</Link>
            </div>
        </div>
    );
}