import Link from "next/link";
export default function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        // <>
        <div className="min-h-screen bg-black">

            {/* Header */}
            <header className="bg-black/90 shadow-sm p-2">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">NodyChat➡️</h1>
                    <div className='space-x-10 text-xl text-gray-500'>
                        <Link href="/features" className=" hover:text-white transition duration-300">Features</Link>
                        <Link href="/pricing" className=" hover:text-white transition duration-300">Pricing</Link>
                        <Link href="/changelog" className=" hover:text-white transition duration-300">Tutorial</Link>
                        <Link href="/changelog" className=" hover:text-white transition duration-300">Changelog</Link>
                    </div>
                    <div className="space-x-4 text-xl">
                        <Link href="/signin" className="text-gray-200 hover:text-white transition duration-300 ">Login</Link>
                        <Link href="/signup" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-300">Get Started</Link>
                    </div>
                </nav>
            </header>

            {children}

        </div>
        // </>
    );
}
