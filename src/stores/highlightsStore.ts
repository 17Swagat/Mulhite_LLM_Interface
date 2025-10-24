import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface Highlights {
    rangeInfo: Range;
}


interface HighlightsStore {
    // converstionId:
    // chatId:
    highlights: Highlights[] //Hightlights[]

    // Actions
    setHighlights: (highlights: Highlights[]) => void
    addHighlight: (highlight: Highlights) => void
    // clearHighlights: () => void
}

export const useHighlightsStore = create<HighlightsStore>()(
    persist(
        (set, get) => ({
            highlights: [],
            setHighlights: (highlights) => set({ highlights }),
            addHighlight: (highlight) => set(
                {
                    highlights: [...get().highlights, highlight]
                }),
            // clearHighlights: () => set({ highlights: [] }),
        }),
        {
            name: 'highlights-storage',
            storage: createJSONStorage(() => sessionStorage),
        },
    ),
)

