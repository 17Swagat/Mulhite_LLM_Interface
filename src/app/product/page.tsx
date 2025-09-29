import { ProductComponent } from "@/components/temp/product"
import { ReviewsComponent } from "@/components/temp/review"
import { Suspense } from "react"

export default function ProductsReviewPage() {
    return <div className="w-screen h-screen bg-amber-700 flex items-center justify-center text-white text-3xl">
        <div className="flex flex-col gap-5">   
            <h1 className="underline">    
                Products Review Page
            </h1>
            <Suspense fallback={<div>Loading Product...</div>}>
                <ProductComponent />
            </Suspense>
            <Suspense fallback={<div>Loading Reviews...</div>}>
                <ReviewsComponent />
            </Suspense>
        </div>

    </div>
}