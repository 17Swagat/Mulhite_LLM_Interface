import Link from "next/link";

export default function F5_Page_Intercepted(){
    return (
        <div>
            <h1 className="text-4xl">F5 Page Intercepted</h1>
            <div className="flex flex-col">
                <Link href='/f1' className="w-fit bg-amber-600 text-3xl p-2">F1</Link>
            </div>
        </div>
    );
}