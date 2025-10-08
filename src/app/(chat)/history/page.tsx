import { getChatHistory } from "@/utils/chat-store";

export default function ChatHistoryPage() {

    let chatHistory: any = getChatHistory();

    return (
        <div className="flex flex-col justify-start items-center min-h-screen w-full bg-gray-900 text-white p-50 px-[200px]">
            <h1 className="text-3xl font-bold mb-6">Chat History</h1>

            {/* <p>{chatHistory.length}</p> // 9 */}

            {chatHistory.map((chat: any, index: number) => (
                <div key={index} className="mb-4 p-4 border border-gray-700 rounded w-full">
                    <h2 className="text-xl font-semibold mb-2">Chat {index + 1}</h2>
                    <p className="text-gray-400 mb-2">
                        {/* First Message: {chat.parts.map((part: any) => part.type === 'text' ? part.text : '').join('')} */}
                        {chat.parts[0].text}
                    </p>
                    <p>{chat.id}</p>
                    <p className="text-gray-400">Total Messages: {chatHistory.length}</p>
                </div>
            ))}

        </div>

    );
}