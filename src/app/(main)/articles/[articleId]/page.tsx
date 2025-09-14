import Link from "next/link";

type Props = {
    params: Promise<{articleId: string}>
}

// export default function Articles({params} : {params: Promise<{articleId: string}>}) {
export default function Articles({params} : Props) {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-pink-600 text-white gap-4">
            <h1 className="text-6xl">Articles</h1>
            <h2 className="text-4xl">Article in English</h2>
            <p className="px-5 text-2xl" lang="en">Hello Everyone.</p> 
            {/* //<!-- French --> */}
            <p className="px-5 text-2xl" lang="fr">Bonjour tout le monde.</p> 
        </div>
    );
}
