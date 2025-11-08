import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useUserQuestionStore = create<
    {
        question: string,
        setQuestion: (question: string) => void,
    }
>()(
    persist(
        (set) => ({
            question: '',
            setQuestion: (question: string) => set({ question }),
        }),
        {
            name: 'user-questions',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)
