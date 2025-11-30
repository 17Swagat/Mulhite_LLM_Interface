// // #3
// "use client";

// import {
//   PromptInput,
//   PromptInputButton,
//   PromptInputModelSelect,
//   PromptInputModelSelectContent,
//   PromptInputModelSelectItem,
//   PromptInputModelSelectTrigger,
//   PromptInputModelSelectValue,
//   PromptInputSubmit,
//   PromptInputTextarea,
//   PromptInputToolbar,
//   PromptInputTools,
// } from "@/components/ui/shadcn-io/ai/prompt-input";
// import { MicIcon, PaperclipIcon } from "lucide-react";
// import { type FormEventHandler, ChangeEventHandler, useState } from "react";

// const models = [
//   { id: "gpt-4o", name: "GPT-4o" },
//   { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet" },
//   { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
// ];

// interface ExampleProps {
//   input: string;
//   handleInputChange: ChangeEventHandler<HTMLTextAreaElement>;
//   handleSubmit: FormEventHandler<HTMLFormElement>;
//   isLoading: boolean;
//   setInput: (value: string) => void;
// }

// const UserChatInputBox = ({
//   input,
//   handleInputChange,
//   handleSubmit,
//   isLoading,
//   setInput,
// }: ExampleProps) => {
//   const [model, setModel] = useState<string>(models[0].id);

//   return (
//     // <div className="fixed bottom-2 left-0 right-0 w-full max-w-3xl mx-auto py-4 px-2 bg-linear-to-r from-blue-500 via-green-400 to-purple-500 shadow-md rounded-2xl">
//       <PromptInput
//         onSubmit={(e) => {
//           e.preventDefault();
//           if (!input) return;
//           handleSubmit(e);
//           setInput("");
//         }}
//       >
//         <PromptInputTextarea
//           onChange={handleInputChange}
//           value={input}
//           placeholder="Type your message..."
//           className="resize-none"
//         />
//         <PromptInputToolbar>
//           <PromptInputTools>
//             <PromptInputButton>
//               <PaperclipIcon size={16} />
//             </PromptInputButton>
//             <PromptInputButton>
//               <MicIcon size={16} />
//               <span className="sr-only">Voice</span>
//             </PromptInputButton>
//             <PromptInputModelSelect onValueChange={setModel} value={model}>
//               <PromptInputModelSelectTrigger>
//                 <PromptInputModelSelectValue />
//               </PromptInputModelSelectTrigger>
//               <PromptInputModelSelectContent>
//                 {models.map((model) => (
//                   <PromptInputModelSelectItem key={model.id} value={model.id}>
//                     {model.name}
//                   </PromptInputModelSelectItem>
//                 ))}
//               </PromptInputModelSelectContent>
//             </PromptInputModelSelect>
//           </PromptInputTools>
//           <PromptInputSubmit
//             disabled={!input || isLoading}
//             status={isLoading ? "streaming" : "ready"}
//             className="bg-blue-500 hover:bg-blue-600 text-white"
//           />
//         </PromptInputToolbar>
//       </PromptInput>
//     // </div>
//   );
// };

// export default UserChatInputBox;
