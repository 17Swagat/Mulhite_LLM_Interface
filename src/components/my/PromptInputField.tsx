"use client";

import { PaperclipIcon, MicIcon } from "lucide-react";
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
import { useState } from "react";

export type Model = {
  id: string;
  name: string;
};

export interface NewChatPromptInputProps {
  /** Called when the user presses Enter / clicks the submit button */
  onSubmit: (e: React.FormEvent) => void;
  /** Current textarea value */
  input: string;
  /** Called when the textarea changes */
  onInputChange: (value: string) => void;
  /** Whether a request is in-flight */
  isSubmitting: boolean;
  /** List of available models */
  models?: Model[];
  /** Currently selected model id */
  selectedModel?: string;
  /** Called when the model selection changes */
  onModelChange?: (modelId: string) => void;
}

/**
 * Re-usable “new-chat” prompt input.
 * It contains:
 *  • textarea
 *  • file + voice buttons
 *  • model selector
 *  • submit button
 */
export function NewChatPromptInput({
  onSubmit,
  input,
  onInputChange,
  isSubmitting,
  models = [
    { id: "ollama-deepseek", name: "Ollama DeepSeek" },
    { id: "Gemeni", name: "Gemeni Flash Lite 2025" },
  ],
  selectedModel = models[0].id,
  onModelChange,
}: NewChatPromptInputProps) {
  const [localModel, setLocalModel] = useState(selectedModel);

  const handleModelChange = (value: string) => {
    setLocalModel(value);
    onModelChange?.(value);
  };

  return (
    <PromptInput onSubmit={onSubmit}>
      <PromptInputTextarea
        value={input}
        onChange={(e) => onInputChange(e.currentTarget.value)}
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
            value={localModel}
            onValueChange={handleModelChange}
          >
            <PromptInputModelSelectTrigger>
              <PromptInputModelSelectValue />
            </PromptInputModelSelectTrigger>

            <PromptInputModelSelectContent>
              {models.map((model) => (
                <PromptInputModelSelectItem key={model.id} value={model.id}>
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
    </PromptInput>
  );
}
