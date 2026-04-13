"use client";

import { CreditsLeft } from "@/components/my/CreditsLeft";
import { UIMessage, useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Response } from "@/components/ui/shadcn-io/ai/response";
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
} from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import ChatNotFound from "./ChatNotFound";

import { ToolbarOnTextSelection } from "@/components/my/Toolbar/ToolbarOnTextSelection";
import { Highlight } from "@/ctypes/highlights";

import { PromptInputField } from "@/components/my/PromptInputField";

import { Sheet } from "@/components/ui/sheet";
import {
  HighlightedResponseWithExplain,
  ExplainSideChat as ExplainSideChatType,
} from "@/components/my/AIResponse/HighlightedResponseWithExplain";
import { ExplainSideChatContent } from "./ExplainSideChat";
import { LoadingScreen } from "@/components/my/LoadingScreen";
import { useSelectedAIModelStore } from "@/stores/modelSelectionStore";
import { useUserQuestionStore } from "@/stores/userQuestionStore";
import { useVercelAICreditsLeft } from "@/stores/aiprovidersCreditsStore";
import { useAboutDeviceInfo } from "@/stores/aboutDevice";
import { isDeviceTouch } from "@/utils/clientfuncs/isDeviceTouch";
import { TokensConsumed } from "@/components/my/TokensConsumed";
import { APIKeys } from "@/components/my/APIKeys";

