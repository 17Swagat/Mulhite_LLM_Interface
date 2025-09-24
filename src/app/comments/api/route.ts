import { comments } from "../data";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const task = searchParams.get("task");
	if (task === 'comments-count') {
		return Response.json({
			"comments-count": comments.length
		});
	}
	return Response.json(comments);
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
