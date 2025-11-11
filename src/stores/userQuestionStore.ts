import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useUserQuestionStore = create<
    {
        question: string,
        setQuestion: (question: string) => void,
        sideChatQuestion: string,
        setSideChatQuestion: (question: string) => void,
    }
>()(
    persist(
        (set) => ({
            // Main-Chat
            question: '',
            setQuestion: (question: string) => set({ question }),
            // Side-Chat
            sideChatQuestion: '',
            setSideChatQuestion: (question: string) => set({ sideChatQuestion: question }),
        }),
        {
            name: 'user-questions',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)
