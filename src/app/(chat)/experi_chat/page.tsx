import { Suspense } from "react";

export async function DataComponent2({ question }: { question: string }) {
    const encodedQuestion = encodeURIComponent(question);
    const res = await fetch(
        `http://localhost:3000/experi_chat/experi_api/${encodedQuestion}`,
        { cache: 'no-store' });
    const data = await res.json();

    return <div className="bg-pink-700">
        {data.ai_message}
    </div>;
}

export default function Page() {

    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <DataComponent2 question="Who is Mahatma Gandhi?" />
            </Suspense>
        </div>
    );
}