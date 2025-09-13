export default async function DocsPage(
    {params}:{params: Promise<{slug: string[]}>}) 
{
    const {slug} = await params;
    if (slug?.length == 2) {
    }
    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center">
            <h1 className="text-4xl">Documentation</h1>
            <hr className="my-4 border-2 border-gray-300 w-[500px]" />
            <ul className="text-2xl">
                <li>Getting Started</li>
                <li>API Reference</li>
                <li>Tutorials</li>
            </ul>
        </div>
    );
}