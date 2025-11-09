// 'use server';

import { gateway } from "ai";

export async function getVercelAvailableModels() {
    /**
     * CURRENTLY ONLY WANT THE TEXT-BASED MODELS ONLY.
     */
    const availableModels = await gateway.getAvailableModels();

    const filteredModels = availableModels.models.filter((model) => {
        const selectedModels = [
            // Mistral Models:
            'magistral-small-2506', 'magistral-medium-2506', 'mistral/ministral-3b',

            // DeepSeek Models:
            'deepseek/'
        ]
        if (selectedModels.some((modelName) => model.id.includes(modelName))) {
            // console.log(model)
            return model
        }
    })
        .map((model) => {
            const termsIncludes = ['reasoning', 'thinking']
            if (termsIncludes.some((term) => model.description?.includes(term))) {
                return [model, 'reasoning']
            } else {
                return [model, 'standard']
            }
        })


    return filteredModels;
}
