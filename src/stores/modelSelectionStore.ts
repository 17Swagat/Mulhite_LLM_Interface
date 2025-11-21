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
            parentChatModel: 'deepseek/deepseek-v3.1', //AI_MODELS[0].id,
            setParentChatModel: (model) => set({ parentChatModel: model }),

            explainSideChatModel: 'deepseek/deepseek-v3.1',//AI_MODELS[0].id,
            setExplainSideChatModel: (model) => set({ explainSideChatModel: model }),
        }),

        {
            name: 'selected-ai-model',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
