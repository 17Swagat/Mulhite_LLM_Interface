import Link from "next/link";
export default function HomePage(){
    return (
        <div className="w-screen h-screen bg-purple-600/10">
            <h1 className="text-4xl">Route Handlers</h1>
            <p className="text-2xl">Let's call Hello API</p>
            <Link href={'/hello/api'} className="text-2xl bg-amber-500/70">
                Hello API Call
            </Link>
        </div>
    );
}