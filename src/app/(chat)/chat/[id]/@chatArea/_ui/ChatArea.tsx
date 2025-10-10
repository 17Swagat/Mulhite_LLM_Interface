'use client';

import { UIMessage, useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useState, useRef } from 'react';
import { Response } from '@/components/ui/shadcn-io/ai/response';
import { v7 as uuidv7 } from 'uuid';
import { Reasoning, ReasoningContent, ReasoningTrigger } from '@/components/ui/shadcn-io/ai/reasoning';
import { Conversation, ConversationContent } from '@/components/ui/shadcn-io/ai/conversation';
import { Message, MessageContent } from '@/components/ui/shadcn-io/ai/message';

export default function ChatArea({
    id,
    initialMessages,
}: { id?: string | undefined; initialMessages?: UIMessage[] } = {}) {
    const [input, setInput] = useState('');
    const [hasProcessedPendingMessage, setHasProcessedPendingMessage] = useState(false);

    const { sendMessage, messages, status, stop, setMessages } = useChat({
        id,
        transport: new DefaultChatTransport({
            api: '/api/persist-chat',
            body: { chatId: id },
        }),
    });

    useEffect(() => {
        if (initialMessages && initialMessages.length > 0) {
            setMessages(initialMessages);
        }
    }, [initialMessages, setMessages]);

    useEffect(() => {
        if (id && !hasProcessedPendingMessage && status === 'ready' && messages.length === 0) {
            const pendingMessageKey = `pendingMessage_${id}`;
            const pendingMessage = sessionStorage.getItem(pendingMessageKey);

            if (pendingMessage) {
                sendMessage({
                    text: pendingMessage,
                    metadata: { chatId: id }
                });
                sessionStorage.removeItem(pendingMessageKey);
                setHasProcessedPendingMessage(true);
            }
        }
    }, [id, hasProcessedPendingMessage, status, sendMessage, messages.length]);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
        <div className="flex flex-col items-center-safe min-h-screen bg-gray-900 text-white">
            <div className="flex-1 overflow-y-auto p-6">
                <Conversation className="max-w-11/12 mx-auto">
                    <ConversationContent>
                        {messages.map((message, messageIndex) => {
                            if (message.id.trim() === '') {
                                message.id = uuidv7();
                            }
                            // Only consider streaming if it's the last message
                            const isLastMessage = messageIndex === messages.length - 1;
                            const isCurrentlyStreaming = status === 'streaming' && isLastMessage;
                            
                            return (
                                <Message from={message.role} key={message.id} className="mb-4">
                                    <MessageContent className="bg-gray-800 p-3 rounded-lg">
                                        {message.parts.map((part, index) =>
                                            part.type === 'reasoning' ? (
                                                <div key={index} className="mb-2">
                                                    <Reasoning
                                                        className="w-full"
                                                        isStreaming={isCurrentlyStreaming}
                                                        duration={0}
                                                        defaultOpen={false}
                                                    >
                                                        <ReasoningTrigger />
                                                        <ReasoningContent className="bg-yellow-600 text-white p-2 rounded">
                                                            {part.text}
                                                        </ReasoningContent>
                                                    </Reasoning>
                                                </div>
                                            ) : null
                                        )}
                                        {message.parts.map((part, index) =>
                                            part.type === 'text' ? (
                                                <span key={index} className="block">
                                                    <Response className="text-lg">{part.text}</Response>
                                                </span>
                                            ) : null
                                        )}
                                    </MessageContent>
                                </Message>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </ConversationContent>
                </Conversation>
            </div>

            <div className='h-20'></div>

            <form
                className="flex gap-1 fixed bottom-2"
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