// #3
"use client";

import { useCompletion } from "@ai-sdk/react";
import { Response } from "@/components/ui/shadcn-io/ai/response";
import Example from "./_ui/UserChatInputBox";
import { useEffect, useRef, useState } from "react";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ui/shadcn-io/ai/conversation";
import { Message, MessageAvatar, MessageContent } from "@/components/ui/shadcn-io/ai/message";



// ... rest of the file

export default function CompletionStreamPage() {
  const { completion, input, handleInputChange, handleSubmit, isLoading, error, setInput, stop } = useCompletion({
    api: "/chat/api",
  });

  const [userInput, setUserInput] = useState('');

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
        {/* {isLoading && !completion && <div className="text-gray-500">Loading...</div>} */}
        {isLoading && <div className="text-gray-500">Loading...</div>}

        {/* {completion && <div>hello<div> } */}
        {/* {completion && <div>{input}</div>} */}
        {/* display the user inputed question: */}

        <Conversation>
          <ConversationContent>
            <Message from="user">
              <MessageAvatar src="" name="User" />
              <MessageContent>
                <Response>
                  {userInput}
                </Response>
              </MessageContent>
            </Message>

            {completion && (
              // #1 Working!!
              // <Response className="bg-white p-4 rounded-lg shadow-sm mb-4">{completion}</Response>
              <>
                <Message from="assistant">
                  <MessageAvatar src="" name="AI" />
                  <MessageContent>
                    <Response>
                      {completion}
                    </Response>
                  </MessageContent>
                </Message>
              </>
            )}

          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>


      <Example
        input={input}
        handleInputChange={handleInputChange}
        // handleSubmit={handleSubmit}
        handleSubmit={() => {
          // console.log(input)
          setUserInput(input);
          handleSubmit();
        }}
        isLoading={isLoading}
        setInput={setInput}
      />
    </div>
  );
}

