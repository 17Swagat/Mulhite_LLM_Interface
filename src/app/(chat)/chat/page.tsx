// #3

import { redirect } from "next/navigation";
import {generateId} from 'ai';
import Chat_LoadingScreen from "./loading";

export default async function ChatPage() {

    // createChatId();
    const id = generateId();
    console.log("Generated Chat ID:", id);

    await new Promise((resolve) => setTimeout(resolve, 5000)).then(() => {
        // redirect(`/chat/${id}`);
        redirect(`/chat/${id}`);
    })


  //   return (
  //     <>
  //     </>
  // );
}

