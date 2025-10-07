import { NextRequest } from "next/server";
import { createOllama } from "ollama-ai-provider-v2";
import { generateText, streamText } from 'ai';

const ollama = createOllama({
    baseURL: 'http://localhost:11434/api',
});

export async function GET(req: NextRequest, 
    { params }: { params: Promise<{ question: string }> }) {
    const { question } = await params;
    // const { text } = await generateText({
    
    const result = streamText({
        model: ollama('deepseek-r1:1.5b'),
        prompt: question,
        onError: ({error})=>{
            console.error("Error:", error);
        }
    });

    // console.log(result.reasoningText);

    return result.toUIMessageStream();
    // return Response.json({
    //     // ai_reason: result.reasoningText,
    //     ai_message: result.text
    // })
}