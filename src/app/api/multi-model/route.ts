import { AI_MODELS } from '@/constants/models';
import { google } from '@ai-sdk/google'
import { deepseek } from '@ai-sdk/deepseek'
import { mistral } from '@ai-sdk/mistral'
// import { saveChat } from '@/utils/chat-store';
import { streamText, UIMessage, convertToModelMessages, uiMessageChunkSchema, LanguageModel } from 'ai';
import { createOllama } from 'ollama-ai-provider-v2';
import { v7 as uuidv7 } from 'uuid';

import { gateway } from 'ai';

// export const maxDuration = 30;
// const ollama = createOllama({
//     baseURL: 'http://localhost:11434/api',
//     compatibility: 'strict',
// });

type ExtendedUIMessage = UIMessage & {
    metadata?: {
        chatId?: string;
    };
};


export async function POST(req: Request) {
    try {
        const req_ = await req.json();
        const {
            messages,
            chatId: providedChatId,
            model: ai_model,
            parentMessages,
            parentConversationId,
            reasoning
        }: {
            messages: ExtendedUIMessage[];
            chatId?: string
            model: string
            parentMessages?: ExtendedUIMessage[];
            parentConversationId?: string;
            reasoning?: boolean;
        } = req_;


        if (parentConversationId) {
            console.log('ExplainSideChat with parent conversation:', parentConversationId);
        }

        // Use provided chatId or generate a new one
        const chatId = providedChatId ?? messages?.[0]?.metadata?.chatId ?? uuidv7();

        // If no messages provided:
        if (!messages || messages.length === 0) {
            console.log('Creating empty chat file with ID:', chatId);
            return new Response(JSON.stringify({ chatId, success: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }


        // Normalize to UIMessage with parts[]; convertToModelMessages expects parts-based UI messages
        let prompt;
        try {
            // Helper function to normalize a message
            const normalizeMessage = (m: any): UIMessage => {
                const hasParts = Array.isArray(m.parts);
                const parts = hasParts
                    ? m.parts
                    : Array.isArray(m.content)
                        ? m.content
                        : typeof m.content === 'string'
                            ? [{ type: 'text', text: m.content }]
                            : [];

                return {
                    id: m.id ?? uuidv7(),
                    role: m.role,
                    parts,
                    metadata: m.metadata,
                } satisfies UIMessage;
            };

            // If this is an ExplainSideChat request with parent context, prepend parent messages
            let allMessages = messages;

            if (parentMessages && parentMessages.length > 0) {
                // Add a system message to provide context
                const contextMessage: UIMessage = {
                    id: uuidv7(),
                    role: 'system',
                    parts: [{
                        type: 'text',
                        text: 'The following messages are from the parent conversation. Use them as context to answer the user\'s questions about specific text selections.'
                    }],
                };

                // Combine: context message + parent messages + current messages
                allMessages = [
                    contextMessage,
                    ...parentMessages.map(normalizeMessage),
                    ...messages
                ] as ExtendedUIMessage[];
            }

            const normalized = (allMessages as any[]).map(normalizeMessage);
            prompt = convertToModelMessages(normalized);
        } catch (e) {
            console.error('convertToModelMessages failed. Sample message:',
                Array.isArray(messages) && messages.length > 0 ? messages[0] : null,
                e
            );
            return new Response("Invalid messages payload", { status: 400 });
        }

        console.log('REASONING - VALUE-DEP: ' + reasoning)
        const result = streamText({
            prompt,
            // model: google("gemini-2.5-flash-lite-preview-09-2025"),
            // model: ollama('deepseek-r1:1.5b'),
            model: gateway(ai_model),//ai_model, //CURRENT_MODEL,
            providerOptions:
                ((reasoning)
                ) ? {
                    // ollama: {
                    //     think: true
                    // },

                    gateway: {
                        // what are the different parameters that we could give in here?
                    },


                    google: {
                        includeThoughts: reasoning,
                    },

                    deepseek: {
                        reasoning: reasoning,
                    },

                    mistral: {

                    }

                } : undefined
        }
        );

        // Getting [Answer-cost] from provider metadata:
        const data = await result.providerMetadata;
        const answerCost = (data!.gateway as any).cost


        return result.toUIMessageStreamResponse({
            originalMessages: messages,
            sendReasoning: reasoning, // REVIEW:

            // Sending metadata when streaming starts:
            messageMetadata: ({ part }): Record<string, string> | undefined => {
                if (part.type === 'start') {
                    return { model: ai_model }
                }
                if (part.type === 'finish') {
                    return { model: ai_model, cost: answerCost }
                }
            },
        });

    } catch (error) {
        console.error("Error streaming text:", error);
        return new Response("Failed to stream text", { status: 500 });
    }

}
