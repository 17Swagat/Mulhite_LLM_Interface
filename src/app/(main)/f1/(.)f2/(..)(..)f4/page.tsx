import Link from "next/link";

export default function F4_Page_Intercepted(){
    return (
        <div>
            <h1 className="text-4xl">F4 Intercepted Page</h1>
            <div className="flex flex-col gap-2">
                <Link href='/f1' className="w-fit bg-cyan-300 text-3xl p-2">GoTo F1</Link>
            </div>
        </div>
    );
}