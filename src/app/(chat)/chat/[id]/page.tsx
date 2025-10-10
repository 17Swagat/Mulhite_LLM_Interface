// NOTE: **"Page not rendered in the <layout.tsx>"**
export default async function ChatPage_ID({ params }: { params: Promise<{ id: string }> }) {

    const {id} = await params;
    return (
        <>
            {/* NOT INCLUDED IN THE `layout.tsx` -> Won't Get Rendered!! */}
        </>
    );
}