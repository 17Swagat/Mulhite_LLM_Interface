// Suitable name for a file "ToolbarOnUserTextHighlight.tsx" that contains a React component rendering a toolbar when the user highlights text.

import { HighlighterIcon, ShareIcon } from "lucide-react";

export function ToolbarOnTextHighlight({
  selectedTextRect,
  _selection,
}: {
  selectedTextRect: DOMRect | null;
  _selection: Selection | null;
}) {
  return (
    <div
      className="flex items-center gap-1 p-0.5 rounded-full bg-white/90 shadow-lg backdrop-blur-sm border border-gray-200"
      style={{
        visibility: selectedTextRect ? "visible" : "hidden",
        position: "fixed",
        top: selectedTextRect ? `${selectedTextRect.top - 40}px` : "0px",
        left: selectedTextRect
          ? `${selectedTextRect.left + selectedTextRect.width / 2 - 50}px`
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
          if (_selection && !_selection.isCollapsed) {
            const range = _selection.getRangeAt(0);
          }
        }}
      >
        <HighlighterIcon size={20} className="text-amber-600" />
      </button>

      {/* Share Button */}
      <button
        type="button"
        className="p-1.5 rounded-full hover:bg-purple-100 transition-colors"
        aria-label="Share"
      >
        <ShareIcon size={20} className="text-purple-600" />
      </button>
    </div>
  );
}
