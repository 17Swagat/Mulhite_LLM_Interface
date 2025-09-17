'use client';

/*
About `error.tsx`:=>
-> "It automatically wraps route segments and their nested children in a React Error Boundary."
-> "You can create custom error UIs for specific segments using the file-system hierarchy."
-> "It isolates errors to affected segments while keeping the rest of your app functional."
*/

export default function ProfilePage_Error({error}: {error: Error}){
    return (
        <div className="w-screen h-screen bg-pink-400 flex flex-col justify-center items-center">
            <h1 className="text-5xl font-bold">Error - Occured</h1>
            <h2 className="text-4xl font-bold">{error.message}</h2>
        </div>
    );
}