"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useChatStore } from "@/stores/chatStore";
import { useMutation } from "convex/react";
import { api } from '@/../convex/_generated/api'
import { Id } from '@/../convex/_generated/dataModel'

export default function ChatPage() {
    const router = useRouter();
    const [input, setInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addChat, setActiveChat } = useChatStore();

    // Convex mutation
    const createConversation = useMutation(api.conversations.createConversation);

    // Clear active chat when landing on /chat page
    useEffect(() => {
        setActiveChat(null);
    }, [setActiveChat]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isSubmitting) {
            setIsSubmitting(true);

            try {
                // Create conversation in Convex
                const title = input.substring(0, 50) + (input.length > 50 ? '...' : '');
                const result = await createConversation({ title });

                const conversationId = result._id;
                const now = Date.now();

                // Add the new chat to Zustand store
                addChat({
                    _id: conversationId,
                    title,
                    createdAt: now,
                    updatedAt: now,
                    userId: '' as Id<"users">,
                });

                // Set as active chat
                setActiveChat(conversationId);

                // Store the initial message in sessionStorage with the conversation ID as key
                sessionStorage.setItem(`pendingMessage_${conversationId}`, input);

                // Navigate to the chat page with the new ID
                router.push(`/chat/${conversationId}`);

                setInput("");
            } catch (error) {
                console.error("Error creating chat:", error);
                alert("Failed to create chat. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="w-full h-screen bg-purple-700/80 text-white flex justify-center items-center">
            <div className="flex flex-col items-center">
                <h1 className="text-3xl">Write Your Prompt</h1>

                <form onSubmit={handleSubmit}>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isSubmitting}
                        placeholder="Say something..."
                        className="w-[600px] h-[70px] placeholder-white text-white border-2 bg-black/90 border-white px-4 rounded-l-lg focus:border-pink-400 focus:outline-none"
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting || !input.trim()}
                        className={`w-[70px] h-[70px] bg-blue-700 font-bold active:bg-blue-900 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {isSubmitting ? "..." : "GO!"}
                    </button>
                </form>
            </div>
        </div>
    );
}