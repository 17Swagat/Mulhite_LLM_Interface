'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar(){

    const pathname = usePathname();

    const navLinks = [
        {linkName: 'Home', href: '/'},
        {linkName: 'Profile', href: '/profile'},
        {linkName: 'Products', href: '/products'},
        {linkName: 'Auth', href: '/login'},
    ];

    return (
        // <nav className="fixed bg-gray-600 w-full p-2 text-4xl flex justify-between">
        <nav className="bg-gray-600 w-full p-2 text-4xl flex justify-between">
          <Link href="/">N A V B A R</Link>
          <div>
            <ul className="flex gap-5">
                {navLinks.map(navItem => {
                    const isActive = (navItem.href == pathname) || (pathname.includes(navItem.href) && navItem.href != '/'); 
                    return (
                    <li key={navItem.linkName}>
                        <Link href={navItem.href} className={`${(isActive) ? "text-blue-500": ""}`} 
                        >
                            {navItem.linkName}
                        </Link>
                    </li>);
                })}
            </ul>
          </div>
        </nav>
    );
}