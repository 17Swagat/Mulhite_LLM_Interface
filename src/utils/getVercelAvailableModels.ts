// 'use server';

import { gateway } from "ai";

export async function getVercelAvailableModels() {
    /**
     * CURRENTLY ONLY WANT THE TEXT-BASED MODELS ONLY.
     */
    const availableModels = await gateway.getAvailableModels();

    const filteredModels = availableModels.models.filter((model) => {
        /*if (
            model.id.includes("gpt-4") ||
            model.id.includes("claude") ||
            model.id.includes("grok") ||
            model.id.includes("llama") ||
            model.id.includes("deepseek") ||
            model.id.includes("mistral") ||
            model.id.includes("gemini") ||
            model.id.includes("google")
        ) {

            const descrip: string = model.description ?? ''
            const descriptSubStr = ['image', 'agent', 'video', 'audio', 'vision']
            if (model.modelType === 'language' &&
                !descriptSubStr.some((sub) => descrip.includes(sub))
            ) {
                return model;
            }
        }*/

        const selectedModels = [
            'magistral-small-2506', 'magistral-medium-2506', 'mistral/ministral-3b'
        ]
        if (selectedModels.some((modelName) => model.id.includes(modelName))) {
            return model;
        }
    })



    return filteredModels;
}

