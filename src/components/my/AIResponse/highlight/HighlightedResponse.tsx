// "use client";

// import { Response } from "@/components/ui/shadcn-io/ai/response";
// import type { Highlight } from "@/ctypes/highlights";
// import { useEffect, useRef, useState, useMemo } from "react";
// import { Trash2, HighlighterIcon, X, ChevronDown } from "lucide-react";
// // import {
// //   Popover,
// //   PopoverContent,
// //   PopoverTrigger,
// // } from "@radix-ui/react-popover";

// // import { Popover } from "@radix-ui/react-popover";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// import { Button } from "@/components/ui/button";
// import highlightMenuStyles from "./HighlightedResponse.module.css";

// interface HighlightedResponseProps {
//   text: string;
//   highlights: Highlight[];
//   className?: string;
//   messageId: string;
//   onDeleteHighlight?: (highlightId: string) => void;
// }

// export function HighlightedResponse({
//   text,
//   highlights,
//   className,
//   messageId,
//   onDeleteHighlight,
// }: HighlightedResponseProps) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [open, setOpen] = useState(false);
//   // Track which color highlight names are currently applied for this message
//   const prevColorsRef = useRef<Set<string>>(new Set());

//   // Create a stable dependency key based on highlight IDs and positions
//   const highlightsKey = useMemo(
//     () =>
//       highlights
//         .map((h) => `${h._id}-${h.startOffset}-${h.endOffset}-${h.color}`)
//         .sort()
//         .join("|"),
//     [highlights]
//   );

//   // Apply CSS Highlight API without clearing everything (diff updates per color)
//   useEffect(() => {
//     if (!containerRef.current) return;

//     const colorMap: Record<string, string> = {
//       yellow: "rgb(254 240 138)",
//       green: "rgb(187 247 208)",
//       blue: "rgb(191 219 254)",
//       pink: "rgb(251 207 232)",
//       orange: "rgb(254 215 170)",
//       red: "rgb(254 202 202)",
//       purple: "rgb(233 213 255)",
//     };

//     // Helper: ensure a single style element per message; add rules if missing
//     const ensureStyleAndRule = (color: string) => {
//       const styleId = `hl-${messageId}`;
//       let style = document.getElementById(styleId) as HTMLStyleElement | null;
//       if (!style) {
//         style = document.createElement("style");
//         style.id = styleId;
//         document.head.appendChild(style);
//       }
//       const bgColor = colorMap[color] || colorMap.yellow;
//       const cssRule = `::highlight(msg-${messageId}-${color}) { background-color: ${bgColor}; border-radius: 2px; }`;
//       if (!style.textContent?.includes(cssRule)) {
//         style.textContent = (style.textContent || "") + cssRule;
//       }
//     };

//     const prevColors = prevColorsRef.current;

//     // If no highlights now: remove any previously applied highlights and exit
//     if (!highlights.length) {
//       if (typeof CSS !== "undefined" && CSS.highlights) {
//         prevColors.forEach((color) => {
//           CSS.highlights.delete(`msg-${messageId}-${color}`);
//         });
//       }
//       prevColorsRef.current = new Set();
//       return;
//     }

//     // Group by color for efficient Highlight instances
//     const byColor = highlights.reduce((acc, h) => {
//       const color = h.color || "yellow";
//       if (!acc[color]) acc[color] = [];
//       acc[color].push(h);
//       return acc;
//     }, {} as Record<string, Highlight[]>);

//     const currentColors = new Set<string>(Object.keys(byColor));

//     // Update or create highlights only for colors present in current set
//     Object.entries(byColor).forEach(([color, colorHighlights]) => {
//       // Build ranges for this color
//       const ranges: Range[] = [];
//       colorHighlights.forEach((h) => {
//         const walker = document.createTreeWalker(
//           containerRef.current!,
//           NodeFilter.SHOW_TEXT
//         );

//         let offset = 0;
//         let node: Node | null;
//         let startNode: Node | null = null;
//         let startOffset = 0;

//         while ((node = walker.nextNode())) {
//           const text = node.textContent || "";
//           const end = offset + text.length;

//           if (!startNode && h.startOffset >= offset && h.startOffset <= end) {
//             startNode = node;
//             startOffset = h.startOffset - offset;
//           }

//           if (startNode && h.endOffset >= offset && h.endOffset <= end) {
//             const range = document.createRange();
//             range.setStart(startNode, startOffset);
//             range.setEnd(node, h.endOffset - offset);
//             ranges.push(range);
//             break;
//           }

//           offset = end;
//         }
//       });

//       if (typeof CSS !== "undefined" && CSS.highlights) {
//         const hl = new Highlight(...ranges);
//         // Replace or set atomically (no intermediate clear)
//         CSS.highlights.set(`msg-${messageId}-${color}`, hl);
//         // Ensure style rule exists for this color
//         ensureStyleAndRule(color);
//       }
//     });

//     // Remove colors that were previously applied but are no longer present
//     if (typeof CSS !== "undefined" && CSS.highlights) {
//       prevColors.forEach((color) => {
//         if (!currentColors.has(color)) {
//           CSS.highlights.delete(`msg-${messageId}-${color}`);
//         }
//       });
//     }

//     // Update previous colors set
//     prevColorsRef.current = currentColors;

//     // Cleanup only on unmount: remove all remaining colors for this message
//     return () => {
//       if (typeof CSS !== "undefined" && CSS.highlights) {
//         prevColorsRef.current.forEach((color) => {
//           CSS.highlights.delete(`msg-${messageId}-${color}`);
//         });
//       }
//       prevColorsRef.current = new Set();
//     };
//   }, [highlightsKey, messageId]);

