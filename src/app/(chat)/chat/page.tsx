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
// "use client";

// import { useCompletion } from "@ai-sdk/react";
// import { Response } from "@/components/ui/shadcn-io/ai/response";
// import Example from "./api/_ui/UserChatInputBox";

// export default function CompletionStreamPage() {
//   const {
//     completion,
//     input,
//     handleInputChange,
//     handleSubmit,
//     isLoading,
//     error,
//     stop,
//     setInput,
//   } = useCompletion({
//     api: "/chat/api",
//   });

//   return (
//     <>
//       <div className="flex flex-col w-full max-w-4xl py-24 mx-auto stretch pb-20 bg-pink-300">
//         {error && <div className="text-red-500 mb-4">{error.message}</div>}
//         {isLoading && !completion && <div>Loading...</div>}

//         {/* {completion && <div className="whitespace-pre-wrap">{completion}</div>} */}
//         {completion && <Response>
//           {completion}
//         </Response>}

//       </div>

//       {/* <Example /> */}
//       <Example
//         input={input}
//         handleInputChange={handleInputChange}
//         handleSubmit={handleSubmit}
//         isLoading={isLoading}
//         stop={stop}
//         setInput={setInput}
//       />
//     </>
//   );
// }




// #3
"use client";

import { useCompletion } from "@ai-sdk/react";
import { Response } from "@/components/ui/shadcn-io/ai/response";
import Example from "./api/_ui/UserChatInputBox";
import { useEffect, useRef } from "react";

export default function CompletionStreamPage() {
  const { completion, input, handleInputChange, handleSubmit, isLoading, error, setInput } = useCompletion({
    api: "/chat/api",
  });

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [completion]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-500">
      <div ref={contentRef} className="flex flex-col w-full max-w-3xl mx-auto py-6 pb-[170px] px-4 grow overflow-y-auto">
        {error && <div className="text-red-500 mb-4">{error.message}</div>}
        {isLoading && !completion && <div className="text-gray-500">Loading...</div>}
        {completion && (
          <Response className="bg-white p-4 rounded-lg shadow-sm mb-4">{completion}</Response>
        )}
      </div>
      <Example
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        setInput={setInput}
      />
    </div>
  );
}