// For Error Dialog:
import {
  AlertDialog,
  AlertDialogAction,
  // AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  // AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAPIVercelGateway } from "@/stores/aiprovidersKeyStore";
import { Loader } from "@/components/ui/shadcn-io/ai/loader";

export default function ChatArea({
  id,
  availableModels,
}: {
  id: string;
  availableModels: any[];
}) {
  // const [input, setInput] = useState("");
  const [hasProcessedPendingMessage, setHasProcessedPendingMessage] =
    useState(false);

  // zustand store:
  const { setActiveChat, addChat, getChatById, updateChatTitle, chats } =
    useChatStore();

  const { question, setQuestion } = useUserQuestionStore();

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
  // const transport = useMemo(
  //   () =>
  //     new DefaultChatTransport({
  //       api: "/api/multi-model",
  //       body: { chatId: id },
  //     }),
  //   [id]
  // );
  // AI SDK chat hook
  const { vercelAIGatewayAPIKey, hydrated } = useAPIVercelGateway();
  // 💵💵
  // Vercel-Credits-Left:
  const { vercelAiGatewayCredits, setVercelAiGatewayCredits } =
    useVercelAICreditsLeft();
  useEffect(() => {
    if (!hydrated) return;
    setVercelAiGatewayCredits();
  }, [vercelAIGatewayAPIKey]);

  const { parentChatModel } = useSelectedAIModelStore();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const {
    sendMessage,
    messages,
    status: chatStatus,
    stop,
    setMessages,
    error,
    clearError,
  } = useChat({
    id,
    // transport,
    transport: new DefaultChatTransport({
      api: "/api/multi-model",
      body: { chatId: id },
    }),
    onFinish: async ({
      message: finishedMessage,
      messages: allMessages,
      isError,
    }) => {
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
            ai_model:
              msg.role === "user"
                ? undefined
                : ((msg.metadata as any)?.model as string | undefined),
            role: msg.role as "user" | "assistant",
            parts: msg.parts.map((part: any) => ({
              type: part.type,
              text: part.text,
            })),
            totalTokens: (msg.metadata as any)?.totalTokens,
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
        console.error("Failed to save messages to Database:", error); // convex

        // Show user-friendly error if message limit reached
        if (error?.message?.includes("maximum limit")) {
          alert(error.message);
        }
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

  // User question submission handler:
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (chatStatus === "streaming") {
      stop();
      return;
    }

    // Validate API key before attempting to send message
    // NOTE:
    /*if (!vercelAIGatewayAPIKey || vercelAIGatewayAPIKey.trim() === "") {
      setErrorMsg(
        "API Key is missing or has been removed. Please add your Vercel AI Gateway API Key to continue."
      );
      setError(true);
      return;
    }*/

    if (question.trim() && chatStatus === "ready" && id) {
      const userMessage = question.trim();

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

      // NOTE: useChat automatically sends all messages in the conversation for context
      // This is necessary for coherent responses but increases cost with each message
      // To reduce costs, consider implementing a context window limit (e.g., last 20 messages)
      sendMessage(
        // Send message to AI (will be saved to Convex in onFinish callback)
        {
          text: userMessage,
          metadata: { chatId: id },
        },
        {
          body: {
            model: parentChatModel,
            apiKey: vercelAIGatewayAPIKey,
          },
        }
      );

      // setInput("");
      setQuestion("");
    }
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
            metadata: { model: msg.ai_model, totalTokens: msg.totalTokens },
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
        // Validate API key before sending pending message
        /*if (!vercelAIGatewayAPIKey || vercelAIGatewayAPIKey.trim() === "") {
          console.warn(
            "Cannot send pending message: API Key is missing or has been removed."
          );
          sessionStorage.removeItem(pendingMessageKey);
          setHasProcessedPendingMessage(true);
          return;
        }*/

        sendMessage(
          {
            text: pendingMessage,
            metadata: { chatId: id },
          },
          {
            body: {
              model: parentChatModel,
              apiKey: vercelAIGatewayAPIKey,
              // reasoningOn: reasoningOn,
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
    vercelAIGatewayAPIKey,
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

  const { isTouchDevice, setIsTouchDevice } = useAboutDeviceInfo();
  useEffect(() => {
    // Check if device supports touch (runs once on mount)
    setIsTouchDevice(isDeviceTouch());
  }, []);

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
          // Compare highlight IDs using Set for faster comparison
          const newIdSet = new Set(newHighlights.map((h) => h._id));
          const prevIdSet = new Set(prevHighlights.map((h) => h._id));
          if (
            newIdSet.size !== prevIdSet.size ||
            !Array.from(newIdSet).every((id) => prevIdSet.has(id))
          ) {
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

  // [Text-Selection Event]
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
        // createdAt: Date.now(),
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

  /////////////////////////////////////////////////////////////////////////////////////////////////
  // [Handling Highlights]:===> [END]
  ///////////////////////////////////////////////////////////////////////////////

  // Handle opening an explain side-chat when clicking on highlighted explain text
  const handleOpenExplainSideChat = useCallback((sideChatId: string) => {
    setActiveSideChatId(sideChatId);
    setOpenExplainSidebar(true);
  }, []);

  // Memoize rendered message list to avoid recomputing on unrelated state changes
  const renderedMessages = useMemo(() => {
    return (
      <>
        {messages.map((message, messageIndex) => {
          let avatar_logo: string = "/ai-models/claude.svg";
          if (message.role === "assistant" && message.metadata) {
            const model = (message.metadata as any).model; // NOTE: TYPE-Error
            if (model) {
              if (model.includes("mistral")) {
                avatar_logo = "/ai-models/mistral.svg";
              } else if (model.includes("deepseek")) {
                avatar_logo = "/ai-models/deepseek.svg";
              } else if (model.includes("openai")) {
                avatar_logo = "/ai-models/openai_2.svg";
              } else if (model.includes("gemini")) {
                avatar_logo = "/ai-models/gemini.svg";
              }
            }
          }

          // Retrive-> [Cost of the Answer]
          const totalTokens = (message.metadata as any).totalTokens;

          // Only consider streaming if it's the last message
          const isLastMessage = messageIndex === messages.length - 1;
          const isCurrentlyStreaming =
            chatStatus === "streaming" && isLastMessage;

          return (
            <Message from={message.role} key={message.id} className="mb-2 md:mb-4 dark">
              <MessageContent className="bg-slate-800/60 border border-white/[0.04] p-2 md:p-3 rounded-xl">
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
                        <ReasoningContent className="bg-amber-900/40 border border-amber-700/20 text-slate-200 p-3 rounded-lg">
                          {part.text}
                        </ReasoningContent>
                      </Reasoning>

                      {/* Loading - Only show during reasoning streaming */}
                      {chatStatus === "streaming" &&
                        isLastMessage &&
                        part.type === "reasoning" &&
                        part.state === "streaming" &&
                        !message.parts.some(
                          (p: any) =>
                            p.type === "text" &&
                            ((p.text && p.text.length > 0) ||
                              p.state === "streaming")
                        ) && (
                            <div className="flex items-center gap-2 p-4">
                              <Loader size={20} className="text-indigo-400" />
                              <span className="text-sm text-indigo-300">
                              Thinking..
                            </span>
                          </div>
                        )}
                    </div>
                  ) : null
                )}

                {/* Answer Block: */}
                {message.parts.map((part, index) => {
                  if (part.type !== "text") return null;

                  // Only use <HighlightedResponseWithExplain> for assistant messages
                  if (message.role === "assistant") {
                    // Get highlights for this message
                    const messageHighlights =
                      highlightsByMessage.get(message.id) || [];

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

                        {/* Loading  */}
                        {chatStatus === "streaming" &&
                          isLastMessage &&
                          part.type === "text" &&
                          part.state === "streaming" && (
                            <div className="flex items-center gap-2 p-4">
                              <Loader size={20} className="text-emerald-400" />
                              <span className="text-sm text-emerald-300">
                                Generating Response...
                              </span>
                            </div>
                          )}

                        {/* Answer-Token-Consumption */}
                        {totalTokens !== undefined && (
                          <TokensConsumed
                            totalTokensConsumed={totalTokens}
                            isTouchDevice={isTouchDevice}
                          />
                        )}

                        <div className="hidden">{}</div>
                      </div>
                    );
                  } else {
                    // 👤 [USER's QUESTION]: "Render without highlight support"
                    return (
                      <Response key={index + message.id} className="text-lg">
                        {part.text || ""}
                      </Response>
                    );
                  }
                })}
              </MessageContent>

              {/* Avatar */}
              <MessageAvatar
                name={message.role}
                src={message.role == "assistant" ? avatar_logo : "/user.png"}
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
        // createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ]);
    setExplainSideChatsByMessage(newMap);

    sessionStorage.setItem(
      `pendingExplainMessage_${sideChatId}`,
      `Explain "${selectedText}" based on the current conversation.`
    );

    setActiveSideChatId(sideChatId);
    setOpenExplainSidebar(true);
  }, [
    _selection,
    selectedMessageId,
    id,
    conversationId,
    explainSideChatsByMessage,
    // selectedModel,
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
    return <ChatNotFound id={id || ""} />;
  }

  return (
    <>
      <Authenticated>
        {/* <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden"> */}
        <div className="flex flex-col h-dvh bg-[#0f1117] text-white overflow-hidden">
          <Sheet open={openExplainSidebar} onOpenChange={setOpenExplainSidebar}>
            <ToolbarOnTextSelection
              availableModels={availableModels}
              _selection={_selection}
              selectedTextRect={selectedTextRect}
              onHighlight={handleHighlight}
              onExplain={handleExplainSelectedText}
            />

            {/* Error: Alert */}
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

            <Conversation
              className={`bg-[#0f1117] overflow-hidden`}

        // style={{
        //   background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
        // }}
              // className={`bg-[#302f2f] overflow-hidden`}
          // bg-linear-to-r from-gray-800 via-purple-900 to-pink-900 overflow-y-hidden`}
            >
              {/* TODO: "Not sure why but the scroll-bar design is not taking place." */}
              <ConversationContent
                // className="laptop:mx-auto laptop:w-[50%] bg-amber-300 "
                className="laptop:mx-auto pt-12  laptop:w-[1200px] h-full"
                // className={`flex flex-col items-end place-content-center w-[70%] mx-auto overflow-y-auto  py-6 relative`}
              >
                {renderedMessages}
              </ConversationContent>
              <ConversationScrollButton className="bottom-35 bg-slate-800/90 backdrop-blur-sm text-slate-200 border border-white/10 hover:bg-slate-700/90 z-20" />

              {/* Credits Left */}
              <div className="fixed top-0 right-1 lg:right-8 flex gap-2 items-center">
                <CreditsLeft
                  credits={vercelAiGatewayCredits}
                  isTouchDevice={isTouchDevice}
                />

                <APIKeys />
              </div>

              {/* User-Input */}
              <div
                className="
              sticky bottom-0  px-2  lg:py-0.5 w-full flex  
                place-content-center "
              >
                <PromptInputField
                  availableModels={availableModels}
                  handleSubmit={handleSubmit}
                  chatStatus={chatStatus}
                  inConversation={true}
                />
              </div>
            </Conversation>

            {/* Explain-SideChat */}
            {activeSideChatId && (
              <ExplainSideChatContent
                availableModels={availableModels}
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
        <LoadingScreen />
      </AuthLoading>
    </>
  );
}
