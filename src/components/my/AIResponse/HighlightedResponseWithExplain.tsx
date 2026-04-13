"use client";

import { Response } from "@/components/ui/shadcn-io/ai/response";
import type { Highlight } from "@/ctypes/highlights";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  Trash2,
  HighlighterIcon,
  X,
  ChevronDown,
  MessageSquare,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import highlightMenuStyles from "./HighlightedResponse.module.css";

// ExplainSideChat type
export interface ExplainSideChat {
  _id: string;
  messageId: string;
  conversationId: string;
  userId: string;
  startOffset: number;
  endOffset: number;
  selectedText: string;
  highlightColor: string;
  // createdAt: number;
  updatedAt: number;
}

interface HighlightedResponseWithExplainProps {
  text: string;
  highlights: Highlight[];
  explainSideChats: ExplainSideChat[];
  className?: string;
  messageId: string;
  onDeleteHighlight?: (highlightId: string) => void;
  onOpenExplainSideChat?: (sideChatId: string) => void;
}

export function HighlightedResponseWithExplain({
  text,
  highlights,
  explainSideChats,
  className,
  messageId,
  onDeleteHighlight,
  onOpenExplainSideChat,
}: HighlightedResponseWithExplainProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openHighlightsMenu, setOpenHighlightsMenu] = useState(false);
  const [openExplainMenu, setOpenExplainMenu] = useState(false);
  const prevColorsRef = useRef<Set<string>>(new Set());
  const prevExplainColorsRef = useRef<Set<string>>(new Set());
  // Store live ranges for explain highlights to compute click hit-testing reliably
  const explainRangesRef = useRef<Map<string, Range[]>>(new Map());
  // Store overlays with their explain IDs - we'll calculate positions on render
  const [overlayIds, setOverlayIds] = useState<string[]>([]);
  const [, forceUpdate] = useState({});

  // Shared function to find text range - avoids duplicate tree walker code
  const findTextRange = useCallback(
    (startOffset: number, endOffset: number): Range | null => {
      if (!containerRef.current) return null;

      const walker = document.createTreeWalker(
        containerRef.current,
        NodeFilter.SHOW_TEXT
      );

      let offset = 0;
      let node: Node | null;
      let startNode: Node | null = null;
      let startNodeOffset = 0;

      while ((node = walker.nextNode())) {
        const text = node.textContent || "";
        const end = offset + text.length;

        if (!startNode && startOffset >= offset && startOffset <= end) {
          startNode = node;
          startNodeOffset = startOffset - offset;
        }

        if (startNode && endOffset >= offset && endOffset <= end) {
          const range = document.createRange();
          range.setStart(startNode, startNodeOffset);
          range.setEnd(node, endOffset - offset);
          return range;
        }

        offset = end;
      }
      return null;
    },
    []
  );

  // Create a stable dependency key for both highlights and explains
  const highlightsKey = useMemo(
    () =>
      highlights
        .map((h) => `${h._id}-${h.startOffset}-${h.endOffset}-${h.color}`)
        .join("|"),
    [highlights]
  );

  const explainKey = useMemo(
    () =>
      explainSideChats
        .map(
          (e) => `${e._id}-${e.startOffset}-${e.endOffset}-${e.highlightColor}`
        )
        .join("|"),
    [explainSideChats]
  );

  // Apply CSS Highlight API for regular highlights
  useEffect(() => {
    if (!containerRef.current) return;

    // From-Deepseek:
    const colorMap: Record<string, string> = {
      yellow: "#92780a",
      green: "#1a6b3a",
      blue: "#1d5ea8",
      pink: "#9b2d5a",
      orange: "#b85c1a",
      red: "#a83232",
      purple: "#6b3fa0",
    };

    const ensureStyleAndRule = (color: string) => {
      const styleId = `hl-${messageId}`;
      let style = document.getElementById(styleId) as HTMLStyleElement | null;
      if (!style) {
        style = document.createElement("style");
        style.id = styleId;
        document.head.appendChild(style);
      }
      const bgColor = colorMap[color] || colorMap.yellow;
      const cssRule = `::highlight(msg-${messageId}-${color}) { background-color: ${bgColor}; border-radius: 2px; }`;
      if (!style.textContent?.includes(cssRule)) {
        style.textContent = (style.textContent || "") + cssRule;
      }
    };

    const prevColors = prevColorsRef.current;

    if (!highlights.length) {
      if (typeof CSS !== "undefined" && CSS.highlights) {
        prevColors.forEach((color) => {
          CSS.highlights.delete(`msg-${messageId}-${color}`);
        });
      }
      prevColorsRef.current = new Set();
      return;
    }

    const byColor = highlights.reduce((acc, h) => {
      const color = h.color || "yellow";
      if (!acc[color]) acc[color] = [];
      acc[color].push(h);
      return acc;
    }, {} as Record<string, Highlight[]>);

    const currentColors = new Set<string>(Object.keys(byColor));

    Object.entries(byColor).forEach(([color, colorHighlights]) => {
      const ranges: Range[] = [];
      colorHighlights.forEach((h) => {
        const range = findTextRange(h.startOffset, h.endOffset);
        if (range) {
          ranges.push(range);
        }
      });

      if (typeof CSS !== "undefined" && CSS.highlights) {
        const hl = new Highlight(...ranges);
        CSS.highlights.set(`msg-${messageId}-${color}`, hl);
        ensureStyleAndRule(color);
      }
    });

    if (typeof CSS !== "undefined" && CSS.highlights) {
      prevColors.forEach((color) => {
        if (!currentColors.has(color)) {
          CSS.highlights.delete(`msg-${messageId}-${color}`);
        }
      });
    }

    prevColorsRef.current = currentColors;

    return () => {
      if (
        typeof CSS !== "undefined" &&
        CSS.highlights &&
        prevColorsRef.current.size > 0
      ) {
        prevColorsRef.current.forEach((color) => {
          CSS.highlights.delete(`msg-${messageId}-${color}`);
        });
        prevColorsRef.current = new Set();
      }
    };
  }, [highlightsKey, messageId, findTextRange]);

  // Apply CSS Highlight API for explain side-chats with glowing effect
  useEffect(() => {
    if (!containerRef.current) return;

    const ensureExplainStyleAndRule = (color: string) => {
      const styleId = `explain-${messageId}`;
      let style = document.getElementById(styleId) as HTMLStyleElement | null;
      if (!style) {
        style = document.createElement("style");
        style.id = styleId;
        document.head.appendChild(style);
      }
      const bgColor = "rgba(99, 102, 241, 0.15)";
      const cssRule = `::highlight(explain-${messageId}-${color}) { 
        background-color: ${bgColor};
        padding: 2px;
        border-radius: 3px; 
        text-decoration: underline solid;
        text-decoration-color: #818cf8;
        text-decoration-thickness: 3px;
        text-underline-offset: 4px;
      }`;

      if (!style.textContent?.includes(cssRule)) {
        style.textContent = (style.textContent || "") + cssRule;
      }
    };

    const prevExplainColors = prevExplainColorsRef.current;
    // Reset ranges map before recomputing
    explainRangesRef.current = new Map();
    const newOverlayIds = new Set<string>();

    if (!explainSideChats.length) {
      if (typeof CSS !== "undefined" && CSS.highlights) {
        prevExplainColors.forEach((color) => {
          CSS.highlights.delete(`explain-${messageId}-${color}`);
        });
      }
      prevExplainColorsRef.current = new Set();
      return;
    }

    const byColor = explainSideChats.reduce((acc, e) => {
      const color = e.highlightColor || "blue";
      if (!acc[color]) acc[color] = [];
      acc[color].push(e);
      return acc;
    }, {} as Record<string, ExplainSideChat[]>);

    const currentExplainColors = new Set<string>(Object.keys(byColor));

    Object.entries(byColor).forEach(([color, colorExplains]) => {
      const ranges: Range[] = [];
      colorExplains.forEach((e) => {
        const range = findTextRange(e.startOffset, e.endOffset);
        if (range) {
          ranges.push(range);

          // Save range for this explain id for precise click hit-test
          const arr = explainRangesRef.current.get(e._id) ?? [];
          arr.push(range);
          explainRangesRef.current.set(e._id, arr);

          // Store the explain ID - we'll calculate rects on render
          newOverlayIds.add(e._id);
        }
      });

      if (typeof CSS !== "undefined" && CSS.highlights) {
        const hl = new Highlight(...ranges);
        CSS.highlights.set(`explain-${messageId}-${color}`, hl);
        ensureExplainStyleAndRule(color);
      }
    });

    if (typeof CSS !== "undefined" && CSS.highlights) {
      prevExplainColors.forEach((color) => {
        if (!currentExplainColors.has(color)) {
          CSS.highlights.delete(`explain-${messageId}-${color}`);
        }
      });
    }

    prevExplainColorsRef.current = currentExplainColors;
    setOverlayIds(Array.from(newOverlayIds));

    return () => {
      if (
        typeof CSS !== "undefined" &&
        CSS.highlights &&
        prevExplainColorsRef.current.size > 0
      ) {
        prevExplainColorsRef.current.forEach((color) => {
          CSS.highlights.delete(`explain-${messageId}-${color}`);
        });
        prevExplainColorsRef.current = new Set();
      }
    };
  }, [explainKey, messageId, findTextRange]);

  // Force re-render on scroll/resize to update overlay positions
  useEffect(() => {
    if (!containerRef.current || overlayIds.length === 0) return;

    const handleUpdate = () => {
      forceUpdate({});
    };

    // Find scrollable parent
    let scrollParent: HTMLElement | Window = window;
    let element = containerRef.current.parentElement;
    while (element) {
      const style = window.getComputedStyle(element);
      if (
        style.overflow === "auto" ||
        style.overflow === "scroll" ||
        style.overflowY === "auto" ||
        style.overflowY === "scroll"
      ) {
        scrollParent = element;
        break;
      }
      element = element.parentElement;
    }

    // Listen to scroll and resize
    scrollParent.addEventListener("scroll", handleUpdate, { passive: true });
    window.addEventListener("resize", handleUpdate, { passive: true });

    return () => {
      scrollParent.removeEventListener("scroll", handleUpdate);
      window.removeEventListener("resize", handleUpdate);
    };
  }, [overlayIds.length]);

  const scrollToHighlight = (h: Highlight) => {
    if (!containerRef.current) return;

    const walker = document.createTreeWalker(
      containerRef.current,
      NodeFilter.SHOW_TEXT
    );

    let offset = 0;
    let node: Node | null;
    let targetNode: Node | null = null;
    let targetOffset = 0;

    while ((node = walker.nextNode())) {
      const text = node.textContent || "";
      const end = offset + text.length;

      if (h.startOffset >= offset && h.startOffset <= end) {
        targetNode = node;
        targetOffset = h.startOffset - offset;
        break;
      }
      offset = end;
    }

    if (targetNode?.parentElement) {
      setOpenHighlightsMenu(false);

      setTimeout(() => {
        const range = document.createRange();
        range.setStart(targetNode!, targetOffset);
        range.setEnd(
          targetNode!,
          Math.min(targetOffset + 10, (targetNode!.textContent || "").length)
        );

        const scrollTarget =
          (range.startContainer instanceof Element
            ? range.startContainer
            : range.startContainer?.parentElement) || targetNode!.parentElement;

        // Find the scrollable parent container
        let scrollContainer = scrollTarget?.parentElement;
        while (scrollContainer) {
          const style = window.getComputedStyle(scrollContainer);
          const overflowY = style.overflowY;
          if (overflowY === "auto" || overflowY === "scroll") {
            break;
          }
          scrollContainer = scrollContainer.parentElement;
        }

        // Determine scroll behavior based on element position
        const targetRect = scrollTarget?.getBoundingClientRect();
        const containerRect = scrollContainer?.getBoundingClientRect();

        let blockPosition: ScrollLogicalPosition = "nearest";

        if (targetRect && containerRect) {
          const viewportHeight = window.innerHeight;
          const elementTop = targetRect.top;
          const elementBottom = targetRect.bottom;

          // Check if element is already visible
          const isVisible = elementTop >= 0 && elementBottom <= viewportHeight;

          if (!isVisible) {
            // If element is below viewport, scroll to start (top of element visible)
            if (elementTop > viewportHeight) {
              blockPosition = "start";
            }
            // If element is above viewport, scroll to end (bottom of element visible)
            else if (elementBottom < 0) {
              blockPosition = "end";
            }
            // For elements partially visible, use nearest
            else {
              blockPosition = "nearest";
            }
          }
        }

        scrollTarget?.scrollIntoView({
          behavior: "smooth",
          block: blockPosition,
          inline: "nearest",
        });

        setTimeout(() => {
          const el = targetNode!.parentElement;
          if (el) {
            el.style.transition = "background-color 0.3s";
            el.style.backgroundColor = "rgba(59, 130, 246, 0.4)";
            setTimeout(() => {
              el.style.backgroundColor = "";
            }, 2000);
          }
        }, 500);
      }, 100);
    }
  };

  const totalItems = highlights.length + explainSideChats.length;
  if (totalItems === 0) {
    // In case no highlights or explains, just render plain response
    return (
      <div
        ref={containerRef}
        className={[className, highlightMenuStyles.textCursor]
          .filter(Boolean)
          .join(" ")}
        data-message-id={messageId}
        data-message-text="true"
        data-assistant-message="true"
      >
        <Response>{text}</Response>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`${className || ""} ${highlightMenuStyles.textCursor} ${
        highlightMenuStyles.relativeContainer
      }`}
      data-message-id={messageId}
      data-message-text="true"
      data-assistant-message="true"
    >
      <Response>{text}</Response>

      {/* Invisible overlays for cursor pointer on explain highlights */}
      {overlayIds.length > 0 &&
        (() => {
          const containerRect = containerRef.current?.getBoundingClientRect();
          if (!containerRect) return null;

          const overlays: React.ReactElement[] = [];

          overlayIds.forEach((explainId) => {
            const ranges = explainRangesRef.current.get(explainId);
            if (!ranges) return;

            ranges.forEach((range) => {
              const rects = range.getClientRects();
              Array.from(rects).forEach((rect, idx) => {
                const overlayStyle = {
                  left: `${rect.left - containerRect.left}px`,
                  top: `${rect.top - containerRect.top}px`,
                  width: `${rect.width}px`,
                  height: `${rect.height}px`,
                };

                overlays.push(
                  // eslint-disable-next-line react/forbid-dom-props
                  <div
                    key={`${explainId}-${idx}`}
                    className={highlightMenuStyles.explainOverlay}
                    style={overlayStyle}
                    onClick={() => onOpenExplainSideChat?.(explainId)}
                  />
                );
              });
            });
          });

          return overlays;
        })()}

      {totalItems > 0 && (
        <div className="mt-2 mx-auto rounded-lg flex flex-col lg:flex-row items-start justify-start gap-1.5 lg:gap-2">
          {/* #[1] */}
          {/* Highlights Menu Popup Menu */}
          {highlights.length > 0 && (
            <HighlightMenuPopover
              highlights={highlights}
              openHighlightsMenu={openHighlightsMenu}
              setOpenHighlightsMenu={setOpenHighlightsMenu}
              onDeleteHighlight={onDeleteHighlight}
              scrollToHighlight={scrollToHighlight}
            />
          )}

          {/* #[2] */}
          {/* Explain Popup Menu */}
          {explainSideChats.length > 0 && (
            <ExplainSideChatMenuPopover
              openExplainMenu={openExplainMenu}
              setOpenExplainMenu={setOpenExplainMenu}
              explainSideChats={explainSideChats}
              onOpenExplainSideChat={onOpenExplainSideChat}
            />
          )}
        </div>
      )}
    </div>
  );
}

