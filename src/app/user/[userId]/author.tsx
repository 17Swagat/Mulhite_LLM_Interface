export async function Author({userId}: {userId: number}) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    const user = await response.json();
    return (
        <div>
            <h1 className="text-3xl"> 
                <span className="underline">Post By</span> 
                &nbsp; {user.name}
            </h1>
        </div>
    );
}