import Navbar from "@/components/my/Navbar";
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
            <Navbar />

            {children}

        </div>
        // </>
    );
}
