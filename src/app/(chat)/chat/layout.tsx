import { UIMessage } from "ai";
import { loadChat } from "@/utils/chat-store";
import { Error_ChatNotFound } from "@/utils/custom_errors/chat_errors";
import ChatNotFound from "./[id]/@chatArea/_ui/ChatNotFound";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/my/AppSidebar";

export default async function ChatLayout({ 
  children,
}: { 
  children: React.ReactNode, 
  chatArea: React.ReactNode,
}) {
//   const { id } = await params;
//   console.log('Layout.tsx - Chat ID:', id);
//   let initialMessages: UIMessage[] = [];
  
//   try {
//     initialMessages = await loadChat(id);
//   } catch (error) {
//     if (error instanceof Error_ChatNotFound) {
//       return <ChatNotFound id={id} />;
//     }
//     console.error('Error loading chat:', error);
//   }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="bg-pink-400 w-screen">
        <SidebarTrigger className="bg-green-400 m-2 fixed top-0" />
        {children}
      </main>
    </SidebarProvider>
  )
}