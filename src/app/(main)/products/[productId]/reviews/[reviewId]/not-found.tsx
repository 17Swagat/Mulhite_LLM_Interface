'use client';
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function NotFound() {

    const imgURL_linkNotFound = 'https://static.vecteezy.com/system/resources/previews/008/255/803/non_2x/page-not-found-error-404-system-updates-uploading-computing-operation-installation-programs-system-maintenance-a-hand-drawn-layout-template-of-a-broken-robot-illustration-vector.jpg';
    
    const pathname = usePathname();
    const productId: string = pathname.split('/')[2];

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center">
            <h1 className="text-4xl">404 - Page Not Found</h1>
            <hr className="my-4 border-2 border-gray-300 w-[500px]" />
            <h2 className="text-3xl mb-3">Message: No Reviews for {productId}</h2>
            <Image
                src={imgURL_linkNotFound}
                alt="404 - Page Not Found"
                width={500}
                height={500}
            />
        </div>
    );
}