import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// TODO: "Will have to delete and remove AI_MODELS from constants and import from here instead"
// import { AI_MODELS } from '@/constants/models';

export const useSelectedAIModelStore = create<{
    parentChatModel: string;
    setParentChatModel: (model: string) => void;


    explainSideChatModel: string;
    setExplainSideChatModel?: (model: string) => void;
}>()(

    persist(
        (set) => ({
            parentChatModel: 'mistral/ministral-3b',
            setParentChatModel: (model) => set({ parentChatModel: model }),

            explainSideChatModel: 'mistral/ministral-3b',
            setExplainSideChatModel: (model) => set({ explainSideChatModel: model }),
        }),

        {
            name: 'selected-ai-model',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
