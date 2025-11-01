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
import scrollbarStyle from "./PromptInputField.module.css";

// Hooks:=>
import { memo } from "react";

// constants:
// import { AI_MODELS } from "@/constants/models";
import { AI_MODELS } from "@/constants/models";

export const PromptInputField = memo(function PromptInputField({
  handleSubmit,
  input,
  setInput,
  chatStatus,
  inConversation = false,
  // AI-Models:
  // AI_MODESLS,
  selectedModel,
  setSelectedModelFunc,
}: {
  handleSubmit: (e: React.FormEvent) => void;
  input: string;
  setInput: (value: string) => void;
  chatStatus: ChatStatus;
  inConversation?: boolean;
  // AI_MODESLS: typeof AI_MODELS;
  selectedModel?: string;
  setSelectedModelFunc?: (modelId: string) => void;
}) {
  // const [selectedModel, setSelectedModel] = useState(MODELS[0].id);

  return (
    <PromptInput onSubmit={handleSubmit}>
      <PromptInputTextarea
        className={`max-h-[16lh] ${scrollbarStyle.promptInput_Scrollbar}`}
        // style={{}}
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
            onValueChange={setSelectedModelFunc}
          >
            <PromptInputModelSelectTrigger>
              <PromptInputModelSelectValue />
            </PromptInputModelSelectTrigger>
            <PromptInputModelSelectContent>
              {AI_MODELS.map((model) => (
                <PromptInputModelSelectItem
                  key={model.id}
                  value={model.id}
                  // onClick={() => {
                  //   // setSelectedModel
                  // }}
                >
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
});
