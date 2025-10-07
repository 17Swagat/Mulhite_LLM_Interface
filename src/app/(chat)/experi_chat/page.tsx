'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

export default function Page() {
    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({
            api: '/experi_chat/experi_api',
        }),
    });
    const [input, setInput] = useState('');

    return (
        <div
            className='w-screen h-screen bg-gray-800 text-white flex flex-col justify-center items-center px-50'>
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
                            {part.text}
                        </span> : null,
                    )}
                </div>
            ))}

            <form
                onSubmit={e => {
                    e.preventDefault();
                    if (input.trim()) {
                        sendMessage({ text: input });
                        setInput('');
                    }
                }}
            >
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    disabled={status !== 'ready'}
                    placeholder="Say something..."
                />
                <button type="submit" disabled={status !== 'ready'}>
                    Submit
                </button>
            </form>
        </div>
    );
}