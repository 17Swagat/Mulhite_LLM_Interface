// DeepSeek #1:
"use client";
import { useRouter } from "next/navigation";
import { generateId, UIMessage } from "ai";
import { useRef, useState } from "react";
import { v7 as uuidv7 } from "uuid";

export default function ChatPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isSubmitting) {
            setIsSubmitting(true);

            // Generate a unique chat ID
            const id = uuidv7(); // Using UUID v7 for better uniqueness and sorting

            try {
                // Create an empty chat file with the new chat ID
                const response = await fetch("/api/persist-chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chatId: id,
                        messages: [], // Sending empty messages to create a blank chat
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to create chat");
                }

                // Store the initial message in sessionStorage with the chat ID as key
                sessionStorage.setItem(`pendingMessage_${id}`, input);

                // Navigate to the chat page with the new ID
                router.push(`/chat/${id}`);

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

// Old #1:
// 'use client';
// import { redirect } from "next/navigation";
// import { useRouter } from "next/navigation";
// import { DefaultChatTransport, generateId } from "ai";

// import { useState } from "react";
// // import { createChat } from "@/utils/chat-store";
// import { useChat } from "@ai-sdk/react";

// export default function ChatPage() {
//     // const new_id = generateId();
//     // redirect(`/chat/${new_id}`,);
//     const router = useRouter();

//     const id = generateId();
//     const { sendMessage } = useChat({
//         transport: new DefaultChatTransport({
//             api: '/api/persist-chat',
//             body: { chatId: id }, // pass chatId to the API
//         }, )
//     });

//     const [input, setInput] = useState('');
//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (input.trim()) {
//             // sendMessage({ text: input, metadata: { messages } });
//             // console.log(`New Chat ID: ${id}`);
//             // console.log('Chat Page ID: ', id)
//             sendMessage({ text: input,

//                 metadata: { chatId: id }

//              }).then(()=>{

//                 setInput('');
//                 router.push(`/chat/${id}`)
//              })
//         }
//     };

//     return (
//         <div className="w-screen h-screen bg-purple-700/80 text-white flex flex-col justify-center items-center">
//             <h1 className="text-3xl">Write Your Prompt</h1>
//             <form
//                 // className="fixed bottom-10"
//                 onSubmit={
//                     handleSubmit
//                 }
//             >
//                 <input
//                     value={input}
//                     onChange={e => setInput(e.target.value)}
//                     // disabled={status !== 'ready'}
//                     placeholder="Say something..."
//                     className="w-[600px] h-[70px] placeholder-white text-white border-2 bg-black/90 border-white px-4 rounded-l-lg focus:border-pink-400 focus:outline-none"
//                 />
//                 <button type="submit"
//                     // disabled={status !== 'ready'}
//                     className={`w-[70px] h-[70px] bg-blue-700 font-bold active:bg-blue-900`}
//                     onClick={handleSubmit}
//                 >
//                     GO!
//                     {/* {status == 'ready' ? 'Submit' : 'X'} */}
//                 </button>
//             </form>
//         </div>
//     );
// }
