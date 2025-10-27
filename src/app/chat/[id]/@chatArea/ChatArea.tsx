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
import { ToolbarOnTextHighlight } from "@/components/my/ToolbarOnTextSelection";
import { getTextOffsetFromSelection, Highlight } from "@/lib/highlights";
import { HighlightedResponse } from "@/components/my/HighlightedResponse";

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

  // Highlights
  const highlightsData = useQuery(
    api.highlights.getHighlightsByConversation,
    id ? { conversationId } : "skip"
  );
  const createHighlightMutation = useMutation(api.highlights.createHighlight);
  const deleteHighlightMutation = useMutation(api.highlights.deleteHighlight);

  // Store highlights by message ID for quick lookup - use state instead of ref to trigger re-renders
  const [highlightsByMessage, setHighlightsByMessage] = useState<Map<string, Highlight[]>>(new Map());

  useEffect(() => {
    if (highlightsData) {
      const map = new Map<string, Highlight[]>();
      for (const highlight of highlightsData) {
        const messageId = highlight.messageId;
        if (!map.has(messageId)) {
          map.set(messageId, []);
        }
        map.get(messageId)!.push(highlight);
      }
      setHighlightsByMessage(map);
    }
  }, [highlightsData]);

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
  const [selectedTextRect, setSelectedTextRect] = useState<DOMRect | null>(
    null
  );
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = document.getSelection();
      const selectionText = selection?.toString() || "";

      if (selectionText && selection && selection.rangeCount > 0) {
        // Check if selection is within an assistant message
        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;
        const element =
          container.nodeType === Node.TEXT_NODE
            ? container.parentElement
            : (container as Element);

        // Check if the selection is within an assistant message
        const messageElement = element?.closest("[data-assistant-message]");

        if (messageElement) {
          const messageId = messageElement.getAttribute("data-message-id");
          setSelection(selection);
          setSelectedTextRect(range.getBoundingClientRect());
          setSelectedMessageId(messageId);
          return;
        }
      }

      // Clear selection if not in assistant message or no text selected
      setSelection(null);
      setSelectedTextRect(null);
      setSelectedMessageId(null);
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  // Handle highlight creation
  const handleHighlight = async (selection: Selection, color: string = "yellow") => {
    if (!selectedMessageId || !id) return;

    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    const range = selection.getRangeAt(0);

    // Get the message container
    const messageContainer = range.commonAncestorContainer.parentElement?.closest(
      "[data-message-text]"
    );

    if (!messageContainer) {
      console.error("Could not find message container");
      return;
    }

    // Calculate offset by traversing text nodes from the container
    const treeWalker = document.createTreeWalker(
      messageContainer,
      NodeFilter.SHOW_TEXT
    );

    let currentOffset = 0;
    let startOffset = -1;
    let endOffset = -1;
    let node: Node | null;

    while ((node = treeWalker.nextNode())) {
      const nodeText = node.textContent || "";
      const nodeLength = nodeText.length;

      // Check if this text node contains the range start
      if (startOffset === -1 && node === range.startContainer) {
        startOffset = currentOffset + range.startOffset;
      }

      // Check if this text node contains the range end
      if (node === range.endContainer) {
        endOffset = currentOffset + range.endOffset;
        break;
      }

      currentOffset += nodeLength;
    }

    // If we couldn't find offsets, try fallback method
    if (startOffset === -1 || endOffset === -1) {
      // Fallback: use indexOf with normalized text
      const renderedText = messageContainer.textContent || "";
      const normalizedSelected = selectedText.replace(/\s+/g, " ");
      const normalizedRendered = renderedText.replace(/\s+/g, " ");
      
      startOffset = normalizedRendered.indexOf(normalizedSelected);
      
      if (startOffset === -1) {
        console.error("Could not find selected text in rendered content");
        console.log("Selected:", selectedText);
        console.log("Rendered:", renderedText.substring(0, 200));
        return;
      }
      
      endOffset = startOffset + normalizedSelected.length;
    }

    // Clear selection immediately for better UX
    selection.removeAllRanges();
    setSelection(null);
    setSelectedTextRect(null);

    // Optimistically update local state before database save
    const tempHighlight: Highlight = {
      _id: `temp-${Date.now()}` as any,
      messageId: selectedMessageId as Id<"messages">,
      conversationId: conversationId,
      userId: "" as any,
      startOffset: startOffset,
      endOffset: endOffset,
      text: selectedText,
      color: color,
      createdAt: Date.now(),
    };
  
    // Update local highlights map immediately for optimistic UI
    const currentHighlights = highlightsByMessage.get(selectedMessageId) || [];
    const newMap = new Map(highlightsByMessage);
    newMap.set(selectedMessageId, [...currentHighlights, tempHighlight]);
    setHighlightsByMessage(newMap);

    try {
      // Save to database in background
      await createHighlightMutation({
        messageId: selectedMessageId as Id<"messages">,
        conversationId: conversationId,
        startOffset: startOffset,
        endOffset: endOffset,
        text: selectedText,
        color: color,
      });
    } catch (error) {
      console.error("Failed to create highlight:", error);
      // Rollback on error
      const rollbackMap = new Map(highlightsByMessage);
      rollbackMap.set(selectedMessageId, currentHighlights);
      setHighlightsByMessage(rollbackMap);
    }
  };

  const handleDeleteHighlight = async (highlightId: string) => {
    try {
      await deleteHighlightMutation({ highlightId: highlightId as Id<"highlights"> });
      
      // Remove from local map - update will come from highlightsData reactively
      // No need to manually update state here as the useEffect will handle it
    } catch (error) {
      console.error("Failed to delete highlight:", error);
    }
  };

  return (
    <div className="flex flex-col items-center-safe min-h-screen bg-gray-900 text-white">
      {/* Toolbar - render once at the top level */}
      <ToolbarOnTextHighlight
        _selection={_selection}
        selectedTextRect={selectedTextRect}
        onHighlight={handleHighlight}
      />

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
                    {message.parts.map((part, index) => {
                      if (part.type !== "text") return null;

                      // Only use HighlightedResponse for assistant messages
                      if (message.role === "assistant") {
                        // Get highlights for this message
                        const messageHighlights = highlightsByMessage.get(message.id) || [];

                        return (
                          <div key={index}>
                            {/* Answer with highlights */}
                            <HighlightedResponse
                              text={part.text || ""}
                              highlights={messageHighlights}
                              messageId={message.id}
                              className="text-lg"
                              onDeleteHighlight={handleDeleteHighlight}
                            />
                          </div>
                        );
                      } else {
                        // User messages: render without highlight support
                        return (
                          <div key={index} className="text-lg">
                            <Response>{part.text || ""}</Response>
                          </div>
                        );
                      }
                    })}
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
