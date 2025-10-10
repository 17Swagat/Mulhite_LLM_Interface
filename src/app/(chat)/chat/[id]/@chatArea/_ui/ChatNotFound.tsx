export default function ChatNotFound({id}:{id:string}) {

    return (
        <div className="flex flex-col justify-center items-center min-h-screen w-full bg-gray-900 text-white p-50 px-[200px]">
            <h1 className="text-4xl font-bold mb-4">Chat Not Found</h1>
            <p className="text-lg">The chat with ID {id} does not exist.</p>
        </div>
    );
}