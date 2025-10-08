import {
    Calendar, ChevronDown, Home, Inbox, Search, Settings,

    EllipsisVertical,
} from "lucide-react"

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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getLocalChatFileNames } from "@/utils/chat-store"
import { UIMessage } from "ai"



export function AppSidebar() {

    let chatHistory2: string[] = getLocalChatFileNames();


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

                            {
                                // #1
                                // chatHistory.length === 0 ?
                                //     <SidebarMenuItem key={0}>No chat history available</SidebarMenuItem>
                                //     : chatHistory.map((chat: UIMessage | any, index: number) => (
                                //         <SidebarMenuItem key={chat.id}>
                                //             <SidebarMenuButton asChild>
                                //                 <Link href={`/chat/${chat.id}`}  className="bg-pink-400">
                                //                     {/* #1 */}
                                //                     <div>
                                //                         {chat.parts[0].text.substring(0, 30)}
                                //                     </div>

                                //                 </Link>
                                //                 {/* <EllipsisVertical className="ml-auto" /> */}
                                //             </SidebarMenuButton>
                                //         </SidebarMenuItem>
                                //     ))


                                // #2
                                chatHistory2.length === 0 ?
                                    <SidebarMenuItem key={0}>No chat history available</SidebarMenuItem>
                                    : chatHistory2.map((chat: any, index: number) => {
                                        // console.log(chat);
                                        // console.log(chat);
                                        return (
                                            <SidebarMenuItem  key={chat}>
                                                <SidebarMenuButton asChild>
                                                    <Link href={`/chat/${chat}`} className="bg-pink-400 hover:bg-yellow-600 "
                                                    >
                                                        {/* #2 */}
                                                        <div>
                                                            {/* {chat} */}
                                                            {chat}
                                                            {/* {chat.parts[0].text.substring(0, 30)} */}
                                                        </div>

                                                    </Link>
                                                    {/* <EllipsisVertical className="ml-auto" /> */}
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        )
                                    }

                                    )

                            }
                            {/* {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))} */}


                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}