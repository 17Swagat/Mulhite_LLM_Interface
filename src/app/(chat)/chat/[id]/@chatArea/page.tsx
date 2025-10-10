// DeepSeek V1:
'use client';
import { useEffect, useState } from 'react';
import ChatArea from "./_ui/ChatArea";
import { UIMessage } from "ai";

export default function ChatPage_ID({ params }: { params: Promise<{ id: string }> }) {
    const [id, setId] = useState<string | null>(null);
    const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadChatData = async () => {
            const { id: chatId } = await params;
            setId(chatId);

            try {
                const response = await fetch(`/api/persist-chat/${chatId}`);
                if (response.ok) {
                    const data = await response.json();
                    setInitialMessages(data.messages);
                } else {
                    // New chat or not found
                    setInitialMessages([]);
                }
            } catch (error) {
                console.error('Error loading chat:', error);
                setInitialMessages([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadChatData();
    }, [params]);

    if (isLoading || !id) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-700/40 via-pink-600/80 to-red-800/90">
                <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-white ml-4"></div>
            </div>
        );
    }

    return <ChatArea id={id} initialMessages={initialMessages} />;
}