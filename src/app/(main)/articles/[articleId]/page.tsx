import Link from "next/link";

type Props = {
    params: Promise<{ articleId: string }>;
    // searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
    searchParams: Promise<{ lang?: "en" | "fr" }>;
};

// export default async function Articles({params, searchParams} : Props) {
export default async function Articles({params, searchParams} : Props) {

    const {articleId} = (await params);
    const {lang} = (await searchParams); //?.lang;


    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-pink-600 text-white gap-4">
            <h1 className="text-6xl">Articles</h1>
            <h2 className="text-4xl">Article in English: {articleId}</h2>
            {(lang == "en") ? 
            <p className="px-5 text-2xl" lang="en">Hello Everyone.</p> 
            :
            <p className="px-5 text-2xl" lang="fr">Bonjour tout le monde.</p> }
        </div>
    );
}
