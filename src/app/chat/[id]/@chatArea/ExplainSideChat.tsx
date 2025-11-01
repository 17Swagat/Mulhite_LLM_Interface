"use client";

import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { PromptInputField } from "@/components/my/PromptInputField";
import { AI_MODELS } from "@/constants/models";
import { useState, useEffect, useRef, useMemo } from "react";
import { v7 as uuidv7 } from "uuid";
import { X, Trash2 } from "lucide-react";
import { api } from "@/../convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { Id } from "@/../convex/_generated/dataModel";
import { Response } from "@/components/ui/shadcn-io/ai/response";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  Conversation,
  ConversationContent,
} from "@/components/ui/shadcn-io/ai/conversation";
import { Message, MessageContent } from "@/components/ui/shadcn-io/ai/message";

interface ExplainSideChatContentProps {
  sideChatId: string;
  onClose: () => void;
}

export function ExplainSideChatContent({
  sideChatId,
  onClose,
}: ExplainSideChatContentProps) {
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return (
        sessionStorage.getItem(`pendingExplainModel_${sideChatId}`) ||
        AI_MODELS[0].id
      );
    }
    return AI_MODELS[0].id;
  });
  const [input, setInput] = useState<string>("");
  const initiatedRef = useRef(false);
  const prevSideChatIdRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Reset initiatedRef when sideChatId changes
  if (prevSideChatIdRef.current !== sideChatId) {
    initiatedRef.current = false;
    prevSideChatIdRef.current = sideChatId;
  }

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
        body: { chatId: sideChatId },
      }),
    [sideChatId]
  );

  const {
    messages,
    status: chatStatus,
    sendMessage,
    setMessages,
    stop,
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
          });
        }
      } catch (e) {
        console.error("Failed to save explain side-chat messages:", e);
      }
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length, chatStatus]);

  // Load existing messages from Convex
  useEffect(() => {
    if (!convexMessages || convexMessages.length === 0 || messages.length > 0)
      return;
    setMessages(
      convexMessages.map((m) => ({
        id: (m as any)._id,
        role: m.role,
        parts: m.parts as any,
      }))
    );
  }, [convexMessages, setMessages, messages.length]);

  // Send initial explain prompt ONLY if this is a brand new chat (no messages in Convex)
  useEffect(() => {
    // Wait for Convex data to load
    if (convexMessages === undefined) return;

    // If there are already messages in Convex, this is an existing chat - don't send initial prompt
    if (convexMessages.length > 0) {
      initiatedRef.current = true;
      return;
    }

    // Don't send if we already initiated or not ready or already have messages
    if (initiatedRef.current || chatStatus !== "ready" || messages.length > 0)
      return;

    const pending =
      typeof window !== "undefined"
        ? sessionStorage.getItem(`pendingExplainMessage_${sideChatId}`)
        : null;

    if (pending) {
      initiatedRef.current = true;
      sendMessage(
        { text: pending.trim(), metadata: { chatId: sideChatId } },
        { body: { model: selectedModel } }
      );
      sessionStorage.removeItem(`pendingExplainMessage_${sideChatId}`);
      sessionStorage.removeItem(`pendingExplainModel_${sideChatId}`);
      return;
    }

    // This shouldn't be needed anymore, but keep as fallback
    if (sideChat?.selectedText) {
      initiatedRef.current = true;
      sendMessage(
        {
          text: `Explain "${sideChat.selectedText}" based on the current conversation.`,
          metadata: { chatId: sideChatId },
        },
        { body: { model: selectedModel } }
      );
    }
  }, [
    convexMessages,
    chatStatus,
    messages.length,
    sideChat?.selectedText,
    selectedModel,
    sendMessage,
    sideChatId,
  ]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    sendMessage(
      { text, metadata: { chatId: sideChatId } },
      { body: { model: selectedModel } }
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
      <SheetContent className="bg-gray-900 text-white w-[600px] sm:w-[600px]">
        <SheetHeader>
          <SheetTitle className="text-white">Explain Chat</SheetTitle>
        </SheetHeader>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400">Loading...</p>
        </div>
      </SheetContent>
    );
  }

  return (
    // <SheetContent className="bg-gray-900 text-white w-[600px] sm:w-[600px] flex flex-col">
    <SheetContent className="bg-gray-800 text-white">
      <SheetHeader className="border-b border-gray-700 pb-4">
        {/* <div className="flex items-start justify-between">
          <div className="flex-1"> */}
        <SheetTitle className="text-white text-lg">Explain Chat</SheetTitle>
        <div className="flex justify-between">
          <SheetDescription className="text-gray-400 mt-2 text-sm">
            &ldquo;{sideChat.selectedText}&rdquo;
          </SheetDescription>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleDeleteSideChat}
            className=" text-red-400 hover:text-red-300 hover:bg-red-900/20"
          >
            <Trash2 size={18} />
          </Button>
        </div>

        {/* </div> */}
        {/* <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDeleteSideChat}
              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
            >
              <Trash2 size={18} />
            </Button>
            <SheetClose asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <X size={20} />
              </Button>
            </SheetClose>
          </div>
        </div> */}
      </SheetHeader>

      {/* Messages Area */}
      {/* <ScrollArea className="flex-1 py-4"> */}

      <Conversation className="bg-red-500">
        <ConversationContent>
          {messages.map((msg, msgIndex) => {
            return (
              <Message key={msg.id || msgIndex} from={msg.role}>
                <MessageContent key={msg.id || msgIndex}>
                  {msg.parts.map((part, partIndex) => {
                    if (part.type !== "text") return null;
                    if (msg.role === "assistant") {
                      return <Response>{part.text || ""}</Response>;
                    } else {
                      return <Response>{part.text || ""}</Response>;
                    }
                  })}
                </MessageContent>
              </Message>
            );
          })}
        </ConversationContent>
      </Conversation>

      {/* </ScrollArea> */}

      {/* Input Area */}
      <div className="border-t border-gray-700 pt-4">
        <PromptInputField
          selectedModel={selectedModel}
          setSelectedModelFunc={setSelectedModel}
          handleSubmit={handleSubmit}
          input={input}
          setInput={setInput}
          chatStatus={chatStatus === "streaming" ? "streaming" : "ready"}
          inConversation={true}
        />
      </div>
    </SheetContent>
  );
}
