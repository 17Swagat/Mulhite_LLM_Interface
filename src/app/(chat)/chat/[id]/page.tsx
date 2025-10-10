// NOTE: **"Page not rendered in the <layout.tsx>"**
export default async function ChatPage_ID({ params }: { params: Promise<{ id: string }> }) {

    const {id} = await params;
    return (
        <div className="w-screen h-screen bg-purple-500">
            {/* NOT INCLUDED IN THE `layout.tsx` -> Won't Get Rendered!! */}
        </div>
    );
}