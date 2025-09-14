import Link from "next/link";

type Props = {
    params: Promise<{articleId: string}>
}

export default function Articles({params} : {params: Promise<{articleId: string}>}) {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-pink-600 text-white gap-4">
            <h1 className="text-6xl">Articles</h1>
            <h2 className="text-4xl">Article in English</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. At fuga esse cupiditate doloribus aliquam perferendis sint et molestias quis inventore nesciunt cum expedita non vero dignissimos sit voluptatem magni qui animi, dolorem sequi dolore eveniet. Ducimus non autem amet quidem neque repudiandae, fuga explicabo illum culpa quasi, cum magni excepturi.</p>
        </div>
    );
}
