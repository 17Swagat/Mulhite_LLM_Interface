// import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google'
import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { createOllama } from 'ollama-ai-provider-v2';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const ollama = createOllama({
  baseURL: 'http://localhost:11434/api',
});

export async function POST(req: Request) {
  try {
    // const { messages }: { messages: UIMessage[] } = await req.json();
    const { prompt } = await req.json();


    const result = streamText({
      // #1
      // model: openai('gpt-4o'), // NOTE: Need To buy API
      // #2
      // model: google("gemini-2.5-flash"), // NOTE: Works!!
      // #3
      model: ollama('deepseek-r1:1.5b'),
      prompt: prompt
      // messages: convertToModelMessages(messages),
    });

    // return result.toUIMessageStreamResponse();

    // Log token usage after streaming completes
    result.usage.then((usage) => {
      console.log({
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
      });
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming text:", error);
    return new Response("Failed to stream text", { status: 500 });
  }

}