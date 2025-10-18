'use client';

import Link from "next/link"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import SidebarItem from "./SidebarItem";
import { useChatStore } from "@/stores/chatStore";
import { useEffect, useState } from "react";
import { useQuery, useMutation, usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";


export function AppSidebar() {

    const { chats, setActiveChat, setChats } = useChatStore();

    // Ensure user exists in Convex on mount
    const ensureUser = useMutation(api.conversations.ensureUser);

    // Fetch conversations from Convex
    // const conversations = useQuery(api.conversations.listConversations); // *** 📌
    const [reset, setReset] = useState(false);
    const PAGINATE_LIMIT = 20;
    const { results: conversations, status: conversPagiStatus, isLoading, loadMore } = usePaginatedQuery(
        api.conversations.listConversationsPaginate, {
        doReset: reset
    }, { initialNumItems: PAGINATE_LIMIT })

    // Create user if doesn't exist
    useEffect(() => {
        ensureUser().catch((err: unknown) => {
            console.error("Failed to ensure user:", err);
        });
    }, [ensureUser]);

    // Sync Convex data with store
    useEffect(() => {
        if (conversations) {
            setChats(conversations);
        }
    }, [conversations, setChats]);

    
    return (
        <Sidebar>
            <SidebarHeader>
                <Link href={'/'}>
                    <div className="w-full bg-yellow-500 p-2 text-center font-semibold text-[22px] rounded-[19px]">
                        Nody ➡️
                    </div>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Chat History</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild className="bg-gray-800/80 hover:bg-gray-600 hover:brightness-125 hover:text-white text-white">
                                    <Link
                                        href={`/chat/`}
                                        onClick={() => setActiveChat(null)}
                                    >
                                        + New Chat
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <div className="h-1"></div>

                            {/* {conversations === undefined ? ( */}
                            {(isLoading && conversPagiStatus == "LoadingFirstPage") ? (
                                <SidebarMenuItem>
                                    <span className="text-gray-700 text-sm px-2">Loading...</span>
                                </SidebarMenuItem>
                            ) : chats.length === 0 ? (
                                <SidebarMenuItem>
                                    <span className="text-gray-400 text-sm px-2">No chat history available</span>
                                </SidebarMenuItem>
                            ) : (
                                chats.map((chat) => (
                                    <SidebarMenuItem key={chat._id}>
                                        {/* My Custom Item:-=> */}
                                        <SidebarItem
                                            chatId={chat._id}
                                            title={chat.title || `Chat ${chat._id.slice(0, 8)}`}
                                            navLink={`/chat/${chat._id}`}
                                        />
                                    </SidebarMenuItem>
                                ))
                            )}

                            {(conversPagiStatus !== "Exhausted") &&
                                <div className="w-full bg-amber-400 text-2xl rounded-[10px] text-center cursor-pointer hover:brightness-125 active:brightness-90 active:text-white" onClick={() => {
                                    loadMore(PAGINATE_LIMIT);
                                }}>
                                    Load More
                                </div>
                            }

                            {/* {(conversPagiStatus === "Exhausted") &&
                                <div className="w-full bg-amber-700 text-2xl text-white rounded-[10px] text-center" onClick={() => {
                                    setReset(prev => !prev)
                                }}>
                                    Collapse
                                </div>
                            } */}

                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}