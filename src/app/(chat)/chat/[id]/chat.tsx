'use client';

import { UIMessage, useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';
import { Response } from '@/components/ui/shadcn-io/ai/response';

export default function Chat({
    id,
    initialMessages,
}: { id?: string | undefined; initialMessages?: UIMessage[] } = {}) {
    const [input, setInput] = useState('');
    
    // console.log(`Chat ID: ${id}`); // 
    const { sendMessage, messages, status, stop } = useChat({
        id, // use the provided chat ID
        messages: initialMessages, // load initial messages
        transport: new DefaultChatTransport({
            // api: '/api/chat',
            api: '/api/persist-chat',
            body: { chatId: id }, // pass chatId to the API
        }),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            sendMessage({ text: input, metadata:{messages} });
            // sendMessage({ role: 'user', parts: [{ type: 'text', text: input }] });
            setInput('');
        }
    };

    // simplified rendering code, extend as needed:
    return (
        // <div>

        <div className="flex flex-col justify-start items-center min-h-screen w-full bg-gray-900 text-white p-50 px-[200px]">

            {/* {messages.map(m => (
        <div key={m.id}>
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.parts
            .map(part => (part.type === 'text' ? part.text : ''))
            .join('')}
        </div>
      ))} */}

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

            {/* <form onSubmit={handleSubmit}>
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form> */}

            <form
                className="fixed bottom-10"
                onSubmit={
                    handleSubmit
            }
            >
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
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