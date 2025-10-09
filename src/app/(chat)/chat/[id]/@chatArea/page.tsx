import { loadChat } from "@/utils/chat-store";
import { Error_ChatNotFound } from "@/utils/custom_errors/chat_errors";
import ChatArea from "./ChatArea";
import ChatNotFound from "./ChatNotFound";
import { UIMessage } from "ai";

export default async function ChatPage_ID({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;
    let messages: UIMessage[] = [];
    try {
        messages = await loadChat(id);
        console.log(`Loaded messages for chat ID: ${id}`);
    } catch(error: unknown){
        // if (error instanceof Error_ChatNotFound) {
        //     return <ChatNotFound id={id} />;
        // }
    }


    return <ChatArea id={id} initialMessages={messages} />;

    /*try {
        const messages = await loadChat(id);
        return <ChatArea id={id} initialMessages={messages} />;
    } catch (error: unknown) {
        if (error instanceof Error_ChatNotFound) {
            return <ChatNotFound id={id} />;
        }

        return (
            <div className="flex flex-col justify-center items-center min-h-screen w-full bg-gray-900 text-white p-50 px-[200px]">
                <h1 className="text-4xl font-bold mb-4">Chat Not Found</h1>
                <p className="text-lg">Unexpected Error Occurred. Kindly Refresh.</p>
            </div>
        );
    }*/


}