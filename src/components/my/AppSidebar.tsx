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
import { useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function AppSidebar() {
    const { chats, setActiveChat, setChats } = useChatStore();
    
    // Ensure user exists in Convex on mount
    const ensureUser = useMutation(api.conversations.ensureUser);
    
    // Fetch conversations from Convex
    const conversations = useQuery(api.conversations.listConversations);

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

                            {conversations === undefined ? (
                                <SidebarMenuItem>
                                    <span className="text-gray-400 text-sm px-2">Loading...</span>
                                </SidebarMenuItem>
                            ) : chats.length === 0 ? (
                                <SidebarMenuItem>
                                    <span className="text-gray-400 text-sm px-2">No chat history available</span>
                                </SidebarMenuItem>
                            ) : (
                                chats.map((chat) => (
                                    <SidebarMenuItem key={chat._id}>
                                        <SidebarItem 
                                            chatId={chat._id} 
                                            title={chat.title || `Chat ${chat._id.slice(0, 8)}`} 
                                            navLink={`/chat/${chat._id}`} 
                                        />
                                    </SidebarMenuItem>
                                ))
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}