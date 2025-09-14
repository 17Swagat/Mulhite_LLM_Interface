import Link from "next/link";
import { Metadata } from "next";

type Props = {
    params: Promise<{ productId: string }>;
}

// Write the function with this exact name: `generateMetadata`
export const generateMetadata = async ({params}: Props): Promise<Metadata> => {
    const id = (await params).productId;
    return {
        title: `Product ${id}`,
        description: `This is the page for product ${id}`,
    };
}

export default async function ProductIdPage(
    {params} : Props
) {
    const rparams = await params; 
    
    return (
        <div className="h-screen w-screen flex flex-col gap-2 items-center justify-center bg-gradient-to-r from-blue-900 via-purple-400 to-blue-500">
            <h1 className="text-7xl">Product Details Page</h1>
            <h2 className="text-5xl font-bold">Product {rparams.productId}</h2>
            <Link 
            href={`/products/${rparams.productId}/reviews/${rparams.productId}`} 
            className="text-3xl mt-3 font-bold text-purple-900 bg-amber-300 p-1 rounded-[10px] hover:brightness-125 active:brightness-75">Reviews</Link>
            <Link 
            href={`/products`} 
            className="text-3xl mt-3 font-bold text-purple-900 bg-amber-300 p-1 rounded-[10px] hover:brightness-125 active:brightness-75">PRODUCTS</Link>
        </div>
    )
}