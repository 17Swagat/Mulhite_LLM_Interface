import { comments } from "../data";

export async function GET() {
    return Response.json(comments);
}

export async function POST(request: Request) {
    const req = await request.json()
    const new_comment = {
        id: (comments.length + 1),
        text: req['text']
    }
    comments.push(new_comment)
    return new Response(
        JSON.stringify(new_comment), {
        headers: { 'Content-Type': 'application/json' },
        status: 201
    })
}