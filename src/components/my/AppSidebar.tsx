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
import { useMutation, usePaginatedQuery, useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";


export function AppSidebar() {
    // ConvexClerk Auth
    const { isLoading: isLoadingAuth, isAuthenticated } = useConvexAuth();



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
        if (!isLoadingAuth && isAuthenticated) {
            ensureUser().catch((err: unknown) => {
                console.error("Failed to ensure user:", err);
                console.warn("This may cause issues with chat storage and retrieval. Please refresh the page.");
            });
        }
    }, [ensureUser]);

    // Sync Convex data with store
    useEffect(() => {
        if (conversations) {
            setChats(conversations);
        }
    }, [conversations, setChats]);


    return (
        <>
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
                                    // Loading Spinner:
                                    <SidebarMenuItem className="w-full flex justify-center items-center">
                                        <div className="w-8 h-8 animate-spin border-3 border-purple-800 rounded-full border-t-transparent"></div>
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

                                {(conversPagiStatus !== "Exhausted" && conversPagiStatus !== "LoadingFirstPage") &&
                                    <div className="w-full bg-amber-400 text-2xl rounded-[10px] text-center cursor-pointer hover:brightness-125 active:brightness-90 active:text-white" onClick={() => {
                                        loadMore(PAGINATE_LIMIT);
                                    }}>
                                        Load More
                                    </div>
                                }

                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>

        </>
    );
}