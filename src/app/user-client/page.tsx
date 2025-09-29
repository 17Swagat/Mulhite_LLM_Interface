'use client';

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


import { useEffect, useState } from 'react';

async function fetchUser() {
}

export default function UserClientPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // fetchUser();
        try {
            fetch('https://jsonplaceholder.typicode.com/users')
                .then((response) => response.json())
                .then((data) => {
                    setUsers(data);
                    setLoading(false);
                })
                .catch((error) => {
                    setError('Failed to fetch users');
                    setLoading(false);
                });
        } catch (error) {
            setError('An unexpected error occurred');
            setLoading(false);
        }
    }, [])

    return (
        <div className="w-screen bg-purple-600/30 p-10">
            <h1 className="text-4xl underline">User List</h1>
            {loading && <p className="text-2xl">Loading...</p>}
            {error && <p className="text-2xl text-red-500">{error}</p>}
            {!loading && !error && (
                <ul className="mt-5 space-y-3">
                    {users.map((user) => (
                        <li key={user.id} className="p-5 bg-white/55 rounded shadow">
                            <h2 className="text-2xl">{user.name}</h2>
                            <p className="text-gray-600">{user.email}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}