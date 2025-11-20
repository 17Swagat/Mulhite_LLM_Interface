"use client";

import cssStyle from "./ExplainSideChat.module.css";

import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { PromptInputField } from "@/components/my/PromptInputField";
import { useEffect, useMemo, useState } from "react";
import { v7 as uuidv7 } from "uuid";
import { Trash2 } from "lucide-react";
import { api } from "@/../convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { Id } from "@/../convex/_generated/dataModel";
import { Response } from "@/components/ui/shadcn-io/ai/response";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ui/shadcn-io/ai/conversation";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/shadcn-io/ai/message";
import { useSelectedAIModelStore } from "@/stores/modelSelectionStore";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ui/shadcn-io/ai/reasoning";
import { useUserQuestionStore } from "@/stores/userQuestionStore";
import { useVercelAICreditsLeft } from "@/stores/aiprovidersCreditsStore";

// For Error Dialog:
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ExplainSideChatContentProps {
  sideChatId: string;
  onClose: () => void;
  parentConversationId: string;
  parentMessages?: any[]; // Messages from the main conversation for context
  availableModels: any[];
}

export function ExplainSideChatContent({
  sideChatId,
  onClose,
  parentConversationId,
  parentMessages = [],
  availableModels,
}: ExplainSideChatContentProps) {
  const { explainSideChatModel, setExplainSideChatModel } =
    useSelectedAIModelStore();

  const { setVercelAiGatewayCredits } = useVercelAICreditsLeft();

  const { sideChatQuestion, setSideChatQuestion } = useUserQuestionStore();

  const sideChat = useQuery(api.explainSideChats.getExplainSideChat, {
    sideChatId: sideChatId as Id<"explainSideChats">,
  });

  const convexMessages = useQuery(
    api.explainSideChats.getExplainSideChatMessages,
    { explainSideChatId: sideChatId as Id<"explainSideChats"> }
  );

  const addMessageMutation = useMutation(
    api.explainSideChats.addExplainSideChatMessage
  );

  const deleteSideChatMutation = useMutation(
    api.explainSideChats.deleteExplainSideChat
  );

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/multi-model",
        body: {
          chatId: sideChatId,
          parentConversationId,
          parentMessages, // Pass main conversation context
        },
      }),
    [sideChatId, parentConversationId]
  );

  const [errorMsg, setErrorMsg] = useState<string>("");
  const {
    messages,
    status: chatStatus,
    sendMessage,
    setMessages,
    stop,
    error,
    clearError,
  } = useChat({
    id: sideChatId,
    transport,
    onFinish: async ({ messages: allMessages }) => {
      try {
        const lastTwo = allMessages.slice(-2);
        for (const msg of lastTwo) {
          await addMessageMutation({
            explainSideChatId: sideChatId as Id<"explainSideChats">,
            role: msg.role as "user" | "assistant",
            parts: msg.parts.map((p: any) => ({ type: p.type, text: p.text })),
            ai_model:
              msg.role === "user"
                ? undefined
                : ((msg.metadata as any)?.model as string | undefined),
          });
        }
      } catch (e) {
        console.error("Failed to save explain side-chat messages:", e);
      } finally {
        setVercelAiGatewayCredits();
      }
    },
    onError: (err) => {
      /**
      (1) Invalid API Key
       */
      let errorOutMsg: string = "";
      if (err.message.includes("Invalid API key")) {
        errorOutMsg = `AI Gateway authentication failed: Invalid API key. Put correct API Key or  Create a new API key: https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%2Fapi`;
      }

      setErrorMsg(
        errorOutMsg
          ? errorOutMsg
          : err.message || "An error occurred during the chat."
      );
    },
  });

  // Handle errors - display to user and reset state
  const [showerror, setError] = useState(false);
  useEffect(() => {
    if (error) {
      setError(true);
    }
  }, [error, clearError]);

  // Load existing messages from Convex
  useEffect(() => {
    if (!convexMessages || convexMessages.length === 0 || messages.length > 0)
      return;
    // setMessages(
    setMessages(
      convexMessages.map((m) => ({
        id: (m as any)._id,
        role: m.role,
        parts: m.parts as any,
        metadata: { model: m.ai_model },
        // ai_model: m.ai_model,
      }))
    );
  }, [convexMessages, setMessages, messages.length]);

  // Send initial explain prompt ONLY if this is a brand new chat (no messages in Convex)
  useEffect(() => {
    // Wait for Convex data to load
    if (convexMessages === undefined) return;

    // If there are already messages in Convex, this is an existing chat - don't send initial prompt
    if (convexMessages.length > 0) {
      return;
    }

    // Don't send if we already initiated or not ready or already have messages
    if (chatStatus !== "ready" || messages.length > 0) return;

    const pending =
      typeof window !== "undefined"
        ? sessionStorage.getItem(`pendingExplainMessage_${sideChatId}`)
        : null;

    if (pending) {
      sendMessage(
        { text: pending.trim(), metadata: { chatId: sideChatId } },
        {
          body: {
            model: explainSideChatModel,
          },
        }
      );
      sessionStorage.removeItem(`pendingExplainMessage_${sideChatId}`);
      return;
    }

    // This shouldn't be needed anymore, but keep as fallback
    // REVIEW: "Will have to check if its important for not."
    // if (sideChat?.selectedText) {
    //   // initiatedRef.current = true;
    //   sendMessage(
    //     {
    //       text: `Explain "${sideChat.selectedText}" based on the current conversation.`,
    //       metadata: { chatId: sideChatId },
    //     },
    //     {
    //       body: {
    //         model: explainSideChatModel,
    //       },
    //     }
    //   );
    // }
  }, [
    convexMessages,
    chatStatus,
    messages.length,
    sideChat?.selectedText,
    explainSideChatModel,
    sendMessage,
    sideChatId,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sideChatQuestion.trim()) return;
    const text = sideChatQuestion.trim();
    setSideChatQuestion("");
    sendMessage(
      { text, metadata: { chatId: sideChatId } },
      {
        body: {
          model: explainSideChatModel,
        },
      }
    );
  };

  const handleDeleteSideChat = async () => {
    if (!sideChatId) return;
    try {
      await deleteSideChatMutation({
        sideChatId: sideChatId as Id<"explainSideChats">,
      });
      onClose();
    } catch (error) {
      console.error("Failed to delete side-chat:", error);
    }
  };

  if (!sideChat) {
    return (
      <SheetContent
        className={`border-0 bg-linear-to-r from-[#0f55c5] via-[#f43f5e] to-[#fb923c] text-white w-full! sm:w-[500px]! lg:w-[600px]! max-w-none!`}
      >
        <SheetHeader>
          <SheetTitle className="text-white">Explain Chat</SheetTitle>
          <SheetDescription className="sr-only">Loading...</SheetDescription>
        </SheetHeader>
        <div className="flex items-center justify-center h-full w-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-white ml-4" />
        </div>
      </SheetContent>
    );
  }

  return (
    // <SheetContent className="bg-gray-900 text-white w-[600px] sm:w-[600px] flex flex-col">
    <SheetContent
      className={` border-0 
      bg-linear-60 from-purple-600 via-cyan-600 to-green-800 
        text-white w-full! sm:w-[500px]! lg:w-[600px]! max-w-none!`}
    >
      <SheetHeader className="border-b border-gray-700 pb-4">
        <SheetTitle className="text-white text-lg">Explain Chat</SheetTitle>
        <div className="flex justify-between">
          <SheetDescription className="text-gray-200 mt-2 text-sm">
            &ldquo;{sideChat.selectedText}&rdquo;
          </SheetDescription>

          <Button
            variant="ghost"
            size="icon-lg"
            onClick={handleDeleteSideChat}
            className=" text-red-500 bg-black/95 hover:text-red-600 active:text-blue-500 hover:bg-red-900/20"
          >
            <Trash2 size={28} strokeWidth={2} />
          </Button>
        </div>
      </SheetHeader>

      <AlertDialog open={showerror} onOpenChange={setError}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error Occured</AlertDialogTitle>
            <AlertDialogDescription>{errorMsg}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                clearError();
                setError(false);
                setErrorMsg("");
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Messages Area */}
      <Conversation
        className={` w-full h-full overflow-y-hidden ${cssStyle.highlight_scrollbar}`}
      >
        <ConversationContent
          className={`bg-transparent ${cssStyle.highlight_scrollbar}`}
        >
          {messages.map((msg, msgIndex) => {
            const messageId = msg.id || uuidv7();

            // Only consider streaming if it's the last message
            const isLastMessage = msgIndex === messages.length - 1;
            const isCurrentlyStreaming =
              chatStatus === "streaming" && isLastMessage;

            // Avatar
            let avatar_logo: string = "/ai-models/claude.svg";
            if (msg.role === "assistant" && msg.metadata) {
              const model = (msg.metadata as any).model; // NOTE: TYPE-Error
              if (model) {
                if (model.includes("mistral")) {
                  avatar_logo = "/ai-models/mistral.svg";
                } else if (model.includes("deepseek")) {
                  avatar_logo = "/ai-models/deepseek.svg";
                } else if (model.includes("openai")) {
                  avatar_logo = "/ai-models/openai.svg";
                }
              }
            }

            return (
              <Message key={messageId} from={msg.role}>
                <MessageContent>
                  {/* Reasoning Block: */}
                  {msg.parts.map((part, index) =>
                    part.type === "reasoning" ? (
                      <div key={index} className="mb-2">
                        <Reasoning
                          className="w-full"
                          isStreaming={isCurrentlyStreaming}
                          duration={0}
                          defaultOpen={false}
                        >
                          <ReasoningTrigger />
                          <ReasoningContent className="bg-yellow-600 text-white p-2 rounded">
                            {part.text}
                          </ReasoningContent>
                        </Reasoning>
                      </div>
                    ) : null
                  )}

                  {/* Answer-Part: */}
                  {msg.parts.map((part, partIndex) => {
                    if (part.type !== "text") return null;
                    const partKey = `${messageId}-part-${partIndex}`;
                    if (msg.role === "assistant") {
                      return (
                        <Response key={partKey}>{part.text || ""}</Response>
                      );
                    } else {
                      return (
                        <Response key={partKey}>{part.text || ""}</Response>
                      );
                    }
                  })}
                </MessageContent>

                {/* Avatar */}
                <MessageAvatar
                  name={msg.role}
                  src={msg.role == "assistant" ? avatar_logo : "/user.png"}
                  className="bg-white"
                />
              </Message>
            );
          })}
          <ConversationScrollButton className="bg-gray-800 border-0 hover:bg-gray-500 hover:text-white" />
        </ConversationContent>
      </Conversation>

      {/* Input Area */}
      <div className="border-0 flex items-center justify-center mx-2.5">
        <PromptInputField
          availableModels={availableModels}
          handleSubmit={handleSubmit}
          chatStatus={chatStatus}
          inConversation={true}
          isSideChat={true} // * For turning on SideChat Input
        />
      </div>
    </SheetContent>
  );
}
