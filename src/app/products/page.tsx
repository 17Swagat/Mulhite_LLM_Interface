import Link from "next/link";

export default function ProductsPage() {
    return (
        <div className="h-screen w-screen flex flex-col gap-2 items-center justify-center bg-gradient-to-r from-blue-900 via-purple-400 to-blue-500">
            <h1 className="text-5xl bg-blue-400">
                <Link href='/products/1'>
                Product 1
                </Link>
                
            </h1>
            <h2 className="text-5xl bg-blue-400">
                <Link href='/products/2'>
                Product 2
                </Link>
                </h2>
            <h2 className="text-5xl bg-blue-400">

                <Link href='/products/3'>
                Product 3
                </Link>
            </h2>
            <h2 className="text-5xl bg-blue-400">
                <Link href='/products/4'>
                Product 4
                </Link>
            </h2>
        </div>
    );
}
