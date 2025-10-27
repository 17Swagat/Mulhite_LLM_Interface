// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import { Copy } from 'lucide-react'

// interface Position {
//     x: number;
//     y: number;
// }

// export const  HighlightContextMenu  = () => {
//     const [visible, setVisible] = useState(false);
//     const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
//     const menuRef = useRef<HTMLDivElement | null>(null);

//     useEffect(() => {
//         const handleMouseUp = (e: MouseEvent) => {
//             const selection = window.getSelection();
//             const selectedText = selection?.toString().trim();

//             if (selectedText) {
//                 const range = selection!.getRangeAt(0);
//                 const rect = range.getBoundingClientRect();

//                 setPosition({
//                     x: rect.left + window.scrollX + rect.width / 2,
//                     y: rect.top + window.scrollY - 40, // position above text
//                 });
//                 setVisible(true);
//             } else {
//                 setVisible(false);
//             }
//         };

//         const handleClickOutside = (e: MouseEvent) => {
//             if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
//                 setVisible(false);
//             }
//         };

//         document.addEventListener("mouseup", handleMouseUp);
//         document.addEventListener("mousedown", handleClickOutside);

//         return () => {
//             document.removeEventListener("mouseup", handleMouseUp);
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, []);

//     const handleAction = (action: string) => {
//         const selection = window.getSelection()?.toString() ?? "";
//         alert(`${action} -> "${selection}"`);
//         setVisible(false);
//     };

//     return (
//         <>
//             {visible && (
//                 <div
//                     ref={menuRef}
//                     style={{
//                         position: "absolute",
//                         top: position.y,
//                         left: position.x,
//                         transform: "translate(-50%, -20%)",
//                         background: "#222",
//                         color: "white",
//                         padding: "6px 10px",
//                         borderRadius: "8px",
//                         display: "flex",
//                         gap: "8px",
//                         fontSize: "14px",
//                         zIndex: 1000,
//                         boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
//                         userSelect: "none",
//                     }}
//                 >
//                     <button
//                         onClick={() => handleAction("Copy")}
//                         style={buttonStyle}
//                     >
//                         Copy
//                     </button>
//                     <button
//                         onClick={() => handleAction("Highlight")}
//                         style={buttonStyle}
//                     >
//                         Highlight
//                     </button>
//                     <button
//                         onClick={() => handleAction("Comment")}
//                         style={buttonStyle}
//                     >
//                         {/* Comment */}
//                         <Copy size={14} />
//                     </button>
//                 </div>
//             )}
//         </>
//     );
// };

// const buttonStyle: React.CSSProperties = {
//     background: "transparent",
//     color: "white",
//     border: "none",
//     cursor: "pointer",
//     padding: "4px 6px",
//     borderRadius: "4px",
// };

