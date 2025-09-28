// Specify that dynamic routes should be rendered dynamically
export const revalidate = 1; // Revalidate static pages every 1second (Even though the routes refreshs after 1 second, but once a route is generated, it will get store in the .next/sever/app/products/ directory and won't disappear. )
export const dynamicParams = true;//'force-dynamic';

// Static Generation for these specific paths(id):
export async function generateStaticParams() {
    return [{id: '1'}, {id: '2'}, {id: '3'}];
}



export default async function ProductPage_Id({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

    const { id } = await params;
    
    return (
      <div className="w-screen h-screen bg-amber-700 flex items-center justify-center text-white text-3xl">
        Product Page - {id} -&gt; {new Date().toLocaleTimeString()}
      </div>
    );
}
