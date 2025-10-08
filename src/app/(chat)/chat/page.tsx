// #3

import { redirect } from "next/navigation";
// import {generateId} from 'ai';
import { createChat } from "@/utils/chat-store";
import Chat_LoadingScreen from "./loading";

export default async function ChatPage() {

    const id = await createChat(); // create a new chat
    redirect(`/chat/${id}`); // redirect to chat page, see below

    return <Chat_LoadingScreen/>

    // "intentional delay":=>
    // await new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
    //     // redirect(`/chat/${id}`);
    //     redirect(`/chat/${id}`);
    // })

}



// #2
// "use client";

// // import { useChat, useCompletion } from "@ai-sdk/react";
// import { Response } from "@/components/ui/shadcn-io/ai/response";
// import Example from "./_ui/UserChatInputBox";
// import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ui/shadcn-io/ai/conversation";
// import { Message, MessageAvatar, MessageContent } from "@/components/ui/shadcn-io/ai/message";


// import { useChat } from "@ai-sdk/react";
// import { DefaultChatTransport } from "ai";
// import { useEffect, useRef, useState } from "react";


// // ... rest of the file

// export default function CompletionStreamPage() {
//   // const { completion, input, handleInputChange, handleSubmit, isLoading, error, setInput, stop } = useCompletion({
//   //   api: "/chat/api",
//   // });
//   const { messages, sendMessage, status, stop, error } = useChat({
//     transport: new DefaultChatTransport({
//       // api: '/experi_chat/experi_api',
//       api: '/api/',
//     }),
//   });

//   const [userInput, setUserInput] = useState('');

//   return (
//     <div className="flex flex-col justify-center items-center min-h-screen w-full bg-gray-900 text-white p-50">
//       {/* <div ref={contentRef} className="flex flex-col w-full max-w-3xl mx-auto py-6 pb-[170px] px-4 grow overflow-y-auto"> */}
//       {error && <div className="text-red-500 mb-4">{error.message}</div>}

//       {messages.map(message => (
//         <div key={message.id}>
//           {message.role === 'user' ?

//             <div className='bg-pink-500 w-fit'>
//               User:
//             </div>
//             :
//             <div className='bg-green-700 w-fit'>
//               AI
//             </div>
//           }
//           {message.parts.map((part, index) =>
//             part.type === 'text' ?
//               <span key={index}>
//                 {part.text}
//               </span> : null,
//           )}
//         </div>
//       ))}


//       <form
//         className="absolute bottom-10"
//         onSubmit={e => {
//           e.preventDefault();
//           if (userInput.trim()) {
//             sendMessage({ 
//               text: userInput,
//               metadata: {messages}
//             });
//             setUserInput('');
//             // setInput('');
//           }
//         }}
//       >
//         <input
//           value={userInput}
//           onChange={e => setUserInput(e.target.value)}
//           disabled={status !== 'ready'}
//           placeholder="Say something..."
//         />
//         <button type="submit" disabled={status !== 'ready'}>
//           Submit
//         </button>
//       </form>


//     </div>
//   );
// }



