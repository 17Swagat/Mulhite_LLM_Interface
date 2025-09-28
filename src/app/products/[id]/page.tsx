export default async function ProductPage_Id({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

    const { id } = await params;
    
    return (
      <div className="w-screen h-screen bg-amber-700 flex items-center justify-center text-white text-3xl">
        Product Page - {id}
      </div>
    );
}
