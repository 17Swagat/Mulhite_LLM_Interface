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

export function AppSidebar() {
    const { chats, setActiveChat, syncWithFiles } = useChatStore();

    // Load chat files only on mount
    useEffect(() => {
        const loadChats = async () => {
            try {
                // Fetch chat file names from the API
                const response = await fetch('/api/chats/list');
                if (response.ok) {
                    const data = await response.json();
                    const actualChatIds = data.chatIds || [];
                    
                    // Sync store with actual files (removes stale, adds new)
                    syncWithFiles(actualChatIds);
                }
            } catch (error) {
                console.error('Failed to load chats:', error);
            }
        };

        loadChats();
    }, [syncWithFiles]);

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

                            {chats.length === 0 ? (
                                <SidebarMenuItem>
                                    <span className="text-gray-400 text-sm px-2">No chat history available</span>
                                </SidebarMenuItem>
                            ) : (
                                chats.map((chat) => (
                                    <SidebarMenuItem key={chat.id}>
                                        <SidebarItem 
                                            chatId={chat.id} 
                                            title={chat.title} 
                                            navLink={`/chat/${chat.id}`} 
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