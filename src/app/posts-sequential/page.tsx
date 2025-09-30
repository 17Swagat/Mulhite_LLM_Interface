import Link from "next/link";
import { Author } from "../user/[userId]/author";

export const dynamic = 'force-dynamic'; // this page will be revalidated on every request

type Post = {
    userId: number,
    id: number;
    title: string;
    body: string;
};

export default async function PostSequentialPage() {
    // const RANDOM_NUM = Math.floor(Math.random() * 4);
    // console.log('Random Num:', RANDOM_NUM);
    // let API_ROUTE; //: string;
    // if (RANDOM_NUM == 0){
    //     // Intentional Error Case
    //     API_ROUTE = 'https://jsonplacehold_er_.typicode.com/posts'
    // } else {
    //     API_ROUTE = 'https://jsonplaceholder.typicode.com/posts'
    // }

    const API_ROUTE = 'https://jsonplaceholder.typicode.com/posts'

    const response = await fetch(API_ROUTE).catch((error: Error) => {
        throw error;
    })
    const posts = await response?.json() ?? []

    const usersInPosts: number[] = Array.from(new Set(posts.map((post: Post) => post.userId)));

    return (
        <div className="w-screen bg-purple-600/30 p-10">
            <h1 className="text-4xl underline">Post List</h1>
            <h1 className="text-4xl underline">Data: {new Date().toLocaleTimeString()}</h1>
            <ul className="mt-5 space-y-3">
              

                {usersInPosts.map((userId) => (
                    <li key={userId}>
                        <details className="group">
                            <summary className="cursor-pointer hover:bg-gray-700 transition duration-300 p-2 rounded grid grid-cols-[auto_1fr] items-center gap-2">
                                <svg className="w-4 h-4 transition-transform duration-300 group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <Author userId={userId} />
                            </summary>
                            <ul>
                                {posts.filter((post: Post) => post.userId === userId).map((post: Post) => (
                                    <li key={`${userId}->${post.id}`} className="p-5 bg-white/55 rounded shadow">
                                        <Link href={`/user/${post.userId}/`} className="block hover:bg-gray-700 transition duration-300 p-2 rounded">
                                            <h2 className="text-2xl">{post.title}</h2>
                                            <p className="text-gray-200">{post.body}</p>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </details>
                    </li>
                ))}

            </ul>
        </div>
    )
}