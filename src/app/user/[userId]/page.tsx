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

// Page providing user info
export default async function UserPage({params}: {params: Promise<{userId: number}>}){
    
    const {userId} = await params;
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    const user:User = await response.json();

    return (
        <div className="w-screen bg-purple-600/30 p-10">
            <h1 className="text-4xl underline">User Profile</h1>
            <h2 className="text-2xl">Name: {user.name}</h2>
            <h2 className="text-2xl">Username: {user.username}</h2>
            <h2 className="text-2xl">Email: {user.email}</h2>
            <h2 className="text-2xl">City: {user.address.city}</h2>
            <h2 className="text-2xl">Phone: {user.phone}</h2>
            <h2 className="text-2xl">Website: {user.website}</h2>
            <h2 className="text-2xl">Company: {user.company.name}</h2>
        </div>
    )
}