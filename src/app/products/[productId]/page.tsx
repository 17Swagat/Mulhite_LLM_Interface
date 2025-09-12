export default async function ProductIdPage({params} : {params: Promise<{productId: string}>}) {
    
    // const productId = (await params).productId;
    const rparams = await params; // rparams :=> "received parameters"
    return (
        <div className="h-screen w-screen flex flex-col gap-2 items-center justify-center bg-gradient-to-r from-blue-900 via-purple-400 to-blue-500">
            <h1 className="text-7xl">Product Details Page</h1>
            <h2 className="text-5xl font-bold">Product {rparams.productId}</h2>
        </div>
    )
}