import { comments } from "@/app/comments/data";
// import { comments } from "../../data";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }) {

        console.log(comments);

    const { id } = await params;
    const comment_ = comments.find((comment) =>
        (comment.id).toString() == id)

    if (comment_ == null) {
        return Response.json(
            {
                message: "Item-Not Found"
            },
            { status: 404 }
        );
    }

    return Response.json(
        comment_
    );
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();

    if (body == null) {
        return Response.json({
            message: "Body Not Provided!!"
        }, { status: 400 });
    }

    try {
        const newText = body['text'];
        const index = comments.findIndex((item) => (item.id.toString() == id))
        // comments[index].text = newText;
        comments[index].text = newText;
        // console.log(index)
        // console.log(typeof index)
        console.log(comments)

        return Response.json(
            comments[index],
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            })


    } catch (error) {
        return Response.json({
            message: "Invalid Body!!"
        }, { status: 400 });
    }

}