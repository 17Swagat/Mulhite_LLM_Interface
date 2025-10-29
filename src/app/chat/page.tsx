"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useChatStore } from "@/stores/chatStore";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
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
import { MicIcon, PaperclipIcon } from "lucide-react";
import { PromptInputField } from "@/components/my/PromptInputField";
import { AI_MODELS } from "@/constants/models";

export default function ChatPage() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addChat, setActiveChat } = useChatStore();

  // Convex mutation
  const createConversation = useMutation(api.conversations.createConversation);

  // Clear active chat when landing on /chat page
  useEffect(() => {
    setActiveChat(null);
  }, [setActiveChat]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isSubmitting) {
      setIsSubmitting(true);

      try {
        // Create conversation in Convex
        const title = input.substring(0, 50) + (input.length > 50 ? "..." : "");
        const result = await createConversation({ title });
        const conversationId = result._id;
        const now = Date.now();
        // Add the new chat to Zustand store
        addChat({
          _id: conversationId,
          title,
          createdAt: now,
          updatedAt: now,
          userId: "" as Id<"users">,
        });
        // Set as active chat
        setActiveChat(conversationId);
        // Store the initial message in sessionStorage with the conversation ID as key
        sessionStorage.setItem(`pendingMessage_${conversationId}`, input);

        // Navigate to the chat page with the new ID
        router.push(`/chat/${conversationId}`);

        setInput("");
      } catch (error) {
        console.error("Error creating chat:", error);
        alert("Failed to create chat. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  //   const models = [
  //     { id: "ollama-deepseek", name: "Ollama DeepSeek" },
  //     { id: "Gemeni", name: "Gemeni Flash Lite 2025" },
  //   ];
  //   const [selectedModel, setSelectedModel] = useState(models[0].id);

  return (
    <div className="w-full h-screen bg-purple-700/80 text-white flex justify-center items-center">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl mb-2 font-semibold">Let's Start Learning 😊</h1>

        <div className="md:w-2xl max-w-3xl mx-auto py-2 px-1 md:px-2 bg-linear-to-r from-blue-500 via-green-400 to-purple-500 shadow-md rounded-2xl">
          {/* <PromptInput onSubmit={handleSubmit}>
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              disabled={isSubmitting}
              placeholder="What do you want to learn about?"
            />
            <PromptInputToolbar>
              <PromptInputTools>
                <PromptInputButton>
                  <PaperclipIcon size={16} />
                </PromptInputButton>
                <PromptInputButton>
                  <MicIcon size={16} />
                  <span>Voice</span>
                </PromptInputButton>
                <PromptInputModelSelect
                  value={selectedModel}
                  onValueChange={setSelectedModel}
                >
                  <PromptInputModelSelectTrigger>
                    <PromptInputModelSelectValue />
                  </PromptInputModelSelectTrigger>
                  <PromptInputModelSelectContent>
                    {models.map((model) => (
                      <PromptInputModelSelectItem
                        key={model.id}
                        value={model.id}
                      >
                        {model.name}
                      </PromptInputModelSelectItem>
                    ))}
                  </PromptInputModelSelectContent>
                </PromptInputModelSelect>
              </PromptInputTools>
              <PromptInputSubmit
                disabled={isSubmitting || !input.trim()}
                status={isSubmitting ? "streaming" : "ready"}
              />
            </PromptInputToolbar>
          </PromptInput> */}

          <PromptInputField
            AI_MODESLS={AI_MODELS}
            handleSubmit={handleSubmit}
            input={input}
            setInput={setInput}
            chatStatus={"ready"}
          />
        </div>
      </div>
    </div>
  );
}
