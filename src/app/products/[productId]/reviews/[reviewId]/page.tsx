// [reviewId]
import Link from "next/link"
export default async function ProductIdReviewsPage(
    {params}: {params: Promise<{productId: string, reviewId: string}>}
) {
    // const rparams = await params; 
    const productId = (await params).productId;
    const reviewId = (await params).reviewId;

    return (
        <div className="h-screen w-screen flex flex-col gap-2 items-center justify-center bg-gradient-to-r from-blue-900 via-purple-400 to-blue-500">
            <h1 className="text-7xl">PRODUCT REVIEWS Page</h1>
            <p className="text-2xl p-5"> Product Review <span className="text-2xl text-orange-400">{productId}</span>: Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi sequi at sint repellendus quibusdam quo et perspiciatis excepturi accusamus in.</p>
            <Link 
            href={`/products/${productId}`} 
            className="text-3xl mt-3 font-bold text-purple-900 bg-amber-300 p-1 rounded-[10px] hover:brightness-125 active:brightness-75">Product</Link>
        </div>
    )
}