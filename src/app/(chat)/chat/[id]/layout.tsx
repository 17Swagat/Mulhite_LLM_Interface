// Updated for Convex migration
export default async function Layout({
  children,
  chatArea,
  // params
}: {
  children: React.ReactNode,
  chatArea: React.ReactNode,
  // params: Promise<{ id: string }>
}) {
  // const { id } = await params;
  
  // Simply render the chatArea - it will handle loading from Convex internally
  return (
    <>
      {chatArea}
    </>
  )
}
