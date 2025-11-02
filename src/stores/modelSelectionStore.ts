import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import { AI_MODELS } from '@/constants/models';

export const useSelectedAIModelStore = create<{
    parentChatModel: string;
    setParentChatModel: (model: string) => void;
    explainSideChatModel: string;
    setExplainSideChatModel?: (model: string) => void;
}>()(

    persist(
        (set) => ({
            parentChatModel: AI_MODELS[0].id,
            setParentChatModel: (model) => set({ parentChatModel: model }),
            explainSideChatModel: AI_MODELS[0].id,
            setExplainSideChatModel: (model) => set({ explainSideChatModel: model }),
        }),

        {
            name: 'selected-ai-model',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
