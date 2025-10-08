import { google } from '@ai-sdk/google'
import { saveChat } from '@/utils/chat-store';
import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { createOllama } from 'ollama-ai-provider-v2';

// export const maxDuration = 30;

const ollama = createOllama({
  baseURL: 'http://localhost:11434/api',
});

export async function POST(req: Request) {
  try {
    const { messages, chatId }: { messages: UIMessage[]; chatId: string } = await req.json();
    const result = streamText({
      // model: openai('gpt-4o'), // NOTE: Need To buy API
      // model: google("gemini-2.5-flash"), // NOTE: Works!!
      model: ollama('deepseek-r1:1.5b'),
      prompt: convertToModelMessages(messages),
    });


    // Log token usage after streaming completes
    result.usage.then((usage) => {
      console.log({
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
      });
    });


    return result.toUIMessageStreamResponse({
        originalMessages: messages,
        onFinish: ({messages})=>{
            // saveChat({chatId: messages[0].metadata?.chatId || 'unknown', messages});
            saveChat({chatId: chatId, messages})
            // saveChat({chatId, messages})
        }
    });

  } catch (error) {
    console.error("Error streaming text:", error);
    return new Response("Failed to stream text", { status: 500 });
  }

}