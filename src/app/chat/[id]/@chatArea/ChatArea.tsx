"use client";

import { UIMessage, useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useState, useRef } from "react";
import { Response } from "@/components/ui/shadcn-io/ai/response";
import { v7 as uuidv7 } from "uuid";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ui/shadcn-io/ai/reasoning";
import {
  Conversation,
  ConversationContent,
} from "@/components/ui/shadcn-io/ai/conversation";
import { Message, MessageContent } from "@/components/ui/shadcn-io/ai/message";
import { useChatStore } from "@/stores/chatStore";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
// import ChatNotFound from './_ui/ChatNotFound';
import ChatNotFound from "./ChatNotFound";

import { ShareIcon, HighlighterIcon } from "lucide-react";

export default function ChatArea({ id }: { id?: string | undefined } = {}) {
  const [input, setInput] = useState("");
  const [hasProcessedPendingMessage, setHasProcessedPendingMessage] =
    useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [conversationNotFound, setConversationNotFound] = useState(false);

  // zustand store:
  const { setActiveChat, addChat, getChatById, updateChatTitle, chats } =
    useChatStore();

  // Convex queries and mutations
  const conversationId = id as Id<"conversations">;
  const messagesData = useQuery(
    api.conversations.getMessages,
    id ? { conversationId } : "skip"
  );
  const addMessageToConvex = useMutation(api.conversations.addMessage);
  const updateConversationMutation = useMutation(
    api.conversations.updateConversation
  );

  const { sendMessage, messages, status, stop, setMessages } = useChat({
    id,
    transport: new DefaultChatTransport({
      api: "/api/persist-chat",
      body: { chatId: id },
    }),
    onFinish: async ({ message: finishedMessage, messages: allMessages }) => {
      if (!id) return;

      try {
        // Save both user and assistant messages to Convex
        // Get the last 2 messages (user message + assistant response)
        const lastTwoMessages = allMessages.slice(-2);

        for (const msg of lastTwoMessages) {
          // Check if message is already in Convex to avoid duplicates
          await addMessageToConvex({
            conversationId: conversationId,
            role: msg.role as "user" | "assistant",
            parts: msg.parts.map((part: any) => ({
              type: part.type,
              text: part.text,
            })),
          });
        }
      } catch (error) {
        console.error("Failed to save messages to Convex:", error);
      }
    },
  });

  // Set this chat as active when component mounts
  useEffect(() => {
    if (id) {
      setActiveChat(conversationId);

      // If chat doesn't exist in store, add it
      // console.log(conversationId)
      // console.log(chats) // [] ❓
      const existingChat = getChatById(conversationId);
      // console.log(existingChat) // undefined ❓

      if (!existingChat) {
        addChat({
          _id: conversationId,
          title: `Chat ${conversationId.slice(0, 8)}`, // Will be updated with first message
          createdAt: Date.now(),
          updatedAt: Date.now(),
          userId: "" as any,
        });
      }
    }
  }, [id, conversationId, setActiveChat, addChat, getChatById]);

  // Load messages from Convex
  useEffect(() => {
    if (messagesData !== undefined) {
      // Check if conversation was not found
      if (messagesData.notFound) {
        setConversationNotFound(true);
        setIsLoadingMessages(false);
        return;
      }

      // Valid conversation, load messages
      if (messagesData.messages) {
        const convexMessages: UIMessage[] = messagesData.messages.map(
          (msg) => ({
            id: msg._id,
            role: msg.role,
            parts: msg.parts as any, // Type mismatch due to convex schema
          })
        );

        if (convexMessages.length > 0) {
          setMessages(convexMessages);
        }
        setConversationNotFound(false);
      }
      setIsLoadingMessages(false);
    }
  }, [messagesData, setMessages]);

  useEffect(() => {
    if (
      id &&
      !hasProcessedPendingMessage &&
      status === "ready" &&
      messages.length === 0
    ) {
      const pendingMessageKey = `pendingMessage_${id}`;
      const pendingMessage = sessionStorage.getItem(pendingMessageKey);

      if (pendingMessage) {
        sendMessage({
          text: pendingMessage,
          metadata: { chatId: id },
        });
        sessionStorage.removeItem(pendingMessageKey);
        setHasProcessedPendingMessage(true);
      }
    }
  }, [id, hasProcessedPendingMessage, status, sendMessage, messages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && status === "ready" && id) {
      const userMessage = input.trim();

      // Update chat title with first message if it's the first user message
      if (messages.length === 0) {
        const title =
          userMessage.substring(0, 50) + (userMessage.length > 50 ? "..." : "");
        updateChatTitle(conversationId, title);

        // Also update in Convex
        try {
          await updateConversationMutation({
            conversationId,
            title,
          });
        } catch (error) {
          console.error("Failed to update conversation title:", error);
        }
      }

      // Send message to AI (will be saved to Convex in onFinish callback)
      sendMessage({
        text: userMessage,
        metadata: { chatId: id },
      });
      setInput("");
    }
  };

  // Show ChatNotFound if conversation doesn't exist
  if (conversationNotFound && !isLoadingMessages) {
    return <ChatNotFound id={id || ""} />;
  }

  // Scroll To bottom Behaviour
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (status == "ready")
      // || status == "") {}
      scrollToBottom();
  }, [messages, status]);

  // Highlight:=>

  const [_selection, setSelection] = useState<Selection | null>(null);
  const [selectedText, setSelectedText] = useState<string>("");
  const [selectedTextRect, setSelectedTextRect] = useState<DOMRect | null>(
    null
  );

  const textContainerRef = useRef<HTMLDivElement | null>(null);

  // Highlights Store
  // const { addHighlight, highlights } = useHighlightsStore();

  useEffect(() => {
    document.addEventListener("selectionchange", (e) => {
      const selection = document.getSelection();
      setSelection(selection);
      const selection_Text = selection?.toString() || "";
      if (selection_Text && selection) {
        const selection_TextRect =
          selection?.getRangeAt(0).getBoundingClientRect() ?? null;
        setSelectedText(selection_Text);
        setSelectedTextRect(selection_TextRect);

        return;
      }
      setSelectedText("");
      setSelectedTextRect(null);
    });
  }, [textContainerRef]);

  return (
    <div className="flex flex-col items-center-safe min-h-screen bg-gray-900 text-white">
      <div className="flex-1 overflow-y-auto p-6">
        <Conversation className="max-w-11/12 mx-auto">
          <ConversationContent>
            {messages.map((message, messageIndex) => {
              if (message.id.trim() === "") {
                message.id = uuidv7();
              }
              // Only consider streaming if it's the last message
              const isLastMessage = messageIndex === messages.length - 1;
              const isCurrentlyStreaming =
                status === "streaming" && isLastMessage;

              return (
                <Message from={message.role} key={message.id} className="mb-4">
                  <MessageContent className="bg-gray-800 p-3 rounded-lg">
                    {/* Reasoning Block: */}
                    {message.parts.map((part, index) =>
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

                    {/* Answer Block: */}
                    {message.parts.map((part, index) =>
                      part.type === "text" ? (
                        <span key={index} className="block">
                          {message.role === "assistant" && (
                            <>
                              <div
                                className="flex items-center gap-1 p-0.5 rounded-full bg-white/90 shadow-lg backdrop-blur-sm border border-gray-200"
                                style={{
                                  visibility: selectedTextRect
                                    ? "visible"
                                    : "hidden",
                                  position: "absolute",
                                  top: selectedTextRect
                                    ? `${
                                        selectedTextRect.top +
                                        window.scrollY -
                                        20
                                      }px`
                                    : "0px",
                                  left: selectedTextRect
                                    ? `${
                                        (selectedTextRect.left + selectedTextRect.width / 2 - 80)
                                        // selectedTextRect.left 
                                        // selectedTextRect.width / 2 -
                                        // 80
                                      }px`
                                    : "0px",
                                  opacity: selectedTextRect ? 1 : 0,
                                  transition: "opacity 0.3s ease",
                                  zIndex: 1000,
                                }}
                              >
                                {/* Highlight Button */}
                                <button
                                  type="button"
                                  className="p-1.5 rounded-full hover:bg-amber-100 transition-colors"
                                  aria-label="Highlight"
                                  onClick={() => {
                                    // console.log('clicked');
                                    // console.log(_selection);
                                    if (_selection && !_selection.isCollapsed) {
                                      // CSS Hightlight API :=> Does not Work Here
                                      // #1
                                      const range = _selection.getRangeAt(0);
                                      // const highlight = new Highlight(range);
                                      // CSS.highlights.set(
                                      //     "yellow-highlight", highlight)

                                      // #2
                                      // const highlightSpan = document.createElement("span");
                                      // highlightSpan.style.backgroundColor = "yellow";
                                      // range.surroundContents(highlightSpan);
                                    }
                                  }}
                                >
                                  <HighlighterIcon
                                    size={20}
                                    className="text-amber-600"
                                  />
                                </button>

                                {/* Share Button */}
                                <button
                                  type="button"
                                  className="p-1.5 rounded-full hover:bg-purple-100 transition-colors"
                                  aria-label="Share"
                                >
                                  <ShareIcon
                                    size={20}
                                    className="text-purple-600"
                                  />
                                </button>
                              </div>
                            </>
                          )}

                          <Response className="text-lg">
                            {/* Answer:=> */}
                            {part.text}
                          </Response>
                        </span>
                      ) : null
                    )}
                  </MessageContent>
                </Message>
              );
            })}
            <div ref={messagesEndRef} />
          </ConversationContent>
        </Conversation>
      </div>

      <div className="h-20"></div>

      <form className="flex gap-1 fixed bottom-2" onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={status !== "ready"}
          placeholder="Say something..."
          className="w-[600px] h-[70px] placeholder-white text-white border-2 bg-black/90 border-white px-4 rounded-l-lg focus:border-pink-400 focus:outline-none"
        />
        <button
          type="submit"
          className={`w-[70px] h-[70px] flex justify-center items-center ${
            status === "ready" ? "bg-blue-500" : "bg-red-500"
          }`}
          onClick={() => {
            if (status === "submitted" || status === "streaming") {
              stop();
            }
          }}
        >
          {status === "ready" ? (
            <div className="h-full flex items-center">Submit</div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="w-6 h-6 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></div>
            </div>
          )}
        </button>
      </form>
    </div>
  );
}
