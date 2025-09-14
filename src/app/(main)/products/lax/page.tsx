import { Metadata } from "next";

// Write the function with this exact name: `generateMetadata`
export const generateMetadata = async (): Promise<Metadata> => {
    // const id = (await params).productId;
    return {
        title: `Product Lax`,
        description: `This is the page for product `,
    };
}

export default async function ProductLaxPage(
    // {params} : Props
) {
    // const rparams = await params; 
    
    return (
        <div className="h-screen w-screen flex flex-col gap-2 items-center justify-center bg-gradient-to-r from-blue-900 via-purple-400 to-blue-500 text-7xl">
            LAX
        </div>
    )
}