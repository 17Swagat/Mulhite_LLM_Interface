'use client'
import { useEffect, useRef, useState } from "react"
import { ShareIcon, Highlighter, HighlighterIcon } from 'lucide-react'

interface Type_SelectedTextRectInfo {
    x: number;
    y: number;
    width?: number;
    height?: number;
    bottom?: number;
    top?: number;
    left?: number;
    right?: number;
}

export default function Experiment_TextHighlightPage() {

    const [selectedText, setSelectedText] = useState<string>('')
    const [selectedTextRect, setSelectedTextRect] = useState<DOMRect | null>(null)

    const textContainerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        textContainerRef.current?.addEventListener('selectionchange', (e) => {
            const selection = document.getSelection()
            const selection_Text = selection?.toString() || ''
            if (selection_Text) {
                const selection_TextRect = selection?.getRangeAt(0).getBoundingClientRect() ?? null
                setSelectedText(selection_Text)
                setSelectedTextRect(selection_TextRect)
                return;
            }
            setSelectedText('')
            setSelectedTextRect(null)
        })
    }, [])

    return (
        <div>
            {/* <div className="w-[80px] h-[25px] bg-amber-600 flex" style={{
                visibility: selectedTextRect ? 'visible' : 'hidden',
                position: 'absolute',
                top: selectedTextRect ? (selectedTextRect.top + window.scrollY - 30) + 'px' : '0px',
                left: selectedTextRect ? (selectedTextRect.left + (selectedTextRect.width / 2) - (40 / 2)) + 'px' : '0px',
            }}>
                <div className="bg-cyan-400">
                    <HighlighterIcon size={30} />
                </div>
                <div className="bg-purple-400">
                    <ShareIcon size={30} />
                </div>
            </div> */}
            <div
                className="flex items-center gap-1 p-0.5 rounded-full bg-white/90 shadow-lg backdrop-blur-sm border border-gray-200"
                style={{
                    visibility: selectedTextRect ? 'visible' : 'hidden',
                    position: 'absolute',
                    top: selectedTextRect ? `${selectedTextRect.top + window.scrollY + 20}px` : '0px',
                    left: selectedTextRect ? `${selectedTextRect.left + (selectedTextRect.width / 2) - 80}px` : '0px',
                    // top: selectedTextRect ? (selectedTextRect.top + window.scrollY - 30) + 'px' : '0px',
                    // left: selectedTextRect ? (selectedTextRect.left + (selectedTextRect.width / 2) - (40 / 2)) + 'px' : '0px',
                    opacity: selectedTextRect ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    zIndex: 1000,
                }}
            >
                {/* Highlight Button */}
                <button
                    type="button"
                    className="p-1.5 rounded-full hover:bg-amber-100 transition-colors"
                    aria-label="Highlight"
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

                {/* Optional: Add Button */}
                {/* <button
                    className="p-1.5 rounded-full hover:bg-cyan-100 transition-colors"
                    aria-label="Add Note"
                >
                    <PlusIcon size={20} className="text-cyan-600" />
                </button> */}
            </div>


            <div ref={textContainerRef}>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia vitae vel perferendis aliquam nemo blanditiis sequi facilis soluta voluptas veritatis.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi aperiam magni cupiditate saepe, quibusdam reprehenderit provident, pariatur libero voluptatum nihil voluptas! Aut aspernatur nostrum quo minima? Soluta optio voluptatem qui repellat, suscipit illo fugiat delectus, veritatis incidunt obcaecati earum iste pariatur esse aliquid rerum excepturi, aliquam at perspiciatis veniam nulla.</p>
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Impedit harum ut, asperiores blanditiis laudantium quod. Dolore voluptatum ducimus quis. Necessitatibus itaque aspernatur iste explicabo quidem est asperiores nostrum atque ipsum quia in ea possimus eos, soluta debitis harum doloribus non recusandae dolorum placeat eligendi earum saepe reprehenderit! Dolor nobis nemo enim dicta! Vel, commodi sed officia dolorem nisi a dicta aliquid expedita repudiandae voluptas sit deserunt laudantium, ipsam, unde ipsum.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem quas quia dolorum in officia accusamus voluptate nobis, officiis impedit omnis laudantium consequuntur tempore tenetur. Consectetur aperiam harum magni ipsum amet in delectus obcaecati tempora velit similique dolore debitis optio, molestias consequatur ex sint iure sapiente quaerat, nemo maxime aspernatur voluptatum. Iste non vero voluptatem facilis ad modi, tenetur ipsa nesciunt fugit quaerat, porro, doloremque aliquam atque sed sequi culpa suscipit. Vel quia nostrum cumque maxime atque est totam aspernatur nihil laudantium? Expedita, consequuntur itaque ad molestiae voluptates sunt a libero, velit necessitatibus explicabo illo ipsum mollitia ullam ipsa, repellat quisquam.</p>
                <hr />
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Omnis magnam, rem vitae placeat doloremque, distinctio, maiores vel ad possimus atque dolorem assumenda nesciunt eligendi aliquid ipsa! Accusantium ullam minus eum labore quas quasi dolorum, asperiores iste cum ex deleniti, doloremque a natus quia, molestias veritatis. Beatae molestiae laborum qui impedit?</p>

            </div>

        </div>
    )
}