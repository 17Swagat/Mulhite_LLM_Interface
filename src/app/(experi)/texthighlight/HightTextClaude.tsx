// #2
'use client'
import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { MessageSquare, Link, Copy, Bold, Italic, Highlighter } from 'lucide-react';

interface Position {
    x: number;
    y: number;
}

interface SelectionMenuAction {
    icon: ReactNode;
    label: string;
    onClick: (selectedText: string) => void;
}

interface TextSelectionMenuProps {
    children: ReactNode;
    actions?: SelectionMenuAction[];
    className?: string;
    menuClassName?: string;
}

export const TextSelectionMenu: React.FC<TextSelectionMenuProps> = ({
    children,
    actions,
    className = '',
    menuClassName = ''
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const [selectedText, setSelectedText] = useState('');
    const menuRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const defaultActions: SelectionMenuAction[] = [
        {
            icon: <Copy size={18} />,
            label: 'Copy',
            onClick: (text) => {
                navigator.clipboard.writeText(text).catch(console.error);
                console.log('Copied to clipboard!');
            }
        },
        {
            icon: <MessageSquare size={18} />,
            label: 'Comment',
            onClick: (text) => {
                console.log('Comment on:', text);
            }
        },
        {
            icon: <Highlighter size={18} />,
            label: 'Highlight',
            onClick: (text) => {
                console.log('Highlight:', text);
            }
        }
    ];

    const menuActions = actions || defaultActions;

    const handleSelectStart = () => {
        setIsVisible(false);
        setSelectedText('');
    };

    const handleSelectEnd = () => {
        setTimeout(() => {
            const selection = document.getSelection();
            if (!selection || selection.rangeCount === 0) {
                setIsVisible(false);
                setSelectedText('');
                return;
            }

            const text = selection.toString().trim();
            if (!text || text.length === 0) {
                setIsVisible(false);
                setSelectedText('');
                return;
            }

            const range = selection.getRangeAt(0);
            const startContainer = range.startContainer.nodeType === Node.TEXT_NODE
                ? (range.startContainer.parentElement || range.startContainer.parentNode)
                : range.startContainer;
            const endContainer = range.endContainer.nodeType === Node.TEXT_NODE
                ? (range.endContainer.parentElement || range.endContainer.parentNode)
                : range.endContainer;

            if (!containerRef.current?.contains(startContainer as Node) ||
                !containerRef.current?.contains(endContainer as Node)) {
                setIsVisible(false);
                setSelectedText('');
                return;
            }

            const rect = range.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) {
                setIsVisible(false);
                setSelectedText('');
                return;
            }

            const menuWidth = 140;
            const menuHeight = 40;
            let x = rect.left + rect.width / 2 - menuWidth / 2;
            let y = rect.top - menuHeight - 10;

            // If it would be off-screen above, place below
            if (y < 10) {
                y = rect.bottom + 10;
            }

            x = Math.max(10, Math.min(x, window.innerWidth - menuWidth - 10));
            y = Math.max(10, y);

            setPosition({ x, y });
            setSelectedText(text);
            setIsVisible(true);
        }, 0);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsVisible(false);
                setSelectedText('');
            }
        };

        document.addEventListener('selectstart', handleSelectStart);
        document.addEventListener('mouseup', handleSelectEnd);
        if (isVisible) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('selectstart', handleSelectStart);
            document.removeEventListener('mouseup', handleSelectEnd);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isVisible]);

    return (
        <>
            <div ref={containerRef} className={className}>
                {children}
            </div>

            {isVisible && (
                <div
                    ref={menuRef}
                    className={`fixed z-50 bg-slate-900 text-white rounded-lg shadow-2xl px-3 py-2 flex items-center gap-1 transition-all duration-200 ease-out ${menuClassName}`}
                    style={{
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                    }}
                >
                    {menuActions.map((action, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && (
                                <div className="w-px h-6 bg-slate-700 mx-1" />
                            )}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    action.onClick(selectedText);
                                    setIsVisible(false);
                                }}
                                className="p-2 hover:bg-slate-700 rounded transition-colors"
                                title={action.label}
                            >
                                {action.icon}
                            </button>
                        </React.Fragment>
                    ))}
                </div>
            )}
        </>
    );
};


// 'use client'
// import React, { useState, useEffect, useRef, ReactNode } from 'react';
// import { MessageSquare, Link, Copy, Bold, Italic, Highlighter } from 'lucide-react';

