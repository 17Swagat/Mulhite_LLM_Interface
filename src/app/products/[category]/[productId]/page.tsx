/*
 Multiple dynamic Route:=>

 Eg: /products/[category]/[productId]/page.tsx:
 */

export async function generateStaticParams() {
    return [
        // #C1
        {category: 'electronics', productId: '1'}, 
        {category: 'electronics', productId: '4'}, 
        // #C2
        {category: 'fashion', productId: '2'}, 
        {category: 'fashion', productId: '5'},
        // #C3
        {category: 'books', productId: '3'}, 
    ];
}


export default async function ProductPage_Id_Category({
  params,
}: {
  params: Promise<{ category: string; productId: string }>;
}) {

    const { category, productId } = await params;

    return (
      <div className="w-screen h-screen bg-amber-700 flex items-center justify-center text-white text-3xl">
        Product Page -&gt; {category} =&gt; {productId} -&gt; {new Date().toLocaleTimeString()}
      </div>
    );
}
