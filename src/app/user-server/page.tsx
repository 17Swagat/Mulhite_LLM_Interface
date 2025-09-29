import { Suspense } from "react";

type User = {
    id: number;
    name: string;
    username: string;
    email: string;
    address: {
        street: string;
        suite: string;
        city: string;
        zipcode: string;
        geo: {
            lat: string;
            lng: string;
        };
    };
    phone: string;
    website: string;
    company: {
        name: string;
        catchPhrase: string;
        bs: string;
    };
};

function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
        </div>
    );
}

// Async component for each user
async function UserItem({ userPromise }: { userPromise: Promise<User> }) {
    if ((await userPromise).id == 2 || (await userPromise).id == 4) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Intentional delay
    }
    const user = await userPromise;
    return (

        <li className="p-5 bg-white/55 rounded shadow">
            <h2 className="text-2xl">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">{user.address.city}</p>
        </li>
        // </Suspense>
    );
}

export default async function UserServer() {

    // Intentional Delay
    // await new Promise(resolve => setTimeout(resolve, 2000));

    const response = await fetch('https://jsonplaceholder.typicode.com/users').catch((error) => {
        console.error('Failed to fetch users:', error);
    });
    const users: User[] = await response?.json() ?? [];
    return (
        <div className="w-screen bg-purple-600/30 p-10">
            <h1 className="text-4xl underline">User List</h1>
            <ul className="mt-5 space-y-3">
                {users.map(async (user) => {
                    return (
                        // <Suspense fallback={<LoadingSpinner />} key={user.id}>
                        <Suspense fallback={
                        <li className="p-5 bg-white/55 rounded shadow">
                            <LoadingSpinner />
                        </li>
                        } key={user.id}>
                            <UserItem userPromise={Promise.resolve(user)} />
                        </Suspense>
                    )
                }

                )}
            </ul>
        </div>
    );
}
