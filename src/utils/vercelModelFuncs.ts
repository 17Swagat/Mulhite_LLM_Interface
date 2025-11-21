'use server';
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
            'deepseek/',

            // OpenAI Models:
            'openai/',

            'minimax/minimax-m2',

            'google/',

            'anthropic/'
        ]
        if (selectedModels.some((modelName) => model.id.includes(modelName))) {
            // console.log(model)
            if (model.modelType == "language") {
                return model
            }
        }
    }).map((model): [typeof model, string] => {
        const termsIncludes = ['reasoning', 'thinking', 'R1', 'r1', 'think', 'minimax/minimax-m2']

        if (termsIncludes.some((term) => (model.description?.includes(term)) || (model.id.includes(term)))) {
            return [model, 'reasoning']
        } else {
            return [model, 'standard']
        }
    }).filter(([model, tag]) => {
        // 📌 Models to EXCLUDE
        const excludeModels = ['openai/gpt-oss-20b', 'openai/gpt-5-nano', 'openai/gpt-5-codex', 'google/gemini-2.5-flash-image', 'google/gemini-2.5-flash-image-preview']
        const excludeProviders = ['azure']
        if (!excludeModels.includes(model.id) && !excludeProviders.includes(model.specification.provider)) {
            return [model, tag]
        }

    })


    return filteredModels;
}

