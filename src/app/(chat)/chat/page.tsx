// DeepSeek #1:
"use client";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { useChatStore } from "@/stores/chatStore";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function ChatPage() {
    const router = useRouter();
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
                // Note: userId will be set by the backend
                addChat({
                    _id: conversationId,
                    title,
                    createdAt: now,
                    updatedAt: now,
                    userId: '' as any, // This will be replaced when the sidebar refreshes
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
                // Reset submitting state after navigation
                setTimeout(() => setIsSubmitting(false), 1000);
            }
        }
    };

    const [input, setInput] = useState("");

    // Prompt-Submit Button Ref
    const formRef = useRef<HTMLFormElement>(null);
    const translateDown = () => {
        // Translate down
        if (formRef.current) {
            formRef.current.style.transform = "translateY(50vh)";
            formRef.current.style.transition = "transform 0.9s ease-in-out";
            // You can also use a CSS class instead of inline styles
            // formRef.current.classList.add('translate-down');
        }
    };

    return (
        <div className="w-full h-screen bg-purple-700/80 text-white flex justify-center items-center">
            <div className="flex flex-col items-center">
                <h1 className="text-3xl">Write Your Prompt</h1>

                <form ref={formRef} onSubmit={handleSubmit}>
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
                        className={`w-[70px] h-[70px] bg-blue-700 font-bold active:bg-blue-900 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        /*onClick={(e) => {
                            if (input.trim() !== "") {
                                // translateDown();
                            }
                        }}*/
                    >
                        {isSubmitting ? "..." : "GO!"}
                    </button>
                </form>
            </div>
        </div>
    );
}