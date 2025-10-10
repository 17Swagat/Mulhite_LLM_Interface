// DeepSeek V1:
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "../../../../components/my/AppSidebar"
import { loadChat } from "@/utils/chat-store"
import { UIMessage } from "ai"
import { Error_ChatNotFound } from "@/utils/custom_errors/chat_errors"
import ChatNotFound from "./@chatArea/_ui/ChatNotFound"

export default async function Layout({
  children,
  chatArea,
  params
}: {
  children: React.ReactNode,
  chatArea: React.ReactNode,
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  console.log('Layout.tsx - Chat ID:', id);
  let initialMessages: UIMessage[] = [];

  try {
    initialMessages = await loadChat(id);
  } catch (error) {
    if (error instanceof Error_ChatNotFound) {
      return <ChatNotFound id={id} />;
    }
    console.error('Error loading chat:', error);
  }

  return (
    // <SidebarProvider>
    //{/* <AppSidebar /> */}
    //{/* <main className="bg-pink-400 w-screen"> */}
    //{/* <SidebarTrigger className="bg-green-400 m-2 fixed top-0" /> */}
    <>
      {chatArea}
    </>
    // </main>
    // </SidebarProvider>
  )
}


// Old #1:
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
// // import { AppSidebar } from "@/components/app-sidebar"
// import { AppSidebar } from "./_ui/AppSidebar"

// export default function Layout({
//   children,
//   chatArea
// }: { children: React.ReactNode, chatArea: React.ReactNode }) {
//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <main className="bg-pink-400 w-screen">
//         <SidebarTrigger className="bg-green-400 m-2 fixed top-0" />
//         {chatArea}
//         {/* {children} */}
//       </main>
//     </SidebarProvider>
//   )
// }