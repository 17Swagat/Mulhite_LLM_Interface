import { comments } from "../../data";

export async function GET(
    request: Request, 
    {params}: {params: Promise<{id: string}>}) {
    
    const {id} = await params;
    const comment_ =  comments.find((comment)=> 
        (comment.id).toString() == id)

    if (comment_ == null) {
        return Response.json(
            {
                message: "Item-Not Found"
            },
            {status: 404}
        );
    }

    return Response.json(
        comment_
    );
}