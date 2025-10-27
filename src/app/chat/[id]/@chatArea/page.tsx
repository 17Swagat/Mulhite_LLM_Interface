// Updated for Convex migration
"use client";
import { useEffect, useState } from "react";
import ChatArea from "./ChatArea";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Chat } from "@ai-sdk/react";
import ChatNotFound from "./ChatNotFound";

export default function ChatPage_ID({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // const [id, setId] = useState<string | null>(null);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    const getId = async () => {
      const { id: chatId } = await params;
      setId(chatId);
    };
    getId();
  }, [params]);

  // Handling-ChatId NotFound
  // NOTE: Need to modify it
  // const isOwned = useQuery(api.conversations.isConversationOwnedByUser, {
  //   conversationId: id || "",
  // });
  // //   console.log("check: " + isOwned);
  // if (isOwned === false) {
  //   console.log("Triggered!!");
  //   return <ChatNotFound id={id || ""} />;
  // }

  // ChatArea now loads messages from Convex internally
  return <ChatArea id={id} />;
}
