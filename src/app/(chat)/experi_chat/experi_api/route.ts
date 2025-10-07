// export async function GET(){
//     return new Response("Hello from experi_api");
// }

// #0
import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai"
import { createOllama } from "ollama-ai-provider-v2"

const ollama = createOllama({
    baseURL: 'http://localhost:11434/api',
});

export async function GET(
    req: NextRequest,
)// params: Promise<{ prompt: string }>) 
{
    // const { prompt } = await params;
    const prompt = "What is love?";
    const { text } = await generateText({
        model: ollama('deepseek-r1:1.5b'),
        prompt
    });

    return new Response(text);
    // return NextResponse.json(
        // { ai_message: text }
        // { ai_message: text }, { status: 200 }
    // );
}