//   const scrollToHighlight = (h: Highlight) => {
//     if (!containerRef.current) return;

//     const walker = document.createTreeWalker(
//       containerRef.current,
//       NodeFilter.SHOW_TEXT
//     );

//     let offset = 0;
//     let node: Node | null;
//     let targetNode: Node | null = null;
//     let targetOffset = 0;

//     while ((node = walker.nextNode())) {
//       const text = node.textContent || "";
//       const end = offset + text.length;

//       if (h.startOffset >= offset && h.startOffset <= end) {
//         targetNode = node;
//         targetOffset = h.startOffset - offset;
//         break;
//       }
//       offset = end;
//     }

//     if (targetNode?.parentElement) {
//       setOpen(false);

//       setTimeout(() => {
//         const range = document.createRange();
//         range.setStart(targetNode!, targetOffset);
//         range.setEnd(
//           targetNode!,
//           Math.min(targetOffset + 10, (targetNode!.textContent || "").length)
//         );

//         const rect = range.getBoundingClientRect();
//         const absoluteTop = window.scrollY + rect.top;
//         const targetScroll = Math.max(
//           0,
//           absoluteTop - window.innerHeight / 2 + rect.height / 2
//         );

//         window.scrollTo({ top: targetScroll, behavior: "smooth" });

//         setTimeout(() => {
//           const el = targetNode!.parentElement;
//           if (el) {
//             el.style.transition = "background-color 0.3s";
//             el.style.backgroundColor = "rgba(59, 130, 246, 0.4)";
//             setTimeout(() => {
//               el.style.backgroundColor = "";
//             }, 2000);
//           }
//         }, 500);
//       }, 100);
//     }
//   };

//   // If no highlights, render plain text
//   if (!highlights || highlights.length === 0) {
//     return (
//       <div
//         ref={containerRef}
//         className={className}
//         data-message-id={messageId}
//         data-message-text="true"
//         data-assistant-message="true"
//       >
//         <Response>{text}</Response>
//       </div>
//     );
//   }

//   return (
//     <div
//       ref={containerRef}
//       className={className}
//       data-message-id={messageId}
//       data-message-text="true"
//       data-assistant-message="true"
//     >
//       <Response>{text}</Response>

//       {/* Simple highlight button and menu */}
//       {highlights.length > 0 && (
//         // <div className="mt-4 bg-linear-to-r from-[#423b64]  to-[#334155]  p-2 mx-auto rounded-lg">
//         <div className="mt-2  mx-auto rounded-lg">
//           <Popover open={open} onOpenChange={setOpen}>
//             <PopoverTrigger className="bg-transparent" asChild>
//               <Button
//                 variant="outline"
//                 style={{ backgroundColor: open ? "#cce60aff" : "white" }}
//               >
//                 <HighlighterIcon size={14} />
//                 <span>{highlights.length} Highlights</span>
//                 <ChevronDown
//                   size={12}
//                   className={`transition-transform ${open ? "rotate-180" : ""}`}
//                 />
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-80 bg-gray-900 text-white z-50">
//               <div
//                 className={`mt-2 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden `}
//               >
//                 <div className="px-3 py-2 bg-gray-700 border-b border-gray-600 flex items-center justify-between">
//                   <span className="text-sm font-medium text-white">
//                     Your Highlights
//                   </span>

//                   <button
//                     type="button"
//                     onClick={() => setOpen(false)}
//                     className="p-1 hover:bg-gray-600 rounded"
//                     aria-label="Close menu"
//                   >
//                     <X size={20} className="text-gray-300" />
//                   </button>
//                 </div>

//                 <div
//                   className={`max-h-80 overflow-y-auto ${highlightMenuStyles.highlight_scrollbar}`}
//                 >
//                   {highlights.map((h, idx) => (
//                     <div
//                       key={h._id}
//                       className="px-3 py-2 border-b border-gray-700 last:border-b-0 hover:bg-gray-700 cursor-pointer group flex items-start gap-2"
//                       onClick={() => scrollToHighlight(h)}
//                     >
//                       <div
//                         className={`w-2 h-2 rounded-full mt-1 shrink-0 ${getColorClass(
//                           h.color || "yellow"
//                         )}`}
//                       />
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm text-gray-200 line-clamp-2">
//                           {h.text}
//                         </p>
//                         <p className="text-xs text-gray-500 mt-1">#{idx + 1}</p>
//                       </div>
//                       <button
//                         type="button"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           onDeleteHighlight?.(h._id);
//                         }}
//                         className="p-1 hover:bg-red-900/40 rounded opacity-0 group-hover:opacity-100"
//                         aria-label="Delete highlight"
//                       >
//                         <Trash2
//                           size={12}
//                           className="text-gray-400 hover:text-red-400"
//                         />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </PopoverContent>
//           </Popover>
//         </div>
//       )}
//     </div>
//   );
// }

// // Helper function to get Tailwind color classes
// function getColorClass(color: string): string {
//   const colorMap: Record<string, string> = {
//     yellow: "bg-yellow-200",
//     green: "bg-green-200",
//     blue: "bg-blue-200",
//     pink: "bg-pink-200",
//     orange: "bg-orange-200",
//     red: "bg-red-200",
//     purple: "bg-purple-200",
//   };
//   return colorMap[color] || colorMap.yellow;
// }
