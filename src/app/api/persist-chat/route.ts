// #1
import { google } from '@ai-sdk/google'
import { saveChat } from '@/utils/chat-store';
import { streamText, UIMessage, convertToModelMessages, uiMessageChunkSchema } from 'ai';
import { createOllama } from 'ollama-ai-provider-v2';

// export const maxDuration = 30;

const ollama = createOllama({
  baseURL: 'http://localhost:11434/api',
  compatibility: 'strict',
});

export async function POST(req: Request) {
  try {
    const req_ = await req.json();
    // console.log(Object.keys(req_));
    // console.log(req_.chatId);
    // console.log(req_.id);

    const { messages}: { messages: UIMessage[]; chatId: string } = req_;// await req.json();

    const chatId = messages?.[0]?.metadata?.chatId; 

    const result = streamText({
      // model: openai('gpt-4o'), // NOTE: Need To buy API
      // model: google("gemini-2.5-flash"), // NOTE: Works!!
      model: ollama('deepseek-r1:1.5b'),
      providerOptions: { ollama: { think: true } },
      prompt: convertToModelMessages(messages),
    });


    // Log token usage after streaming completes
    /*result.usage.then((usage) => {
      console.log({
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
      });
    });*/


    
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