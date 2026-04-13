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
import { useAboutDeviceInfo } from "@/stores/aboutDevice";

export const PromptInputField = memo(
  function PromptInputField({
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
}) 
{

  const {
    parentChatModel,
    setParentChatModel,
    explainSideChatModel,
    setExplainSideChatModel,
  } = useSelectedAIModelStore();
  const { question, setQuestion, sideChatQuestion, setSideChatQuestion } =
    useUserQuestionStore();

  const { isTouchDevice } = useAboutDeviceInfo();

  return (
    <PromptInput onSubmit={handleSubmit} className=" tablet:w-xl lg:w-3xl 
    border-indigo-500/20">
    {/* border-t-purple-500 border-l-purple-700 border-r-purple-700 border-b-purple-600"> */}
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
            value={isSideChat ? explainSideChatModel : parentChatModel}
            onValueChange={
              isSideChat ? setExplainSideChatModel : setParentChatModel
            }
          >
            <PromptInputModelSelectTrigger>
              <PromptInputModelSelectValue />
            </PromptInputModelSelectTrigger>

            <PromptInputModelSelectContent className="dark">
              {availableModels.map((model: any) => {
                return (
                  <div key={model[0].id} className="flex items-center">
                    {isTouchDevice && (
                      <HoverModelInfoCard model={model} infoIconSize={18} />
                    )}
                    <PromptInputModelSelectItem
                      key={model[0].id}
                      value={model[0].id}
                      className="flex w-full"
                    >
                      {!isTouchDevice && <HoverModelInfoCard model={model} />}
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
        </PromptInputTools>

        <PromptInputSubmit
          className="transition-all duration-200 ease-out bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-400/30"
          disabled={
            (!isSideChat &&
              !inConversation &&
              (chatStatus === "streaming" || !question.trim())) ||
            (!isSideChat &&
              inConversation &&
              !question.trim() &&
              chatStatus === "ready") ||
            
              // SideChat:
            (isSideChat && sideChatQuestion.trim() === "")
            // || (isSideChat && !sideChatQuestion.trim() && chatStatus === "ready")
          }
          status={chatStatus}
        />
      </PromptInputToolbar>
    </PromptInput>
  );
});
