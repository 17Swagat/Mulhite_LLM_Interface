// Updated for Convex migration
'use client';
import { useEffect, useState } from 'react';
import ChatArea from "./_ui/ChatArea";

export default function ChatPage_ID({ params }: { params: Promise<{ id: string }> }) {
    const [id, setId] = useState<string | null>(null);

    useEffect(() => {
        const getId = async () => {
            const { id: chatId } = await params;
            setId(chatId);
        };
        getId();
    }, [params]);

    
    if (!id) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-700/40 via-pink-600/80 to-red-800/90">
                <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-white ml-4"></div>
            </div>
        );
    }

    // ChatArea now loads messages from Convex internally
    return <ChatArea id={id} />;
}