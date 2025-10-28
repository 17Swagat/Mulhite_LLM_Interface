import Link from "next/link";

export default function ChatNotFound({ id }: { id: string }) {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full bg-gray-900 text-white p-50 px-[200px]">
      <h1 className="text-4xl font-bold mb-4">Chat Conversation Not Found</h1>
      <p className="text-lg">
        The chat conversation: <span className="font-semibold text-amber-600">{id}</span> not
        found.
      </p>
      <Link
        href="/chat"
        className="text-white hover:brightness-110 transition duration-300 ease-in-out text-2xl mt-2 bg-purple-800 px-4 py-2 rounded"
      >
        New Chat
      </Link>
    </div>
  );
}
