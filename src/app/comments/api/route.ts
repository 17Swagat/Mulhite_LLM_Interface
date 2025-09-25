import { comments } from "../data";

export async function GET(request: Request) {
  return Response.json(comments, {status: 200})
  
}

export async function POST(request: Request) {
  const req = await request.json();
  const new_comment = {
    id: comments.length + 1,
    text: req["text"],
  };
  comments.push(new_comment);
  return new Response(JSON.stringify(new_comment), {
    headers: { "Content-Type": "application/json" },
    status: 201,
  });
}
