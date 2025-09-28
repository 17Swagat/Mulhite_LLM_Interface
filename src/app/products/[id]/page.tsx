export const revalidate = 1; // ISR: revalidate this page every 1 second
export const dynamicParams = false; // if params(id) not in the list of generateStaticParams, show 404 page Not Found

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
