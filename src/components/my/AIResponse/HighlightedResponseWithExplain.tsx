"use client";

import { Response } from "@/components/ui/shadcn-io/ai/response";
import type { Highlight } from "@/ctypes/highlights";
import { useEffect, useRef, useState, useMemo } from "react";
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
  const [forceUpdateKey, setForceUpdateKey] = useState(0);
  // Store live ranges for explain highlights to compute click hit-testing reliably
  const explainRangesRef = useRef<Map<string, Range[]>>(new Map());

  // Create a stable dependency key for both highlights and explains
  const highlightsKey = useMemo(
    () =>
      highlights
        .map((h) => `${h._id}-${h.startOffset}-${h.endOffset}-${h.color}`)
        .sort()
        .join("|"),
    [highlights]
  );

  const explainKey = useMemo(
    () =>
      explainSideChats
        .map(
          (e) => `${e._id}-${e.startOffset}-${e.endOffset}-${e.highlightColor}`
        )
        .sort()
        .join("|"),
    [explainSideChats]
  );

  // Force re-render when explain side chats change
  useEffect(() => {
    if (explainKey) {
      setForceUpdateKey((prev) => prev + 1);
    }
  }, [explainKey]);

  // Apply CSS Highlight API for regular highlights
  useEffect(() => {
    if (!containerRef.current) return;

    const colorMap: Record<string, string> = {
      yellow: "rgba(238, 252, 50, 1)", //"rgb(254 240 138)",
      green: "rgba(153, 250, 115, 1)", //"rgb(187 247 208)",
      blue: "rgba(82, 253, 242, 1)", //"rgb(191 219 254)",
      pink: "rgba(255, 114, 236, 1)", //"rgb(251 207 232)",
      orange: "rgba(247, 173, 36, 1)",
      red: "rgba(253, 107, 107, 1)",
      purple: "rgba(217, 122, 255, 1)",
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
        const walker = document.createTreeWalker(
          containerRef.current!,
          NodeFilter.SHOW_TEXT
        );

        let offset = 0;
        let node: Node | null;
        let startNode: Node | null = null;
        let startOffset = 0;

        while ((node = walker.nextNode())) {
          const text = node.textContent || "";
          const end = offset + text.length;

          if (!startNode && h.startOffset >= offset && h.startOffset <= end) {
            startNode = node;
            startOffset = h.startOffset - offset;
          }

          if (startNode && h.endOffset >= offset && h.endOffset <= end) {
            const range = document.createRange();
            range.setStart(startNode, startOffset);
            range.setEnd(node, h.endOffset - offset);
            ranges.push(range);
            break;
          }

          offset = end;
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
      if (typeof CSS !== "undefined" && CSS.highlights) {
        prevColorsRef.current.forEach((color) => {
          CSS.highlights.delete(`msg-${messageId}-${color}`);
        });
      }
      prevColorsRef.current = new Set();
    };
  }, [highlightsKey, messageId]);

  // Apply CSS Highlight API for explain side-chats with glowing effect
  useEffect(() => {
    if (!containerRef.current) return;

    const explainColorMap: Record<string, string> = {
      yellow: "rgba(254, 240, 138, 0.6)",
      green: "rgba(187, 247, 208, 0.6)",
      blue: "rgba(147, 197, 253, 0.7)",
      pink: "rgba(251, 207, 232, 0.6)",
      orange: "rgba(254, 215, 170, 0.6)",
      red: "rgba(254, 202, 202, 0.6)",
      purple: "rgba(216, 180, 254, 0.7)",
    };

    const ensureExplainStyleAndRule = (color: string) => {
      const styleId = `explain-${messageId}`;
      let style = document.getElementById(styleId) as HTMLStyleElement | null;
      if (!style) {
        style = document.createElement("style");
        style.id = styleId;
        document.head.appendChild(style);
      }
      const bgColor = explainColorMap[color] || explainColorMap.blue;
      const cssRule = `::highlight(explain-${messageId}-${color}) { 
        background-color: ${bgColor}; 
        border-radius: 3px; 
        cursor: pointer;
        text-decoration: underline;
        text-decoration-color: ${
          color === "blue"
            ? "#3b82f6"
            : color === "purple"
            ? "#a855f7"
            : "#6366f1"
        };
        text-decoration-style: solid;
        text-decoration-thickness: 5px;
        text-underline-offset: 2px;
      }`;
      if (!style.textContent?.includes(cssRule)) {
        style.textContent = (style.textContent || "") + cssRule;
      }
    };

    const prevExplainColors = prevExplainColorsRef.current;
    // Reset ranges map before recomputing
    explainRangesRef.current = new Map();

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
        const walker = document.createTreeWalker(
          containerRef.current!,
          NodeFilter.SHOW_TEXT
        );

        let offset = 0;
        let node: Node | null;
        let startNode: Node | null = null;
        let startOffset = 0;

        while ((node = walker.nextNode())) {
          const text = node.textContent || "";
          const end = offset + text.length;

          if (!startNode && e.startOffset >= offset && e.startOffset <= end) {
            startNode = node;
            startOffset = e.startOffset - offset;
          }

          if (startNode && e.endOffset >= offset && e.endOffset <= end) {
            const range = document.createRange();
            range.setStart(startNode, startOffset);
            range.setEnd(node, e.endOffset - offset);
            ranges.push(range);

            // Save range for this explain id for precise click hit-test
            const arr = explainRangesRef.current.get(e._id) ?? [];
            arr.push(range);
            explainRangesRef.current.set(e._id, arr);

            break;
          }

          offset = end;
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

    return () => {
      if (typeof CSS !== "undefined" && CSS.highlights) {
        prevExplainColorsRef.current.forEach((color) => {
          CSS.highlights.delete(`explain-${messageId}-${color}`);
        });
      }
      prevExplainColorsRef.current = new Set();
    };
  }, [explainKey, messageId]);

  // Handle click on explain highlights using range hit-testing (reliable across browsers)
  useEffect(() => {
    if (!containerRef.current) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-message-text]")) return;

      const x = e.clientX;
      const y = e.clientY;

      // Prioritize precise rect hit-test from stored ranges
      for (const explain of explainSideChats) {
        const ranges = explainRangesRef.current.get(explain._id) || [];
        for (const r of ranges) {
          const rects = r.getClientRects();
          for (let i = 0; i < rects.length; i++) {
            const rect = rects[i];
            if (
              x >= rect.left &&
              x <= rect.right &&
              y >= rect.top &&
              y <= rect.bottom
            ) {
              onOpenExplainSideChat?.(explain._id);
              return;
            }
          }
        }
      }
    };

    const container = containerRef.current;
    container.addEventListener("click", handleClick);

    return () => {
      container.removeEventListener("click", handleClick);
    };
  }, [explainSideChats, onOpenExplainSideChat]);

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

        scrollTarget?.scrollIntoView({
          behavior: "smooth",
          block: "center",
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
      className={[className, highlightMenuStyles.textCursor]
        .filter(Boolean)
        .join(" ")}
      data-message-id={messageId}
      data-message-text="true"
      data-assistant-message="true"
    >
      <Response>{text}</Response>

      {totalItems > 0 && (
        <div className="mt-2 mx-auto rounded-lg flex items-center justify-start gap-2">
          {/* Highlights Menu Popup Menu */}
          <Popover
            open={openHighlightsMenu}
            onOpenChange={setOpenHighlightsMenu}
          >
            <PopoverTrigger className="bg-black" asChild>
              <Button
                variant="outline"
                style={{
                  backgroundColor: openHighlightsMenu ? "#cce60aff" : "white",
                }}
              >
                <HighlighterIcon size={14} />
                <span>{highlights.length} Highlights</span>
                <ChevronDown
                  size={12}
                  className={`transition-transform ${
                    openHighlightsMenu ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-gray-900 text-white z-50">
              <div className="mt-2 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <div className="px-3 py-2 bg-gray-700 border-b border-gray-600 flex items-center justify-between">
                  <span className="text-sm font-medium text-white">
                    Highlights & Explains
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpenHighlightsMenu(false)}
                    className="p-1 hover:bg-gray-600 rounded"
                    aria-label="Close menu"
                  >
                    <X size={20} className="text-gray-300" />
                  </button>
                </div>

                <div
                  className={`max-h-80 overflow-y-auto  ${highlightMenuStyles.highlight_scrollbar}`}
                >
                  {highlights.length > 0 && (
                    <>
                      <div className="px-3 py-2 bg-gray-750 text-xs text-gray-400 font-semibold">
                        HIGHLIGHTS
                      </div>
                      {highlights.map((h, idx) => (
                        <div
                          key={h._id}
                          className="px-3 py-2 border-b border-gray-700 last:border-b-0 hover:bg-gray-700 cursor-pointer group flex items-start gap-2"
                          onClick={() => scrollToHighlight(h)}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mt-1 shrink-0 ${getColorClass(
                              h.color || "yellow"
                            )}`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-200 line-clamp-2">
                              {h.text}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              #{idx + 1}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteHighlight?.(h._id);
                            }}
                            className="p-1 hover:bg-red-900/40 rounded opacity-0 group-hover:opacity-100"
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

          {/* Explain Popup Menu */}
          {explainSideChats.length > 0 && (
            <Popover open={openExplainMenu} onOpenChange={setOpenExplainMenu}>
              <PopoverTrigger className="bg-black" asChild>
                <Button
                  variant="outline"
                  style={{
                    backgroundColor: openExplainMenu ? "#cce60aff" : "white",
                  }}
                  onClick={() => {
                    setOpenExplainMenu((prev) => !prev);
                  }}
                >
                  <MessageSquare size={14} />
                  <span>{explainSideChats.length} Explains</span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform ${
                      openExplainMenu ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-gray-900 text-white z-50 rounded-[10px]">
                {explainSideChats.length > 0 && (
                  <>
                    <div className="px-3 py-2 bg-gray-750 text-xs text-gray-400 font-semibold border-t border-gray-700">
                      EXPLAIN CHATS (Click text to open)
                    </div>
                    {explainSideChats.map((e, idx) => (
                      <div
                        key={e._id}
                        className="px-3 py-2 border-b border-gray-700 last:border-b-0 hover:bg-gray-700 cursor-pointer group flex items-start gap-2"
                        onClick={() => onOpenExplainSideChat?.(e._id)}
                      >
                        <MessageSquare
                          size={14}
                          className={`mt-1 shrink-0 ${getExplainColorClass(
                            e.highlightColor
                          )}`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-200 line-clamp-2">
                            {e.selectedText}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Explain #{idx + 1}
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </PopoverContent>
            </Popover>
          )}
        </div>
      )}
    </div>
  );
}

function getColorClass(color: string): string {
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
}

function getExplainColorClass(color: string): string {
  const colorMap: Record<string, string> = {
    blue: "text-blue-400",
    purple: "text-purple-400",
    indigo: "text-indigo-400",
    cyan: "text-cyan-400",
  };
  return colorMap[color] || colorMap.blue;
}
