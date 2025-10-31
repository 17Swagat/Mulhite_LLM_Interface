import { AI_MODELS } from '@/constants/models';
import { google } from '@ai-sdk/google'
// import { saveChat } from '@/utils/chat-store';
import { streamText, UIMessage, convertToModelMessages, uiMessageChunkSchema, LanguageModel } from 'ai';
import { createOllama } from 'ollama-ai-provider-v2';
import { v7 as uuidv7 } from 'uuid';

// export const maxDuration = 30;

const ollama = createOllama({
    baseURL: 'http://localhost:11434/api',
    compatibility: 'strict',
});

type ExtendedUIMessage = UIMessage & {
    metadata?: {
        chatId?: string;
    };
};

export async function POST(req: Request) {
    try {
        const req_ = await req.json();
        // console.log(Object.keys(req_))
        const { messages, chatId: providedChatId, model: ai_model }: {
            messages: ExtendedUIMessage[];
            chatId?: string
            model: string
        } = req_;

        console.log('AI Model Requested: ' + ai_model)

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

        let CURRENT_MODEL: LanguageModel;
        if (ai_model == AI_MODELS[0].id) {
            CURRENT_MODEL = ollama('deepseek-r1:1.5b');
        } else if (ai_model == AI_MODELS[1].id) {
            CURRENT_MODEL = google("gemini-2.5-flash-lite-preview-09-2025");
        } else {
            // This Condition Won't Happen Normally (99.9%) - but just in case:
            CURRENT_MODEL = ollama('deepseek-r1:1.5b'); // default
        }

        console.log('Current Model ID: ' + CURRENT_MODEL.modelId)

        // Normalize to UIMessage with parts[]; convertToModelMessages expects parts-based UI messages
        let prompt;
        try {
            const normalized = (messages as any[]).map((m: any) => {
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
            });

            prompt = convertToModelMessages(normalized);
        } catch (e) {
            console.error('convertToModelMessages failed. Sample message:',
                Array.isArray(messages) && messages.length > 0 ? messages[0] : null,
                e
            );
            return new Response("Invalid messages payload", { status: 400 });
        }

        const result = streamText({
            prompt,
            // model: google("gemini-2.5-flash-lite-preview-09-2025"),
            model: CURRENT_MODEL,
            // model: ollama('deepseek-r1:1.5b'),
            // providerOptions: { ollama: { think: true } },
        });


        return result.toUIMessageStreamResponse({
            originalMessages: messages,
            onFinish: ({ messages }) => {
                // saveChat({ chatId: chatId, messages })
            },
            sendReasoning: true
        });

    } catch (error) {
        console.error("Error streaming text:", error);
        return new Response("Failed to stream text", { status: 500 });
    }

}
