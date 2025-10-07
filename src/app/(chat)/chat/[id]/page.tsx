// #3
"use client";

// import { useChat, useCompletion } from "@ai-sdk/react";
import { Response } from "@/components/ui/shadcn-io/ai/response";
// import Example from "./_ui/UserChatInputBox";
import Example from "../_ui/UserChatInputBox";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ui/shadcn-io/ai/conversation";
import { Message, MessageAvatar, MessageContent } from "@/components/ui/shadcn-io/ai/message";


import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState, use } from "react";



export default function ChatPage_ID({ params }: { params: Promise<{ chatId: string }> }) {

    // const {chatId} = await id;
    const { chatId } = use(params);

    const { messages, sendMessage, status, stop, error } = useChat({
        transport: new DefaultChatTransport({
            // api: '/experi_chat/experi_api',
            api: '/api/',
        }),
    });

    const [userInput, setUserInput] = useState('');


    return (
        <div className="flex flex-col justify-center items-center min-h-screen w-full bg-gray-900 text-white p-50 px-[200px]">
            {/* <div ref={contentRef} className="flex flex-col w-full max-w-3xl mx-auto py-6 pb-[170px] px-4 grow overflow-y-auto"> */}
            {error && <div className="text-red-500 mb-4">{error.message}</div>}

            {messages.map(message => (
                <div key={message.id}>
                    {message.role === 'user' ?

                        <div className='bg-pink-500 w-fit'>
                            User:
                        </div>
                        :
                        <div className='bg-green-700 w-fit'>
                            AI
                        </div>
                    }
                    {message.parts.map((part, index) =>
                        part.type === 'text' ?
                            <span key={index}>
                                {/* {part.text} */}
                                <Response>{part.text}</Response>
                            </span>

                            : null,
                    )}
                </div>
            ))}


            <form
                className="fixed bottom-10"
                onSubmit={e => {
                    e.preventDefault();
                    if (userInput.trim()) {
                        sendMessage({
                            text: userInput,
                            metadata: { messages }
                        });
                        setUserInput('');
                        // setInput('');
                    }
                }}
            >
                <input
                    value={userInput}
                    onChange={e => setUserInput(e.target.value)}
                    disabled={status !== 'ready'}
                    placeholder="Say something..."
                    className="w-[600px] h-[70px] text-white border-2 border-white px-4 rounded-l-lg focus:border-pink-400 focus:outline-none"
                />
                <button type="submit"
                    // disabled={status !== 'ready'}
                    className={`w-[70px] h-[70px] ${(status == 'ready' ? "bg-blue-500" : "bg-red-500")}`}
                    onClick={() => {
                        if (status == 'submitted' || status == 'streaming') {
                            stop();
                        }
                    }}
                >
                    {status == 'ready' ? 'Submit' : 'X'}
                </button>
            </form>


        </div>
    );
}

