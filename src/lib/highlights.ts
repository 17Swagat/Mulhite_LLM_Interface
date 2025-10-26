import { Id } from "@/../convex/_generated/dataModel";

export interface Highlight {
  _id: Id<"highlights">;
  messageId: Id<"messages">;
  conversationId: Id<"conversations">;
  userId: Id<"users">;
  startOffset: number;
  endOffset: number;
  text: string;
  color?: string;
  createdAt: number;
}

interface TextSegment {
  text: string;
  isHighlighted: boolean;
  color?: string;
}

/**
 * Split text into segments based on highlights
 * Returns array of {text, isHighlighted, color}
 */
export function splitTextWithHighlights(
  text: string,
  highlights: Highlight[]
): TextSegment[] {
  if (!highlights || highlights.length === 0) {
    return [{ text, isHighlighted: false }];
  }

  // Sort highlights by start offset
  const sortedHighlights = [...highlights].sort(
    (a, b) => a.startOffset - b.startOffset
  );

  const segments: TextSegment[] = [];
  let currentPos = 0;

  for (const highlight of sortedHighlights) {
    const { startOffset, endOffset, color } = highlight;

    // Validate offsets
    if (
      startOffset < 0 ||
      endOffset > text.length ||
      startOffset >= endOffset
    ) {
      console.warn("Invalid highlight offsets:", highlight);
      continue;
    }

    // Add non-highlighted text before this highlight
    if (startOffset > currentPos) {
      segments.push({
        text: text.slice(currentPos, startOffset),
        isHighlighted: false,
      });
    }

    // Add highlighted segment
    segments.push({
      text: text.slice(startOffset, endOffset),
      isHighlighted: true,
      color: color || "yellow",
    });

    currentPos = endOffset;
  }

  // Add remaining text after last highlight
  if (currentPos < text.length) {
    segments.push({
      text: text.slice(currentPos),
      isHighlighted: false,
    });
  }

  return segments;
}

/**
 * Calculate text offset in the plain text version of a message
 * This is needed when user selects text from the rendered markdown
 */
export function getTextOffsetFromSelection(
  messageText: string,
  selectedText: string,
  selection: Selection
): { startOffset: number; endOffset: number } | null {
  if (!selection || !selection.rangeCount) {
    return null;
  }

  // Simple approach: find the selected text in the original plain text
  // This works for most cases where the selected text appears uniquely
  const cleanSelected = selectedText.trim();
  const startOffset = messageText.indexOf(cleanSelected);

  if (startOffset === -1) {
    console.warn("Could not find selected text in message:", cleanSelected);
    return null;
  }

  return {
    startOffset,
    endOffset: startOffset + cleanSelected.length,
  };
}
