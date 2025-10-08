import { loadChat } from "@/utils/chat-store";
import Chat from "./chat";

export default async function ChatPage_ID({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;
    const messages = loadChat(id);

    return <Chat id={id} initialMessages={await messages} />
}