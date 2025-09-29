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

export default async function UserServer() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users').catch((error) => {
        console.error('Failed to fetch users:', error);
    });
    const users: User[] = await response?.json() ?? [];
    return (
        <div className="w-screen bg-purple-600/30 p-10">
            <h1 className="text-4xl underline">User List</h1>
            <ul className="mt-5 space-y-3">
                {users.map((user) => {
                    // console.log(user);
                    return (
                        <li key={user.id} className="p-5 bg-white/55 rounded shadow">
                            <h2 className="text-2xl">{user.name}</h2>
                            <p className="text-gray-600">{user.email}</p>
                            <p className="text-gray-600">{user.address.city}</p>
                        </li>
                    )
                }

                )}
            </ul>
        </div>
    );
}
