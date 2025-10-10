'use client';

import { UIMessage, useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useState, useRef } from 'react';
import { Response } from '@/components/ui/shadcn-io/ai/response';
import { v7 as uuidv7 } from 'uuid';

export default function ChatArea({
    id,
    initialMessages,
}: { id?: string | undefined; initialMessages?: UIMessage[] } = {}) {


    const [input, setInput] = useState('');
    const [hasProcessedPendingMessage, setHasProcessedPendingMessage] = useState(false);

    const { sendMessage, messages, status, stop, setMessages } = useChat({
        id, // use the provided chat ID
        transport: new DefaultChatTransport({
            api: '/api/persist-chat',
            body: { chatId: id }, // pass chatId to the API
        }),
    });

    // Load initial messages when component mounts
    useEffect(() => {
        if (initialMessages && initialMessages.length > 0) {
            setMessages(initialMessages);
        }
    }, [initialMessages, setMessages]);

    // Check for pending message from sessionStorage and send it
    useEffect(() => {
        if (id && !hasProcessedPendingMessage && status === 'ready' && messages.length === 0) {
            const pendingMessageKey = `pendingMessage_${id}`;
            const pendingMessage = sessionStorage.getItem(pendingMessageKey);

            if (pendingMessage) {
                console.log('Found pending message:', pendingMessage);
                // Send the pending message
                sendMessage({
                    text: pendingMessage,
                    metadata: { chatId: id }
                });
                // Clear the pending message from sessionStorage
                sessionStorage.removeItem(pendingMessageKey);
                setHasProcessedPendingMessage(true);
            }
        }
    }, [id, hasProcessedPendingMessage, status, sendMessage, messages.length]);


    // Code to always scroll down to the latest chat
    const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for the scroll target
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]); // Trigger whenever messages change



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && status === 'ready') {
            sendMessage({
                text: input,
                metadata: { chatId: id }
            });
            setInput('');
        }
    };

    return (
        // <div>

        <div className="flex flex-col justify-start items-center min-h-screen w-full bg-gray-900 text-white p-50 px-[200px]">


            {messages.map(message => {
                // console.log(message.id);

                if (message.id.trim() == '') {
                    message.id = uuidv7();
                }

                // console.log('Message ID:', message.id, message.role);

                return (
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
                            part.type === 'reasoning' ?
                                <span key={index} className='text-yellow-300 '>
                                    {/* {part.text} */}
                                    <Response>{part.text}</Response>
                                </span>

                                : null,
                        )}
                        {message.parts.map((part, index) =>
                            part.type === 'text' ?
                                <span key={index}>
                                    {/* {part.text} */}
                                    <Response>{part.text}</Response>
                                </span>

                                : null,
                        )}

                        {/* Empty div as scroll target */}
                        <div ref={messagesEndRef} />
                    </div>
                )
            }
            )}

            <form
                className="flex gap-1 fixed bottom-10"
                onSubmit={
                    handleSubmit
                }
            >
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    disabled={status !== 'ready'}
                    placeholder="Say something..."
                    className="w-[600px] h-[70px] placeholder-white text-white border-2 bg-black/90 border-white px-4 rounded-l-lg focus:border-pink-400 focus:outline-none"
                />
                <button
                    type="submit"
                    className={`w-[70px] h-[70px] flex justify-center items-center ${status === 'ready' ? "bg-blue-500" : "bg-red-500"}`}
                    onClick={() => {
                        if (status === 'submitted' || status === 'streaming') {
                            stop();
                        }
                    }}
                >
                    {status === 'ready' ? (
                        <div className="h-full flex items-center">Submit</div>
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <div className="w-6 h-6 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></div>
                        </div>
                    )}
                </button>


            </form>

        </div>
    );
}