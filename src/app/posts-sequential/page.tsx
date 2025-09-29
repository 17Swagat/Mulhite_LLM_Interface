import Link from "next/link";

export const dynamic = 'force-dynamic'; // this page will be revalidated on every request

type Post = {
    userId: number,
    id: number;
    title: string;
    body: string;
};

export default async function PostSequentialPage(){
    const RANDOM_NUM = Math.floor(Math.random() * 4);
    console.log('Random Num:', RANDOM_NUM);
    let API_ROUTE; //: string;
    if (RANDOM_NUM == 0){
        // Intentional Error Case
        API_ROUTE = 'https://jsonplacehold_er_.typicode.com/posts'
    } else {
        API_ROUTE = 'https://jsonplaceholder.typicode.com/posts'
    }

    const response = await fetch(API_ROUTE).catch((error: Error)=>{
        throw error;
    })
    const posts = await response?.json() ?? []
    return (
        <div className="w-screen bg-purple-600/30 p-10">
            <h1 className="text-4xl underline">Post List</h1>
            <h1 className="text-4xl underline">Data: {new Date().toLocaleTimeString()}</h1>
            <ul className="mt-5 space-y-3">
                {posts.map((post: Post) => (
                    <li key={post.id} className="p-5 bg-white/55 rounded shadow">
                        <Link href={''}>
                            <h2 className="text-2xl">{post.title}</h2>
                            <p className="text-gray-600">{post.body}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}