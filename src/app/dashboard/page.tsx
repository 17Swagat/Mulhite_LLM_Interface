import Link from "next/link";
export default function DashBoard(){
    return (
        <div className="w-screen h-screen bg-purple-600/30">
            <h1 className="text-4xl">Route Handlers</h1>
            <p className="text-2xl">Let&apos;s learn about Route Handlers</p>
            <Link href={'/dashboard/api'} className="text-2xl bg-amber-500/70">
                DashBoard API Call
            </Link>
        </div>
    );
}