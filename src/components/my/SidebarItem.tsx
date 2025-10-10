'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarItem(
    { title, navLink }: { title: string; navLink: string }) {

    const pathname = usePathname();
    const isActive = pathname === `${navLink}`;

    return (
        <Link
            href={`${navLink}`}
            className={`text-white bg-black w-full h-full ${isActive ? 'bg-gray-700' : 'bg-yellow-700'} flex text-center hover:bg-green-500 p-1 rounded-2xl`}
        >
            <span className="text-white text-ellipsis truncate">{title  || 'Untitled Chat'}</span>
        </Link>
    );
}