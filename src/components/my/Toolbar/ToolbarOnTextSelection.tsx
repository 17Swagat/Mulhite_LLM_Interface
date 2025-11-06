// Toolbar component for highlighting text in assistant messages
/* eslint-disable @next/next/no-inline-styles -- Positioning requires dynamic styles */

import { Button } from "@/components/ui/button";
import { SheetTrigger } from "@/components/ui/sheet";
import { AI_MODELS } from "@/constants/models";
import { useSelectedAIModelStore } from "@/stores/modelSelectionStore";
import { HighlighterIcon, ShareIcon, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const HIGHLIGHT_COLORS = [
  {
    name: "Red",
    value: "red",
    bg: "bg-red-400",
    hover: "hover:bg-red-300",
  },
  {
    name: "Yellow",
    value: "yellow",
    bg: "bg-yellow-400",
    hover: "hover:bg-yellow-300",
  },
  {
    name: "Blue",
    value: "blue",
    bg: "bg-blue-400",
    hover: "hover:bg-blue-300",
  },
  {
    name: "Purple",
    value: "purple",
    bg: "bg-purple-400",
    hover: "hover:bg-purple-300",
  },
  {
    name: "Pink",
    value: "pink",
    bg: "bg-pink-400",
    hover: "hover:bg-pink-300",
  },
  {
    name: "Green",
    value: "green",
    bg: "bg-green-400",
    hover: "hover:bg-green-300",
  },
  {
    name: "Orange",
    value: "orange",
    bg: "bg-orange-400",
    hover: "hover:bg-orange-300",
  },
];

interface ToolbarOnTextHighlightProps {
  selectedTextRect: DOMRect | null;
  _selection: Selection | null;
  onHighlight?: (selection: Selection, color: string) => void;
  onExplain: (selection: Selection) => void;
}

export function ToolbarOnTextSelection({
  selectedTextRect,
  _selection,
  onHighlight,
  onExplain,
}: ToolbarOnTextHighlightProps) {
  // Highlights
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("yellow");
  const dropdownHighlightRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownHighlightRef.current &&
        !dropdownHighlightRef.current.contains(event.target as Node)
      ) {
        setIsColorPickerOpen(false);
      }
    };

    if (isColorPickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isColorPickerOpen]);

  // Explain Side-Chat (Model Selection)
  const [isModelPickerOpen, setIsModelPickerOpen] = useState(false);
  const dropdownModelRef = useRef<HTMLDivElement>(null);

  const { explainSideChatModel, setExplainSideChatModel } =
    useSelectedAIModelStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownModelRef.current &&
        !dropdownModelRef.current.contains(event.target as Node)
      ) {
        setIsModelPickerOpen(false);
      }
    };

    if (isModelPickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isModelPickerOpen]);

  // Quick highlight with current color
  const handleQuickHighlight = () => {
    if (_selection && !_selection.isCollapsed && onHighlight) {
      onHighlight(_selection, selectedColor);
    }
  };

  const currentColorObj = HIGHLIGHT_COLORS.find(
    (c) => c.value === selectedColor
  );

  if (!selectedTextRect) return null;

  const toolbarStyle = {
    top: `${selectedTextRect.top - 50}px`,
    left: `${selectedTextRect.left + selectedTextRect.width / 2 - 100}px`,
  };

  return (
    <div
      className="fixed z-50 flex items-center gap-1 p-1 rounded-md bg-gray-800  backdrop-blur-sm"
      style={toolbarStyle}
    >
      {/* Highlighting Btn*/}
      <div className="flex items-center bg-gray-200 p-1 justify-center rounded-md">
        {/* Quick Highlight Button - Highlights with current color */}
        <button
          type="button"
          className={`px-3 py-2 rounded-full transition-colors flex items-center  font-medium text-sm ${currentColorObj?.bg} ${currentColorObj?.hover}`}
          aria-label={`Highlight with ${currentColorObj?.name}`}
          onClick={handleQuickHighlight}
          // title={`Highlight with ${currentColorObj?.name}`}
        >
          <HighlighterIcon size={15} className="text-gray-800" />
        </button>

        {/* Color Picker Dropdown */}
        <div className="relative" ref={dropdownHighlightRef}>
          <button
            type="button"
            className="rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Choose color"
            onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
            title="Choose different color"
          >
            <ChevronDown size={18} className="text-gray-600" />
          </button>

          {/* Color Picker Menu */}
          {isColorPickerOpen && (
            <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 min-w-40 py-1 z-50">
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`w-full text-left px-3 py-2 flex items-center gap-3 transition-colors ${
                    selectedColor === color.value
                      ? "bg-gray-100 font-semibold"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setSelectedColor(color.value);
                    setIsColorPickerOpen(false);
                  }}
                >
                  <div
                    className={`w-4 h-4 rounded-full ${color.bg} border-2 ${
                      selectedColor === color.value
                        ? "border-gray-400 ring-2 ring-gray-300"
                        : "border-gray-300"
                    }`}
                  />
                  <span className="text-sm text-gray-700">{color.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Explaining SideChat Btn*/}
      <div className="rounded-[10px]  text-white flex items-center">
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="bg-transparent hover:bg-purple-200 px-1 "
            onClick={() => {
              _selection && onExplain(_selection);
            }}
          >
            Explain
            <span>
              {explainSideChatModel === AI_MODELS[0].id && (
                <img src="/ai-models/deepseek.svg" alt="DeepSeek" sizes="18" />
              )}

              {explainSideChatModel === AI_MODELS[1].id && (
                <img src="/ai-models/gemini.svg" alt="Gemini" sizes="18" />
              )}
            </span>
          </Button>
        </SheetTrigger>

        <button
          type="button"
          className="rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Choose Model"
          onClick={() => setIsModelPickerOpen(!isModelPickerOpen)}
          title="Choose different model"
        >
          <ChevronDown size={18} className="text-gray-600" />
        </button>

        {/* Model Picker Menu */}
        {isModelPickerOpen && (
          <div
            className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 min-w-40 py-1 z-50"
            ref={dropdownModelRef}
          >
            {AI_MODELS.map((model) => (
              <button
                key={model.id}
                type="button"
                className={`w-full text-left px-3 py-2 flex items-center gap-3 transition-colors ${
                  // selectedModel === model.id
                  explainSideChatModel === model.id
                    ? "bg-gray-100 font-semibold"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => {
                  // setSelectedModel(model.id);
                  setExplainSideChatModel && setExplainSideChatModel(model.id);
                  setIsModelPickerOpen(false);
                }}
              >
                <span className="text-sm text-gray-700">{model.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
