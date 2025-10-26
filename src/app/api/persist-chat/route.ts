// #1
import { google } from '@ai-sdk/google'
import { saveChat } from '@/utils/chat-store';
import { streamText, UIMessage, convertToModelMessages, uiMessageChunkSchema } from 'ai';
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
    const { messages, chatId: providedChatId }: {
      messages: ExtendedUIMessage[];
      chatId?: string
    } = req_;

    // Use provided chatId or generate a new one
    const chatId = providedChatId ?? messages?.[0]?.metadata?.chatId ?? uuidv7();

    // If no messages provided, just create an empty chat file
    if (!messages || messages.length === 0) {
      console.log('Creating empty chat file with ID:', chatId);
      await saveChat({ chatId, messages: [] });
      return new Response(JSON.stringify({ chatId, success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = streamText({
      // model: openai('gpt-4o'), // NOTE: Need To buy API
      model: google("gemini-2.5-flash-lite-preview-09-2025"), // NOTE: Works!!
      // #3
      // model: ollama('deepseek-r1:1.5b'),
      // providerOptions: { ollama: { think: true } },

      prompt: convertToModelMessages(messages),
    });


    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      onFinish: ({ messages }) => {
        // console.log('Saving chat with ID:', chatId);
        saveChat({ chatId: chatId, messages })
      },
      sendReasoning: true
    });

  } catch (error) {
    console.error("Error streaming text:", error);
    return new Response("Failed to stream text", { status: 500 });
  }

}
