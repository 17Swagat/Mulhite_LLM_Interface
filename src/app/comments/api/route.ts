import { NextRequest } from "next/server";
import { comments } from "../data";

/*
[URL Query Parameter]:
*/

export async function GET(request: NextRequest) {
  const searchParam = request.nextUrl.searchParams;
  const query = searchParam.get('text')
  // returning comment containing `text`
  const filtered_comment = query ? comments.filter(comment => comment.text.includes(query)) : comments
  
  return Response.json(filtered_comment, { status: 200 })
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
