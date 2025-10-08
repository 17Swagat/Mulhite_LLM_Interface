import { loadChat } from "@/utils/chat-store";
import Chat from "./chat";

export default async function ChatPage_ID({ params }: { params: Promise<{ id: string }> }) {

    // const { id } = await params;
    // try {
    //     const messages = loadChat(id);
    //     return <Chat id={id} initialMessages={await messages} />
    // } catch (error: Error | any) {
    //     // if (error instanceof Error && error.message.includes('ENOENT')) {
    //     console.log(Object.keys(error));
    //     if (error instanceof Error && error.code == 'ENOENT') {
    //         return (
    //             <div className="flex flex-col justify-center items-center min-h-screen w-full bg-gray-900 text-white p-50 px-[200px]">
    //                 <h1 className="text-4xl font-bold mb-4">Chat Not Found</h1>
    //                 <p className="text-lg">The chat with ID {id} does not exist.</p>
    //             </div>
    //         );
    //     }
    //     // return <></>
    // }


    const { id } = await params;

    // Converting Errors to Typescript friendly way:=>
    try {
        const messages = await loadChat(id);
        return <Chat id={id} initialMessages={messages} />;
    } catch (error: unknown) {
        if (
            error instanceof Error &&
            typeof error.message === 'string' &&
            error.message.includes('ENOENT')
        ) {
            return (
                <div className="flex flex-col justify-center items-center min-h-screen w-full bg-gray-900 text-white p-50 px-[200px]">
                    <h1 className="text-4xl font-bold mb-4">Chat Not Found</h1>
                    <p className="text-lg">The chat with ID {id} does not exist.</p>
                </div>
            );
        }

        // Optionally log unexpected errors
        console.error('Unexpected error:', error);
        return null;
    }



}