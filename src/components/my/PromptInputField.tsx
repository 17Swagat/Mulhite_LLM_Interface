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
import { memo } from "react";

// constants:

// Store
import { useSelectedAIModelStore } from "@/stores/modelSelectionStore";

import { HoverCard, HoverCardContent } from "../ui/hover-card";
import { HoverCardTrigger } from "@radix-ui/react-hover-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Avatar } from "../ui/avatar";

export const PromptInputField = memo(function PromptInputField({
  handleSubmit,
  input,
  setInput,
  chatStatus,
  inConversation = false,
  availableModels,
}: {
  handleSubmit: (e: React.FormEvent) => void;
  input: string;
  setInput: (value: string) => void;
  chatStatus: ChatStatus;
  inConversation?: boolean;
  availableModels: any;
}) {
  const { parentChatModel, setParentChatModel, reasoningOn, setReasoningOn } =
    useSelectedAIModelStore();

  return (
    <PromptInput onSubmit={handleSubmit}>
      <PromptInputTextarea
        className={`max-h-[16lh] ${scrollbarStyle.promptInput_Scrollbar}`}
        value={input}
        onChange={(e) => setInput(e.currentTarget.value)}
        disabled={chatStatus === "streaming"}
        placeholder="What do you want to learn about?"
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
              {availableModels.map((model: any) => (
                <div key={model.id}>
                  <PromptInputModelSelectItem
                    key={model.id}
                    value={model.id}
                    className="flex  w-full"
                  >
                    <HoverModelInfoCard model={model} />
                    {model.name}
                  </PromptInputModelSelectItem>
                </div>
              ))}
            </PromptInputModelSelectContent>
          </PromptInputModelSelect>

          <PromptInputButton
            onClick={() => {
              setReasoningOn(!reasoningOn);
              // console.log("Reasoning toggled:", !reasoningOn);
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
          </PromptInputButton>
        </PromptInputTools>

        <PromptInputSubmit
          className="transition duration-300 ease-in hover:brightness-105 bg-purple-700 hover:bg-purple-400 active:bg-purple-900"
          disabled={
            (!inConversation &&
              (chatStatus === "streaming" || !input.trim())) ||
            (inConversation && !input.trim() && chatStatus === "ready")
          }
          status={chatStatus}
        />
      </PromptInputToolbar>
    </PromptInput>
  );
});

// Model Info Hover Card Component:
function HoverModelInfoCard({ model }: { model: any }) {
  return (
    <HoverCard key={model.id} openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Button variant="link">
          <InfoIcon size={5} />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent
        align="end"
        sideOffset={8}
        className="w-80 bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-xl border border-purple-500/30 shadow-2xl shadow-purple-600/30 rounded-2xl p-0 animate-in fade-in-0 zoom-in-95 duration-200"
      >
        <Card className="border-0 shadow-none bg-transparent overflow-hidden">
          <CardHeader className="pb-3 px-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <Badge
                  variant="outline"
                  className="border-cyan-500/50 text-cyan-400 bg-cyan-500/10 text-xs px-2 py-0.5"
                >
                  {model.specification.provider}
                </Badge>
              </div>
            </div>

            <CardTitle className="text-lg font-bold text-white px-0">
              {model.name}
            </CardTitle>
            <CardDescription className="text-gray-400 text-sm">
              {model.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-0 px-4 pb-4">
            <Separator className="bg-purple-500/20" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1 text-gray-400">
                  <DollarSign className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  Input
                </span>
                <span className="font-mono text-cyan-400">
                  ${model.pricing?.input ?? "—"} /M
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1 text-gray-400">
                  <DollarSign className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                  Output
                </span>
                <span className="font-mono text-cyan-400">
                  ${model.pricing?.output ?? "—"} /M
                </span>
              </div>
              {model.pricing?.cachedInputTokens && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-gray-400">
                    <Zap className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                    Cache Read
                  </span>
                  <span className="font-mono text-yellow-400 text-xs">
                    ${model.pricing.cachedInputTokens} /M
                  </span>
                </div>
              )}
              {model.pricing?.cacheCreationInputTokens && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-gray-400">
                    <Clock className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                    Cache Write
                  </span>
                  <span className="font-mono text-orange-400 text-xs">
                    ${model.pricing.cacheCreationInputTokens} /M
                  </span>
                </div>
              )}
            </div>

            <Separator className="bg-purple-500/20" />

            <div className="text-xs space-y-1.5 text-gray-500">
              <div className="flex justify-between">
                <span>ID</span>
                <span className="font-mono text-cyan-400 truncate max-w-[140px]">
                  {model.specification.modelId}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Version</span>
                <span className="font-mono text-purple-400">
                  v{model.specification.specificationVersion}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Type</span>
                <span className="font-mono text-pink-400 capitalize">
                  {model.modelType}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </HoverCardContent>
    </HoverCard>
  );
}
