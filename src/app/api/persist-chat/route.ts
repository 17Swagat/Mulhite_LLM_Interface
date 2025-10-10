// #1
import { google } from '@ai-sdk/google'
import { saveChat } from '@/utils/chat-store';
import { streamText, UIMessage, convertToModelMessages, uiMessageChunkSchema } from 'ai';
import { createOllama } from 'ollama-ai-provider-v2';
import {v7 as uuidv7} from 'uuid';

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
    // const { messages}: { messages: UIMessage[]; } = req_;// await req.json();
    const { messages}: { messages: ExtendedUIMessage[]; } = req_;

    const chatId = messages?.[0]?.metadata?.chatId ?? uuidv7();

    const result = streamText({
      // model: openai('gpt-4o'), // NOTE: Need To buy API
      // model: google("gemini-2.5-flash"), // NOTE: Works!!
      model: ollama('deepseek-r1:1.5b'),
      providerOptions: { ollama: { think: true } },
      prompt: convertToModelMessages(messages),
    });

    
    return result.toUIMessageStreamResponse({
        originalMessages: messages,
        onFinish: ({messages})=>{
            console.log('Saving chat with ID:', chatId);
            saveChat({chatId: chatId, messages})
        },
        sendReasoning: true
    });

  } catch (error) {
    console.error("Error streaming text:", error);
    return new Response("Failed to stream text", { status: 500 });
  }

}