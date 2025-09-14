// NOTE: "To access [params] and [search-params] inside a client component we use `use()` hook, since we can't use async/await in a Client Component."

'use client';
import Link from "next/link";

import { use } from "react";

type Props = {
    params: Promise<{ articleId: string }>;
    // searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
    searchParams: Promise<{ lang?: "en" | "fr" }>;
};

// export default function Articles({params} : {params: Promise<{articleId: string}>}) {
// export default async function Articles({params, searchParams} : Props) {
export default function Articles({params, searchParams} : Props) {

    const {articleId} = use(params); //(await params);
    const {lang} = use(searchParams); //(await searchParams); //?.lang;

    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-pink-600 text-white gap-4">
            <h1 className="text-6xl">Articles</h1>
            <h2 className="text-4xl">Article in English: {articleId}</h2>
            {(lang == "en") ? 
            <p className="px-5 text-2xl" lang="en">Hello Everyone.</p> 
            :
            <p className="px-5 text-2xl" lang="fr">Bonjour tout le monde.</p> 
        }
            {/* //<!-- French --> */}
        </div>
    );
}
