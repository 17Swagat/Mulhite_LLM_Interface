import Link from "next/link";


export default function ProductsPage() {
    
    return (
        <div className="flex flex-col gap-4">
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
            <h2 className="text-5xl bg-blue-400">
                <Link href='/products/iphone'>
                Product IPHONE
                </Link>
            </h2>
        </div>
    );
}
