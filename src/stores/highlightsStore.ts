import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface HighlightRange {
    range: Range;
}

interface HighlightsStore {
    highlights: HighlightRange[];
    setHighlights: (highlights: HighlightRange[]) => void;
    addHighlight: (highlight: HighlightRange) => void;
}

export const useHighlightsStore = create<HighlightsStore>()(
    persist(
        (set, get) => ({
            highlights: [],
            setHighlights: (highlights) => set({ highlights }),
            addHighlight: (highlight) => set({
                highlights: [...get().highlights, highlight]
            }),
        }),
        {
            name: 'highlights-storage',
            storage: createJSONStorage(() => sessionStorage),
        },
    ),
)

