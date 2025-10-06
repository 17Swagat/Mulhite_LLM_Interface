// export default function ChatPage(){
//     return (
//         <div className="w-screen min-h-screen bg-amber-600">
//         </div>
//     );
// }


// #1
// 'use client';

// import { Chat, useChat, useCompletion } from '@ai-sdk/react';
// import { useState } from 'react';
// import { DefaultChatTransport } from 'ai';

// export default function ChatPage() {
//     const [inputText, setInput] = useState('');
//     const {input, handleInputChange} = useCompletion();

//     const { messages, sendMessage } = useChat({
//         transport: new DefaultChatTransport(
//             {
//                 api: '/chat/api/',
//             }
//         ),
//     });

//     return (
//         <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
//             {messages.map(message => {
//                 console.log("message-contents:\n", message);
//                 return (
//                     <div key={message.id} className="whitespace-pre-wrap">
//                         {message.role === 'user' ? 'User: ' : 'AI: '}
//                         {message.parts.map((part, i) => {
//                             switch (part.type) {
//                                 case 'text':
//                                     return <div key={`${message.id}-${i}`}>{part.text}</div>;
//                             }
//                         })}
//                     </div>
//                 )
//             }

//             )}

//             <form
//                 onSubmit={e => {
//                     e.preventDefault();
//                     sendMessage({ text: inputText });
//                     setInput('');
//                 }}
//             >
//                 <input
//                     className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
//                     value={inputText}
//                     placeholder="Say something..."
//                     onChange={e => setInput(e.currentTarget.value)}
//                 />
//             </form>
//         </div>
//     );
// }




// #2
"use client";

import { useCompletion } from "@ai-sdk/react";
import { Response } from "@/components/ui/shadcn-io/ai/response";
import Example from "./api/_ui/UserChatInputBox";

export default function CompletionStreamPage() {
  const {
    completion,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    stop,
    setInput,
  } = useCompletion({
    api: "/chat/api",
  });

  return (
    <>
      <div className="flex flex-col w-full max-w-4xl py-24 mx-auto stretch">
        {error && <div className="text-red-500 mb-4">{error.message}</div>}
        {isLoading && !completion && <div>Loading...</div>}

        {/* {completion && <div className="whitespace-pre-wrap">{completion}</div>} */}
        {completion && <Response>
          {completion}
        </Response>}

        {/* <form
        onSubmit={(e) => {
          e.preventDefault();
          setInput(""); // temporary fix to clear the input after submission
          handleSubmit(e);
        }}
        className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-lg"
      >
        <div className="flex gap-2">
          <input
            className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl"
            value={input}
            onChange={handleInputChange}
            placeholder="How can I help you?"
          />

          {isLoading ? (
            <button
              type="submit"
              onClick={stop}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Send
            </button>
          )}
        </div>
      </form> */}

      </div>

      {/* <Example /> */}
      <Example
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        stop={stop}
        setInput={setInput}
      />
    </>
  );
}



