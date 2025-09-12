import Link from "next/link";
export default function Login(){
    return (

    <div className="h-screen w-screen flex items-center justify-center bg-green-900">
        <div className="flex flex-col items-center">
            <h1>Login Page</h1>
            <label htmlFor="username">
                Username:
                <input type="text" id="username" placeholder="Enter name" className="border-2" />
            </label>
            <Link href="/" className="bg-blue-500 text-white py-2 px-4 rounded hover:brightness-150 active:brightness-75">
                Go Back
            </Link>
        </div>

        {/* {children} */}
    </div>
    );
}