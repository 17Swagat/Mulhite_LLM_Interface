export default function ProductIdPage({params} : {params: {productId: string}}) {
    return (
        <div className="h-screen w-screen flex flex-col gap-2 items-center justify-center bg-gradient-to-r from-blue-900 via-purple-400 to-blue-500">
            <h1 className="text-7xl">Product Details Page</h1>
            <h2 className="text-5xl font-bold">Product {params.productId}</h2>
        </div>
    )
}