import { NextRequest } from "next/server";
import { createOllama } from "ollama-ai-provider-v2";
import { generateText } from 'ai';

const ollama = createOllama({
    baseURL: 'http://localhost:11434/api',
});

export async function GET(req: NextRequest, 
    { params }: { params: Promise<{ question: string }> }) {
    const { question } = await params;
    const { text } = await generateText({
        model: ollama('deepseek-r1:1.5b'),
        prompt: question
    });


    return Response.json({
        ai_message: text
    })
}