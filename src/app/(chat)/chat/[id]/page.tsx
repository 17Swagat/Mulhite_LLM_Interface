import { loadChat } from "@/utils/chat-store";
import Chat from "./chat";
import { Error_ChatNotFound } from "@/utils/custom_errors/chat_errors";
import ChatNotFound from "./ChatNotFound";

export default async function ChatPage_ID({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;

    try {
        const messages = await loadChat(id);
        return <Chat id={id} initialMessages={messages} />;
    } catch (error: unknown) {
        if (error instanceof Error_ChatNotFound) {
            return <ChatNotFound id={id} />;
        }

        // Optionally log unexpected errors
        // console.error('Unexpected error:', error);
        return (
            <div className="flex flex-col justify-center items-center min-h-screen w-full bg-gray-900 text-white p-50 px-[200px]">
                <h1 className="text-4xl font-bold mb-4">Chat Not Found</h1>
                <p className="text-lg">Unexpected Error Occurred. Kindly Refresh.</p>
            </div>
        );
    }



}