function ExplainSideChatMenuPopover({
  openExplainMenu,
  setOpenExplainMenu,
  explainSideChats,
  onOpenExplainSideChat,
}: {
  openExplainMenu: boolean;
  setOpenExplainMenu: (open: boolean) => void;
  explainSideChats: ExplainSideChat[];
  onOpenExplainSideChat?: (sideChatId: string) => void;
}) {
  return (
    <Popover open={openExplainMenu} onOpenChange={setOpenExplainMenu}>
      <PopoverTrigger className="bg-black" asChild>
        <Button
          variant="outline"
          style={{
            backgroundColor: openExplainMenu ? "rgba(99, 102, 241, 0.15)" : "transparent",
          }}
        >
          <MessageSquare size={14} className="text-indigo-400" />
          <span className="">{explainSideChats.length} Explains</span>
          <ChevronDown
            size={12}
            className={` transition-transform ${
              openExplainMenu ? "rotate-180" : ""
            }`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-transparent text-white z-50 ">
        {explainSideChats.length > 0 && (
          <div className="bg-slate-900 rounded-xl border border-white/10 overflow-hidden shadow-xl">
            <div className="px-3 py-2 bg-slate-800/80 text-xs text-slate-400 font-semibold">
              EXPLAIN CHATS (Click text to open)
            </div>
            {explainSideChats.map((e, idx) => (
              <div
                key={e._id}
                className="px-3 py-2 border-b border-white/5 last:border-b-0 hover:bg-white/5 cursor-pointer group flex items-start gap-2 transition-colors duration-150"
                onClick={() => onOpenExplainSideChat?.(e._id)}
              >
                <MessageSquare
                  size={14}
                    className={`mt-1 shrink-0 
                            text-indigo-400
                          `}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 line-clamp-2">
                    {e.selectedText}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Explain #{idx + 1}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

function HighlightMenuPopover({
  highlights,
  openHighlightsMenu,
  setOpenHighlightsMenu,
  onDeleteHighlight,
  scrollToHighlight,
}: {
  highlights: Highlight[];
  openHighlightsMenu: boolean;
  setOpenHighlightsMenu: (open: boolean) => void;
  onDeleteHighlight?: (highlightId: string) => void;
  scrollToHighlight: (h: Highlight) => void;
}) {
  const getColorClass = (color: string): string => {
    const colorMap: Record<string, string> = {
      yellow: "bg-yellow-200",
      green: "bg-green-200",
      blue: "bg-blue-200",
      pink: "bg-pink-200",
      orange: "bg-orange-200",
      red: "bg-red-200",
      purple: "bg-purple-200",
    };
    return colorMap[color] || colorMap.yellow;
  };

  return (
    <Popover open={openHighlightsMenu} onOpenChange={setOpenHighlightsMenu}>
      <PopoverTrigger className="bg-black" asChild>
        <Button
          variant="outline"
          style={{
            backgroundColor: openHighlightsMenu ? "rgba(99, 102, 241, 0.15)" : "transparent",
          }}
        >
          <HighlighterIcon size={14} className="text-yellow-500" />
          <span>{highlights.length} Highlights</span>
          <ChevronDown
            size={12}
            className={`transition-transform ${
              openHighlightsMenu ? "rotate-180" : ""
            }`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-transparent text-white z-50">
        <div className="mt-2 bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-xl">
          <div className="px-3 py-2 bg-slate-800/80 border-b border-white/5 flex items-center justify-between">
            <span className="text-sm font-medium text-white">
              Your Highlights
            </span>
            <button
              type="button"
              onClick={() => setOpenHighlightsMenu(false)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              aria-label="Close menu"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          <div
            className={`max-h-80 overflow-y-auto  ${highlightMenuStyles.highlight_scrollbar}`}
          >
            {highlights.length > 0 && (
              <>
                {/* <div className="px-3 py-2 bg-gray-750 text-xs text-gray-400 font-semibold">
                  HIGHLIGHTS
                </div> */}
                {highlights.map((h, idx) => (
                  <div
                    key={h._id}
                    className="px-3 py-2 border-b border-white/5 last:border-b-0 hover:bg-white/5 cursor-pointer group flex items-start gap-2 transition-colors duration-150"
                    onClick={() => scrollToHighlight(h)}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1 shrink-0 ${getColorClass(
                        h.color || "yellow"
                      )}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-200 line-clamp-2">
                        {h.text}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">#{idx + 1}</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteHighlight?.(h._id);
                      }}
                      className="p-1 hover:bg-red-900/30 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Delete highlight"
                    >
                      <Trash2
                        size={12}
                        className="text-gray-400 hover:text-red-400"
                      />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
