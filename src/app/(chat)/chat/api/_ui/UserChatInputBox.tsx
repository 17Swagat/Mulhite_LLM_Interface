// #2
'use client';
import { useState } from 'react';
import {
  PromptInput,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@/components/ui/shadcn-io/ai/prompt-input';
import { MicIcon, PaperclipIcon } from 'lucide-react';
import { type FormEventHandler, ChangeEventHandler } from 'react';

const models = [
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
];

interface ExampleProps {
  input: string;
  handleInputChange: ChangeEventHandler<HTMLTextAreaElement>;
  handleSubmit: FormEventHandler<HTMLFormElement>;
  isLoading: boolean;
  stop: () => void;
  setInput: (value: string) => void;
}

const Example = ({ input, handleInputChange, handleSubmit, isLoading, stop, setInput }: ExampleProps) => {
  const [model, setModel] = useState<string>(models[0].id);

  return (
    <div className="fixed bottom-0 py-3 px-100 w-full">
      <PromptInput onSubmit={(e) => {
        e.preventDefault();
        if (!input) return;
        handleSubmit(e);
        setInput(''); // Clear input after submission
      }}>
        <PromptInputTextarea
          onChange={handleInputChange}
          value={input}
          placeholder="Type your message..."
        />
        <PromptInputToolbar>
          <PromptInputTools>
            <PromptInputButton>
              <PaperclipIcon size={16} />
            </PromptInputButton>
            <PromptInputButton>
              <MicIcon size={16} />
              <span>Voice</span>
            </PromptInputButton>
            <PromptInputModelSelect onValueChange={setModel} value={model}>
              <PromptInputModelSelectTrigger>
                <PromptInputModelSelectValue />
              </PromptInputModelSelectTrigger>
              <PromptInputModelSelectContent>
                {models.map((model) => (
                  <PromptInputModelSelectItem key={model.id} value={model.id}>
                    {model.name}
                  </PromptInputModelSelectItem>
                ))}
              </PromptInputModelSelectContent>
            </PromptInputModelSelect>
          </PromptInputTools>
          <PromptInputSubmit
            disabled={!input || isLoading}
            status={isLoading ? 'streaming' : 'ready'}
            className="bg-pink-600 active:brightness-125"
          />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
};

export default Example;




// #1
// 'use client';
// import {
//     PromptInput,
//     PromptInputButton,
//     PromptInputModelSelect,
//     PromptInputModelSelectContent,
//     PromptInputModelSelectItem,
//     PromptInputModelSelectTrigger,
//     PromptInputModelSelectValue,
//     PromptInputSubmit,
//     PromptInputTextarea,
//     PromptInputToolbar,
//     PromptInputTools,
// } from '@/components/ui/shadcn-io/ai/prompt-input';
// import { MicIcon, PaperclipIcon } from 'lucide-react';
// import { type FormEventHandler, useState } from 'react';

// const models = [
//     { id: 'gpt-4o', name: 'GPT-4o' },
//     { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
//     { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
// ];

// const Example = () => {
//     const [text, setText] = useState<string>('');
//     const [model, setModel] = useState<string>(models[0].id);
//     const [status, setStatus] = useState<
//         'submitted' | 'streaming' | 'ready' | 'error'
//     >('ready');
//     const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
//         event.preventDefault();
//         if (!text) {
//             return;
//         }
//         setStatus('submitted');
//         setTimeout(() => {
//             setStatus('streaming');
//         }, 200);
//         setTimeout(() => {
//             setStatus('ready');
//             setText('');
//         }, 2000);
//     };
//     return (
//         <div className='fixed bottom-0 p-8 px-100 w-full'>
//             <PromptInput onSubmit={handleSubmit}>
//                 <PromptInputTextarea
//                     onChange={(e) => setText(e.target.value)}
//                     value={text}
//                     placeholder="Type your message..."
//                 />
//                 <PromptInputToolbar>
//                     <PromptInputTools>
//                         <PromptInputButton>
//                             <PaperclipIcon size={16} />
//                         </PromptInputButton>
//                         <PromptInputButton>
//                             <MicIcon size={16} />
//                             <span>Voice</span>
//                         </PromptInputButton>
//                         <PromptInputModelSelect onValueChange={setModel} value={model}>
//                             <PromptInputModelSelectTrigger>
//                                 <PromptInputModelSelectValue />
//                             </PromptInputModelSelectTrigger>
//                             <PromptInputModelSelectContent>
//                                 {models.map((model) => (
//                                     <PromptInputModelSelectItem key={model.id} value={model.id}>
//                                         {model.name}
//                                     </PromptInputModelSelectItem>
//                                 ))}
//                             </PromptInputModelSelectContent>
//                         </PromptInputModelSelect>
//                     </PromptInputTools>
                    
//                     <PromptInputSubmit disabled={!text} status={status} className='bg-pink-600 active:brightness-125' />

//                 </PromptInputToolbar>
//             </PromptInput></div>
//     );
// };
// export default Example;