// interface Position {
//     x: number;
//     y: number;
// }

// interface SelectionMenuAction {
//     icon: ReactNode;
//     label: string;
//     onClick: (selectedText: string) => void;
// }

// interface TextSelectionMenuProps {
//     children: ReactNode;
//     actions?: SelectionMenuAction[];
//     className?: string;
//     menuClassName?: string;
// }

// export const TextSelectionMenu: React.FC<TextSelectionMenuProps> = ({
//     children,
//     actions,
//     className = '',
//     menuClassName = ''
// }) => {
//     const [isVisible, setIsVisible] = useState(false);
//     const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
//     const [selectedText, setSelectedText] = useState('');
//     const menuRef = useRef<HTMLDivElement>(null);
//     const containerRef = useRef<HTMLDivElement>(null);

//     const defaultActions: SelectionMenuAction[] = [
//         {
//             icon: <Copy size={18} />,
//             label: 'Copy',
//             onClick: (text) => {
//                 navigator.clipboard.writeText(text);
//                 alert('Copied!');
//             }
//         },
//         {
//             icon: <MessageSquare size={18} />,
//             label: 'Comment',
//             onClick: (text) => {
//                 console.log('Comment on:', text);
//             }
//         },
//         {
//             icon: <Highlighter size={18} />,
//             label: 'Highlight',
//             onClick: (text) => {
//                 console.log('Highlight:', text);
//             }
//         }
//     ];

//     const menuActions = actions || defaultActions;

//     useEffect(() => {
//         const handleSelection = () => {
//             const selection = window.getSelection();
//             const text = selection?.toString().trim();

//             if (text && text.length > 0 && selection?.anchorNode && containerRef.current?.contains(selection.anchorNode)) {
//                 setSelectedText(text);
//                 const range = selection.getRangeAt(0);
//                 const rect = range.getBoundingClientRect();

//                 const menuWidth = 300;
//                 const menuHeight = 50;
//                 const x = rect.left + (rect.width / 2) - (menuWidth / 2);
//                 const y = rect.top - menuHeight - 10 + window.scrollY;

//                 setPosition({
//                     x: Math.max(10, Math.min(x, window.innerWidth - menuWidth - 10)),
//                     y: Math.max(10, y)
//                 });
//                 setIsVisible(true);
//             } else if (!text || text.length === 0) {
//                 setIsVisible(false);
//             }
//         };

//         const handleClickOutside = (e: MouseEvent) => {
//             if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
//                 const selection = window.getSelection();
//                 if (!selection?.toString().trim()) {
//                     setIsVisible(false);
//                 }
//             }
//         };

//         document.addEventListener('mouseup', handleSelection);
//         document.addEventListener('mousedown', handleClickOutside);
//         document.addEventListener('selectionchange', handleSelection);

//         return () => {
//             document.removeEventListener('mouseup', handleSelection);
//             document.removeEventListener('mousedown', handleClickOutside);
//             document.removeEventListener('selectionchange', handleSelection);
//         };
//     }, []);

//     return (
//         <>
//             <div ref={containerRef} className={className}>
//                 {children}
//             </div>

//             {isVisible && (
//                 <div
//                     ref={menuRef}
//                     className={`fixed z-50 transition-all duration-200 ease-out ${menuClassName}`}
//                     // style={{
//                     //     left: `${position.x}px`,
//                     //     top: `${position.y}px`,
//                     //     opacity: isVisible ? 1 : 0,
//                     //     transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
//                     // }}

//                     style={{
//                         position: "absolute",
//                         top: position.y,
//                         left: position.x,
//                         transform: "translate(10%, -10%)",
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
//                     <div className="bg-slate-900 text-white rounded-lg shadow-2xl px-3 py-2 flex items-center gap-1">
//                         {menuActions.map((action, index) => (
//                             <React.Fragment key={index}>
//                                 {index > 0 && index % 3 === 0 && (
//                                     <div className="w-px h-6 bg-slate-700 mx-1" />
//                                 )}
//                                 <button
//                                     onClick={() => {
//                                         action.onClick(selectedText);
//                                         setIsVisible(false);
//                                     }}
//                                     className="p-2 hover:bg-slate-700 rounded transition-colors"
//                                     title={action.label}
//                                 >
//                                     {action.icon}
//                                 </button>
//                             </React.Fragment>
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };