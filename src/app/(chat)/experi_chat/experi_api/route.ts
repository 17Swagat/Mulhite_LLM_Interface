// export async function GET(){
//     return new Response("Hello from experi_api");
// }

// #0
import { NextRequest, NextResponse } from "next/server";
import { convertToModelMessages, generateText, streamText } from "ai"
import { UIMessage } from "ai";
import { createOllama } from "ollama-ai-provider-v2"

const ollama = createOllama({
    baseURL: 'http://localhost:11434/api',
});


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: ollama('deepseek-r1:1.5b'),
    system: "Responsd with lies. All answers must be factually wrong.",
    // system: 'You are a cool AI assistant. Respond each answer with a Hi Bro at the beginning. Provide full detailed answer.',
    messages: convertToModelMessages(messages),
  });


  return result.toUIMessageStreamResponse();
}