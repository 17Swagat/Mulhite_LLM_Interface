import { loadChat } from "@/utils/chat-store";
import { Error_ChatNotFound } from "@/utils/custom_errors/chat_errors";
import ChatNotFound from "./@chatArea/ChatNotFound";
import ChatArea from "./@chatArea/ChatArea";

// NOTE: **"Page not rendered in the <layout.tsx>"**
export default async function ChatPage_ID({ params }: { params: Promise<{ id: string }> }) {

    const {id} = await params;
    console.log('Chat Page ID (in page.tsx): ', id)

    return (
        <div className="w-screen h-screen bg-purple-500"></div>
    );
}