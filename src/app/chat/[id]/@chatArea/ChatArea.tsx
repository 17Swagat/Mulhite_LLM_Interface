"use client";

import { UIMessage, useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
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
  ConversationScrollButton,
} from "@/components/ui/shadcn-io/ai/conversation";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/shadcn-io/ai/message";
import { useChatStore } from "@/stores/chatStore";
import {
  useQuery,
  useMutation,
  Authenticated,
  AuthLoading,
  useConvexAuth,
  useConvexConnectionState,
} from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import ChatNotFound from "./ChatNotFound";

import { ToolbarOnTextSelection } from "@/components/my/Toolbar/ToolbarOnTextSelection";
import { Highlight } from "@/lib/highlights";
import { HighlightedResponse } from "@/components/my/AIResponse/highlight/HighlightedResponse";
import { PromptInputField } from "@/components/my/PromptInputField";

import { AI_MODELS } from "@/constants/models";

// Sidebar Explain Chat
import { Sheet } from "@/components/ui/sheet";
import {
  HighlightedResponseWithExplain,
  ExplainSideChat as ExplainSideChatType,
} from "@/components/my/AIResponse/highlight/HighlightedResponseWithExplain";
import { ExplainSideChatContent } from "./ExplainSideChat";
import { ArrowDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChatArea({ id }: { id: string }) {
  const [input, setInput] = useState("");
  const [hasProcessedPendingMessage, setHasProcessedPendingMessage] =
    useState(false);

  // zustand store:
  const { setActiveChat, addChat, getChatById, updateChatTitle, chats } =
    useChatStore();

  // Convex queries and mutations
  const conversationId = id as Id<"conversations">;

  // Pagination state
  const [cursor, setCursor] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allMessagesLoaded, setAllMessagesLoaded] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [autoLoadAll, setAutoLoadAll] = useState(true);

  const messagesData = useQuery(
    api.conversations.getMessages,
    id ? { conversationId, cursor: cursor || undefined } : "skip"
  );

  const addMessageToConvex = useMutation(api.conversations.addMessage);
  const updateConversationMutation = useMutation(
    api.conversations.updateConversation
  );

  // Memoize transport to avoid recreating it on re-renders
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        // api: "/api/persist-chat",
        api: "/api/multi-model",
        body: { chatId: id },
      }),
    [id]
  );

  // AI SDK chat hook
  const {
    sendMessage,
    messages,
    status: chatStatus,
    stop,
    setMessages,
  } = useChat({
    id,
    transport,
    onFinish: async ({ message: finishedMessage, messages: allMessages }) => {
      if (!id) return;

      try {
        // Save both user and assistant messages to Convex
        // Get the last 2 messages (user message + assistant response)
        const lastTwoMessages = allMessages.slice(-2);

        // Track the mapping of AI SDK IDs to Convex IDs
        const idMapping: { aiSdkId: string; convexId: string }[] = [];

        for (const msg of lastTwoMessages) {
          // Check if message is already in Convex to avoid duplicates
          const result = await addMessageToConvex({
            conversationId: conversationId,
            role: msg.role as "user" | "assistant",
            parts: msg.parts.map((part: any) => ({
              type: part.type,
              text: part.text,
            })),
          });

          if (result && result._id) {
            idMapping.push({ aiSdkId: msg.id, convexId: result._id });
          }
        }

        // Update message IDs in the local state to use Convex IDs
        if (idMapping.length > 0) {
          setMessages((prevMessages) =>
            prevMessages.map((msg) => {
              const mapping = idMapping.find((m) => m.aiSdkId === msg.id);
              if (mapping) {
                return { ...msg, id: mapping.convexId };
              }
              return msg;
            })
          );
        }
      } catch (error: any) {
        console.error("Failed to save messages to Convex:", error);

        // Show user-friendly error if message limit reached
        if (error?.message?.includes("maximum limit")) {
          alert(error.message);
        }
      }
    },
  });

  // Model-Selection (initialize lazily once)
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    let model = AI_MODELS[0].id;
    if (typeof window !== "undefined") {
      const pendingMessageModelKey = `pendingMessage_Model_${id}`;
      const pendingMessageModel = sessionStorage.getItem(
        pendingMessageModelKey
      );
      if (pendingMessageModel) {
        model = pendingMessageModel;
        sessionStorage.removeItem(pendingMessageModelKey);
      }
    }
    return model;
  });

  // StickToBottom handles scrolling; avoid manual auto-scroll that hides the scroll button

  // User question submission handler:
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (chatStatus === "streaming") {
      stop();
      return;
    }

    if (input.trim() && chatStatus === "ready" && id) {
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
      sendMessage(
        {
          text: userMessage,
          metadata: { chatId: id },
        },
        {
          body: {
            model: selectedModel,
          },
        }
      );

      setInput("");
    }

    // Let StickToBottom manage scroll position to enable ConversationScrollButton
  };

  // Set this chat as active when component mounts and reset pagination
  useEffect(() => {
    if (id) {
      setActiveChat(conversationId);

      // Reset pagination state when switching conversations
      setCursor(null);
      setIsLoadingMore(false);
      setAllMessagesLoaded(false);
      setIsInitialLoad(true);
      setAutoLoadAll(true);

      // If chat doesn't exist in store, add it
      const existingChat = getChatById(conversationId);

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

  // Load messages from Convex with pagination support
  useEffect(() => {
    if (messagesData !== undefined) {
      // Check if conversation was not found
      if (messagesData.notFound) {
        return;
      }

      // Valid conversation, load messages
      if (messagesData.messages !== undefined) {
        const convexMessages: UIMessage[] = messagesData.messages.map(
          (msg) => ({
            id: msg._id,
            role: msg.role,
            parts: msg.parts as any, // Type mismatch due to convex schema
          })
        );

        if (cursor === null && isInitialLoad) {
          // Initial load - replace all messages
          if (convexMessages.length > 0) {
            setMessages(convexMessages);
          }
          setIsInitialLoad(false);
          // Check if there are more messages to load
          setAllMessagesLoaded(!messagesData.hasMore);
        } else if (cursor !== null) {
          // Loading more - prepend to existing messages (older messages go to top)
          if (convexMessages.length > 0) {
            setMessages((prev) => [...convexMessages, ...prev]);
          }
          setIsLoadingMore(false);
          setAllMessagesLoaded(!messagesData.hasMore);
        }
      }
    }
  }, [messagesData, setMessages, cursor]);

  // Handle loading more messages
  const handleLoadMoreMessages = useCallback(() => {
    if (messagesData?.nextCursor && !isLoadingMore && !allMessagesLoaded) {
      setIsLoadingMore(true);
      setCursor(messagesData.nextCursor);
    }
  }, [messagesData?.nextCursor, isLoadingMore, allMessagesLoaded]);

  // Auto-load older messages until all are fetched on initial mount
  useEffect(() => {
    if (!autoLoadAll) {
      return;
    }

    if (isInitialLoad) {
      return;
    }

    if (isLoadingMore) {
      return;
    }

    if (!messagesData?.hasMore || !messagesData?.nextCursor) {
      setAutoLoadAll(false);
      return;
    }

    handleLoadMoreMessages();
  }, [
    autoLoadAll,
    isInitialLoad,
    isLoadingMore,
    messagesData?.hasMore,
    messagesData?.nextCursor,
  ]);

  // Pending Messages
  useEffect(() => {
    // NOTE: `id`: Conversation ID
    if (
      id &&
      !hasProcessedPendingMessage &&
      chatStatus === "ready" &&
      messages.length === 0
    ) {
      const pendingMessageKey = `pendingMessage_${id}`;
      const pendingMessage = sessionStorage.getItem(pendingMessageKey);

      if (pendingMessage) {
        sendMessage(
          {
            text: pendingMessage,
            metadata: { chatId: id },
          },
          {
            body: {
              model: selectedModel,
            },
          }
        );
        sessionStorage.removeItem(pendingMessageKey);
        setHasProcessedPendingMessage(true);
      }
    }
  }, [
    id,
    hasProcessedPendingMessage,
    chatStatus,
    sendMessage,
    messages.length,
  ]);

  // Intersection observer for auto-loading older messages
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only set up observer if there are actually more messages to load
    if (!messagesData?.hasMore || isLoadingMore || allMessagesLoaded) {
      return;
    }

    const currentTrigger = loadMoreTriggerRef.current;
    if (!currentTrigger) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (
          entry.isIntersecting &&
          messagesData?.hasMore &&
          !isLoadingMore &&
          !allMessagesLoaded
        ) {
          handleLoadMoreMessages();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(currentTrigger);

    return () => {
      observer.unobserve(currentTrigger);
    };
  }, [
    allMessagesLoaded,
    isLoadingMore,
    messagesData?.hasMore,
    handleLoadMoreMessages,
  ]);

  /////////////////////////////////////////////////////////////////////////////////////////////////
  // [Handling Highlights]:===> [START]
  /////////////////////////////////////////////////////////////////////////////////////////////////
  const currentConversChatHighlights = useQuery(
    api.highlights_db.getHighlightsByConversation,
    id ? { conversationId } : "skip"
  );

  const createHighlightMutation = useMutation(
    api.highlights_db.createHighlight
  );
  const deleteHighlightMutation = useMutation(
    api.highlights_db.deleteHighlight
  );

  // Explain Side Chats
  const currentExplainSideChats = useQuery(
    api.explainSideChats.getExplainSideChatsByConversation,
    id ? { conversationId } : "skip"
  );

  const createExplainSideChatMutation = useMutation(
    api.explainSideChats.createExplainSideChat
  );

  const [explainSideChatsByMessage, setExplainSideChatsByMessage] = useState<
    Map<string, ExplainSideChatType[]>
  >(new Map());

  const [activeSideChatId, setActiveSideChatId] = useState<string | null>(null);
  const prevExplainKeysRef = useRef<string>("");

  useEffect(() => {
    if (!currentExplainSideChats) return;
    const newKey = currentExplainSideChats
      .map((e) => e._id)
      .sort()
      .join("|");

    if (newKey === prevExplainKeysRef.current) return;
    prevExplainKeysRef.current = newKey;

    const newMap = new Map<string, ExplainSideChatType[]>();
    for (const sideChat of currentExplainSideChats) {
      const messageId = sideChat.messageId;
      if (!newMap.has(messageId)) {
        newMap.set(messageId, []);
      }
      newMap.get(messageId)!.push(sideChat as ExplainSideChatType);
    }
    setExplainSideChatsByMessage(newMap);
  }, [currentExplainSideChats]);

  // Store highlights by message ID for quick lookup - use state instead of ref to trigger re-renders
  const [highlightsByMessage, setHighlightsByMessage] = useState<
    Map<string, Highlight[]>
  >(new Map());

  // Cache for stable empty arrays - prevent creating new [] on every render
  const emptyHighlightsArray = useRef<Highlight[]>([]);

  // Cache to store previous highlights and only update if they actually changed
  const prevHighlightsByMessageRef = useRef<Map<string, Highlight[]>>(
    new Map()
  );

  // Responsible for updating highlights when currentConversChatHighlights changes
  useEffect(() => {
    if (currentConversChatHighlights) {
      const newMap = new Map<string, Highlight[]>();

      // Group highlights by message ID
      // <messageId, Highlight[]>
      for (const highlight of currentConversChatHighlights) {
        const messageId = highlight.messageId;
        if (!newMap.has(messageId)) {
          newMap.set(messageId, []);
        }
        newMap.get(messageId)!.push(highlight);
      }

      // Only update state if highlights actually changed for any message
      let hasChanges = false;
      const prevMap = prevHighlightsByMessageRef.current;

      // Check if any message has different highlights
      if (newMap.size !== prevMap.size) {
        hasChanges = true;
      } else {
        for (const [messageId, newHighlights] of newMap.entries()) {
          const prevHighlights = prevMap.get(messageId);
          if (
            !prevHighlights ||
            prevHighlights.length !== newHighlights.length
          ) {
            hasChanges = true;
            break;
          }
          // Compare highlight IDs
          const newIds = newHighlights
            .map((h) => h._id)
            .sort()
            .join(",");
          const prevIds = prevHighlights
            .map((h) => h._id)
            .sort()
            .join(",");
          if (newIds !== prevIds) {
            hasChanges = true;
            break;
          }
        }
      }

      if (hasChanges) {
        prevHighlightsByMessageRef.current = newMap;
        setHighlightsByMessage(newMap);
      }
    }
  }, [currentConversChatHighlights]);

  // Text selection handling:
  const [_selection, setSelection] = useState<Selection | null>(null);
  const [selectedTextRect, setSelectedTextRect] = useState<DOMRect | null>(
    null
  );
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  // Adding Event Listener for text selection changes
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

    document.addEventListener("selectionchange", handleSelectionChange, {
      passive: true,
    });

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  // Handle highlight creation
  const handleHighlight = useCallback(
    async (selection: Selection, color: string = "yellow") => {
      if (!selectedMessageId || !id) return;

      // Check if the message ID is a valid Convex ID (not AI SDK ID)
      // Convex IDs are longer (typically 24+ chars) and contain specific patterns
      // AI SDK IDs are shorter (typically 16 chars)
      if (selectedMessageId.length < 20) {
        console.warn(
          "Cannot highlight: Message not yet saved to database. Please wait a moment and try again."
        );
        // Clear selection
        selection.removeAllRanges();
        setSelection(null);
        setSelectedTextRect(null);
        setSelectedMessageId(null);
        return;
      }

      const selectedText = selection.toString().trim();
      if (!selectedText) return;

      const range = selection.getRangeAt(0);

      // Get the message container
      const messageContainer =
        range.commonAncestorContainer.parentElement?.closest(
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

      // console.log(treeWalker.nextNode());
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
      const currentHighlights =
        highlightsByMessage.get(selectedMessageId) || [];
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
    },
    [
      selectedMessageId,
      id,
      conversationId,
      highlightsByMessage,
      createHighlightMutation,
    ]
  );

  const handleDeleteHighlight = useCallback(
    async (highlightId: string) => {
      try {
        await deleteHighlightMutation({
          highlightId: highlightId as Id<"highlights">,
        });
        // Remove from local map - update will come from highlightsData reactively
        // No need to manually update state here as the useEffect will handle it
      } catch (error) {
        console.error("Failed to delete highlight:", error);
      }
    },
    [deleteHighlightMutation]
  );

  // Handle opening an explain side-chat when clicking on highlighted explain text
  const handleOpenExplainSideChat = useCallback((sideChatId: string) => {
    setActiveSideChatId(sideChatId);
    setOpenExplainSidebar(true);
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////////////////
  // [Handling Highlights]:===> [END]
  ///////////////////////////////////////////////////////////////////////////////

  // Memoize rendered message list to avoid recomputing on unrelated state changes
  const renderedMessages = useMemo(() => {
    return (
      <>
        {messages.map((message, messageIndex) => {
          if (message.id.trim() === "") {
            message.id = uuidv7();
          }
          // Only consider streaming if it's the last message
          const isLastMessage = messageIndex === messages.length - 1;
          const isCurrentlyStreaming =
            chatStatus === "streaming" && isLastMessage;

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

                  // Only use <HighlightedResponseWithExplain> for assistant messages
                  if (message.role === "assistant") {
                    // Get highlights for this message - use stable empty array reference
                    const messageHighlights =
                      highlightsByMessage.get(message.id) ||
                      emptyHighlightsArray.current;

                    // Get explain side chats for this message
                    const messageExplainChats =
                      explainSideChatsByMessage.get(message.id) || [];

                    return (
                      <div key={index + message.id}>
                        {/* Answer with highlights and explain chats */}
                        <HighlightedResponseWithExplain
                          text={part.text || ""}
                          highlights={messageHighlights}
                          explainSideChats={messageExplainChats}
                          messageId={message.id}
                          className="text-lg"
                          onDeleteHighlight={handleDeleteHighlight}
                          onOpenExplainSideChat={handleOpenExplainSideChat}
                        />
                      </div>
                    );
                  } else {
                    // User messages: Render without highlight support
                    return (
                      <Response key={index + message.id} className="text-lg">
                        {part.text || ""}
                      </Response>
                    );
                  }
                })}
              </MessageContent>
              <MessageAvatar
                name={message.role}
                src={
                  message.role == "assistant"
                    ? "/ai-models/grok.svg"
                    : "/user.png"
                }
                className="bg-white"
              />
            </Message>
          );
        })}

        <div className="h-[100px]"></div>
        {/* <div ref={messagesEndRef} /> */}
      </>
    );
  }, [
    messages,
    chatStatus,
    highlightsByMessage,
    explainSideChatsByMessage,
    handleDeleteHighlight,
    handleOpenExplainSideChat,
  ]);

  // Explain Sheet Sidebar
  const [openExplainSidebar, setOpenExplainSidebar] = useState<boolean>(false);
  const handleExplainSelectedText = useCallback(async () => {
    if (!_selection || !selectedMessageId || !id) return;
    if (selectedMessageId.length < 20) return;

    const selectedText = _selection.toString().trim();
    if (!selectedText) return;

    const range = _selection.getRangeAt(0).cloneRange();
    const messageContainer =
      range.commonAncestorContainer.parentElement?.closest(
        "[data-message-text]"
      );
    if (!messageContainer) return;

    const treeWalker = document.createTreeWalker(
      messageContainer,
      NodeFilter.SHOW_TEXT
    );
    let currentOffset = 0;
    let startOffset = -1;
    let endOffset = -1;
    let node: Node | null;

    while ((node = treeWalker.nextNode())) {
      const len = (node.textContent || "").length;
      if (startOffset === -1 && node === range.startContainer) {
        startOffset = currentOffset + range.startOffset;
      }
      if (node === range.endContainer) {
        endOffset = currentOffset + range.endOffset;
        break;
      }
      currentOffset += len;
    }

    if (startOffset === -1 || endOffset === -1) {
      const text = messageContainer.textContent || "";
      startOffset = text.indexOf(selectedText);
      if (startOffset === -1) return;
      endOffset = startOffset + selectedText.length;
    }

    _selection.removeAllRanges();
    setSelection(null);
    setSelectedTextRect(null);

    const sideChatId = await createExplainSideChatMutation({
      messageId: selectedMessageId as Id<"messages">,
      conversationId: conversationId,
      startOffset,
      endOffset,
      selectedText,
      highlightColor: "blue",
    });

    const newMap = new Map(explainSideChatsByMessage);
    newMap.set(selectedMessageId, [
      ...(newMap.get(selectedMessageId) || []),
      {
        _id: sideChatId,
        messageId: selectedMessageId,
        conversationId,
        userId: "" as any,
        startOffset,
        endOffset,
        selectedText,
        highlightColor: "blue",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ]);
    setExplainSideChatsByMessage(newMap);

    sessionStorage.setItem(
      `pendingExplainMessage_${sideChatId}`,
      `Explain "${selectedText}" based on the current conversation.`
    );
    sessionStorage.setItem(`pendingExplainModel_${sideChatId}`, selectedModel);

    setActiveSideChatId(sideChatId);
    setOpenExplainSidebar(true);
  }, [
    _selection,
    selectedMessageId,
    id,
    conversationId,
    explainSideChatsByMessage,
    selectedModel,
    createExplainSideChatMutation,
  ]);

  // <ChatNotFound>:=>
  const conversationExists = useQuery(
    api.conversations.isConversationOwnedByUser,
    {
      conversationId: id || "",
    }
  );
  if (conversationExists === false) {
    // Conversation does not exist or not owned by user
    return <ChatNotFound id={id || ""} />;
  }

  return (
    <>
      <Authenticated>
        <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
          <Sheet open={openExplainSidebar} onOpenChange={setOpenExplainSidebar}>
            <ToolbarOnTextSelection
              _selection={_selection}
              selectedTextRect={selectedTextRect}
              onHighlight={handleHighlight}
              onExplain={handleExplainSelectedText}
            />

            <Conversation className="bg-linear-to-r from-[#374151] via-[#f43f5e] to-[#fb923c] overflow-y-hidden">
              {/* <ConversationContent className="w-[50%] lg:w-[70%] xl:w-[70%] mx-auto overflow-y-auto px-4 py-6 relative"> */}
              <ConversationContent className="flex flex-col items-center place-content-center w-[70%] mx-auto overflow-y-auto  py-6 relative">
                {renderedMessages}
              </ConversationContent>
              <ConversationScrollButton className="bottom-35 bg-gray-800/55 border-0 hover:bg-gray-500 hover:text-white z-20" />

              {/* Input Field: */}
              <div className="w-[50%] lg:w-[70%] xl:w-[50%] sticky bottom-1 mx-auto rounded-2xl py-1 px-1 md:px-2 bg-linear-to-r from-blue-500 via-green-400 to-purple-500 shadow-md">
                <PromptInputField
                  selectedModel={selectedModel}
                  setSelectedModelFunc={setSelectedModel}
                  handleSubmit={handleSubmit}
                  input={input}
                  setInput={setInput}
                  chatStatus={chatStatus}
                  inConversation={true}
                />
              </div>
            </Conversation>

            {activeSideChatId && (
              <ExplainSideChatContent
                sideChatId={activeSideChatId}
                onClose={() => setOpenExplainSidebar(false)}
                parentConversationId={id}
                parentMessages={messages}
              />
            )}
          </Sheet>
        </div>
      </Authenticated>
      <AuthLoading>
        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-purple-700/40 via-pink-600/80 to-red-800/90">
          <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-white ml-4"></div>
        </div>
      </AuthLoading>
    </>
  );
}
