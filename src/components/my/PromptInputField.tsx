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
import type { ChatStatus } from "ai";

// Hooks:=>
import { useState } from "react";

const MODELS = [
  { id: "ollama-deepseek", name: "Ollama DeepSeek" },
  { id: "Gemeni", name: "Gemeni Flash Lite 2025" },
];

export function PromptInputField({
  handleSubmit,
  input,
  setInput,
  chatStatus,
  inConversation = false,
}: {
  handleSubmit: (e: React.FormEvent) => void;
  input: string;
  setInput: (value: string) => void;
  chatStatus: ChatStatus;
  inConversation?: boolean;
}) {
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);

  return (
    <PromptInput onSubmit={handleSubmit}>
      <PromptInputTextarea
        value={input}
        onChange={(e) => setInput(e.currentTarget.value)}
        disabled={chatStatus === "streaming"}
        placeholder="What do you want to learn about?"
      />
      <PromptInputToolbar>
        <PromptInputTools>
          {/* #1 */}
          {/* <PromptInputButton>
            <PaperclipIcon size={16} />
          </PromptInputButton> */}
          {/* #2 */}
          {/* <PromptInputButton>
            <MicIcon size={16} />
            <span>Voice</span>
          </PromptInputButton> */}
          <PromptInputModelSelect
            value={selectedModel}
            onValueChange={setSelectedModel}
          >
            <PromptInputModelSelectTrigger>
              <PromptInputModelSelectValue />
            </PromptInputModelSelectTrigger>
            <PromptInputModelSelectContent>
              {MODELS.map((model) => (
                <PromptInputModelSelectItem key={model.id} value={model.id}>
                  {model.name}
                </PromptInputModelSelectItem>
              ))}
            </PromptInputModelSelectContent>
          </PromptInputModelSelect>
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
}
