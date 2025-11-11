"use client";
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
} from "@/components/ui/shadcn-io/ai/prompt-input";
import {
  MicIcon,
  PaperclipIcon,
  BrainIcon,
  InfoIcon,
  Sparkles,
  DollarSign,
  Zap,
  Clock,
} from "lucide-react";
import type { ChatStatus } from "ai";
import scrollbarStyle from "./PromptInputField.module.css";

// Hooks:=>
import { memo, startTransition } from "react";

// constants:

// Store
import { useSelectedAIModelStore } from "@/stores/modelSelectionStore";

import { useUserQuestionStore } from "@/stores/userQuestionStore";
import { HoverModelInfoCard } from "./HoverModelInfoCard";

export const PromptInputField = memo(function PromptInputField({
  handleSubmit,
  chatStatus,
  inConversation = false,
  availableModels,
  isSideChat = false,
}: {
  handleSubmit: (e: React.FormEvent) => void;
  chatStatus: ChatStatus;
  inConversation?: boolean;
  availableModels: any[];
  isSideChat?: boolean;
}) {
  const { parentChatModel, setParentChatModel } = useSelectedAIModelStore();
  const { question, setQuestion, sideChatQuestion, setSideChatQuestion } =
    useUserQuestionStore();

  return (
    <PromptInput onSubmit={handleSubmit}>
      <PromptInputTextarea
        className={`max-h-[16lh] ${scrollbarStyle.promptInput_Scrollbar}`}
        value={isSideChat ? sideChatQuestion : question}
        onChange={(e) => {
          startTransition(() => {
            if (isSideChat) {
              setSideChatQuestion(e.target.value);
            } else {
              setQuestion(e.target.value);
            }
          });
        }}
        disabled={chatStatus === "streaming"}
        // placeholder="What do you want to learn about?"
      />

      <PromptInputToolbar>
        <PromptInputTools className="flex justify-between w-full">
          {/* Model Selection */}
          <PromptInputModelSelect
            value={parentChatModel}
            onValueChange={setParentChatModel}
          >
            <PromptInputModelSelectTrigger>
              <PromptInputModelSelectValue />
            </PromptInputModelSelectTrigger>

            <PromptInputModelSelectContent>
              {availableModels.map((model: any) => {
                return (
                  <div key={model[0].id}>
                    <PromptInputModelSelectItem
                      key={model[0].id}
                      value={model[0].id}
                      className="flex w-full"
                    >
                      <HoverModelInfoCard model={model} />
                      {model[0].name}
                      {model[1] === "reasoning" && (
                        <BrainIcon size={30} className="text-green-500" />
                      )}
                    </PromptInputModelSelectItem>
                  </div>
                );
              })}
            </PromptInputModelSelectContent>
          </PromptInputModelSelect>

          {/* <PromptInputButton
            onClick={() => {
              setReasoningOn(!reasoningOn);
            }}
            className={`mr-2 ${
              reasoningOn
                ? "bg-linear-to-b from-[#11ca55] via-[#68f39b] to-[#06cf4c] "
                : "bg-gray-400"
            } active:bg-green-700 transition-colors duration-200 ease-in-out hover:brightness-125`}
          >
            <BrainIcon
              className={`${reasoningOn ? "text-black" : ""}`}
              size={16}
            />
          </PromptInputButton> */}
        </PromptInputTools>

        <PromptInputSubmit
          className="transition duration-300 ease-in hover:brightness-105 bg-purple-700 hover:bg-purple-400 active:bg-purple-900"
          disabled={
            (!isSideChat &&
              !inConversation &&
              (chatStatus === "streaming" || !question.trim())) ||
            (!isSideChat &&
              inConversation &&
              !question.trim() &&
              chatStatus === "ready") ||
            // // SideChat:
            (isSideChat && sideChatQuestion.trim() === "")
            // || (isSideChat && !sideChatQuestion.trim() && chatStatus === "ready")
          }
          status={chatStatus}
        />
      </PromptInputToolbar>
    </PromptInput>
  );
});
