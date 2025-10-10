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
import { getLocalChatFileNames } from "@/utils/chat-store"
import SidebarItem from "./SidebarItem";
// import { generateId} from "ai"



export function AppSidebar() {

    let chatHistory: string[] = getLocalChatFileNames();


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

                            <SidebarMenuItem >
                                <SidebarMenuButton asChild className="bg-gray-800/80 hover:bg-gray-600 hover:brightness-125 hover:text-white text-white">
                                    {/* <Link href={`/chat/${generateId()}`}> */}
                                    <Link href={`/chat/`}>
                                        + New Chat
                                    </Link>

                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {
                                chatHistory.length === 0 ?
                                    <SidebarMenuItem>No chat history available</SidebarMenuItem>
                                    : chatHistory.map((chat: any, index: number) => {
                                        // console.log(chat);
                                        return (
                                            <SidebarMenuItem  key={chat}>
                                                <SidebarMenuButton className="" asChild>
                                                    {/* <Link href={`/chat/${chat}`} className="bg-pink-400 hover:bg-yellow-600 "
                                                    >
                                                        <div>
                                                            {chat}
                                                        </div>
                                                    </Link> */}

                                                    <div className="bg-pink-700">
                                                        <SidebarItem key={chat} title={chat} navLink={`/chat/${chat}`} />
                                                    </div>

                                                    {/* <EllipsisVertical className="ml-auto" /> */}
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        )
                                    }

                                    )
                            }

                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}