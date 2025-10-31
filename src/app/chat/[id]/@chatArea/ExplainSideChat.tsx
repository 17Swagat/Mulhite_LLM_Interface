import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { PromptInputField } from "@/components/my/PromptInputField";
import { AI_MODELS } from "@/constants/models";
import { useState } from "react";

export function ExplainSideChat({
  text = "",
  chatStatus,
}: {
  text: string;

  chatStatus: "submitted" | "ready" | "error" | "streaming";
}) {
  // Prompt Input Field State

  // Model-Selection (initialize lazily once)
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    let model = AI_MODELS[0].id;
    // if (typeof window !== "undefined") {
    //   const pendingMessageModelKey = `pendingMessage_Model_${id}`;
    //   const pendingMessageModel = sessionStorage.getItem(
    //     pendingMessageModelKey
    //   );
    //   if (pendingMessageModel) {
    //     model = pendingMessageModel;
    //     sessionStorage.removeItem(pendingMessageModelKey);
    //   }
    // }
    return model;
  });

  const [input, setInput] = useState<string>("");

  return (
    <SheetContent className="bg-gray-300">
      <SheetHeader className="py-1 px-2">
        <SheetTitle>Explaining</SheetTitle>
        <SheetDescription>{text}</SheetDescription>
      </SheetHeader>
      <div className="w-full h-full bg-amber-700">Selected Contents Are:</div>
      <SheetFooter>
        {/* <Button type="submit">Save changes</Button> */}
        {/* <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose> */}

        <PromptInputField
          // AI_MODESLS={AI_MODELS}
          selectedModel={selectedModel}
          setSelectedModelFunc={setSelectedModel}
          handleSubmit={() => {
            console.log("Explaination Query Submitted");
          }}
          input={input}
          setInput={setInput}
          chatStatus={chatStatus}
          inConversation={true}
        />
      </SheetFooter>
    </SheetContent>
  );
}
