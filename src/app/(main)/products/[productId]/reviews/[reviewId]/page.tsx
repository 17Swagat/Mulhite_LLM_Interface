import Link from "next/link"
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{productId: string, reviewId: string}>;
}

// NOTE: "We can't have `metadata` object & `generateMetadata` function in the same page. Its either one or the other. Not Both"

// Helps in Dyamically giving Meta Data
export const generateMetadata = async({params}: Props): Promise<Metadata> => {
    const {productId, reviewId} = await params;
    return {
        title: `Product ${productId} - Review ${reviewId}`,
        description: `This is the review page for product ${productId}, review ${reviewId}`,
    };
}


export default async function ProductIdReviewsPage(
    // {params}: {params: Promise<{productId: string, reviewId: string}>}
    {params}: Props
) {
    const {productId, reviewId} = await params;

    if (parseInt(productId) > 1000) {
        // If productId is greater than 1000, show the 404 page
        notFound();
    }

    return (
        <div className="h-screen w-screen flex flex-col gap-2 items-center justify-center bg-gradient-to-r from-blue-900 via-purple-400 to-blue-500">
            <h1 className="text-7xl">PRODUCT REVIEWS Page</h1>
            <p className="text-2xl p-5"> Product Review {reviewId} <span className="text-2xl text-orange-400">{productId}</span>: Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi sequi at sint repellendus quibusdam quo et perspiciatis excepturi accusamus in.</p>
            <Link 
            href={`/products/${productId}`} 
            className="text-3xl mt-3 font-bold text-purple-900 bg-amber-300 p-1 rounded-[10px] hover:brightness-125 active:brightness-75">Product</Link>
        </div>
    )
}