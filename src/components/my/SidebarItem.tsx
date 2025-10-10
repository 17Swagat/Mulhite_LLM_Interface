'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarItem(
    { title, navLink }: { title: string; navLink: string }) {

    const pathname = usePathname();
    // const isActive = pathname === `/chat/${navLink}`;
    const isActive = pathname === `${navLink}`;

    // console.log(title)

    return (
        <Link
            href={`${navLink}`}
            className={`text-white bg-black w-full h-full ${isActive ? 'bg-gray-700' : 'bg-yellow-700'} flex text-center hover:bg-green-500`}
        >
            <span className="text-white text-ellipsis truncate">{title  || 'Untitled Chat'}</span>
        </Link>
    );
}