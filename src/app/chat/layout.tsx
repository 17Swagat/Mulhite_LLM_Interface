import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/my/AppSidebar";

export default async function ChatLayout({ 
  children,
}: { 
  children: React.ReactNode, 
}) {
  return (
    <SidebarProvider>
      {/* Sidebar (ChatHistory + New-Chat) */}
      <AppSidebar />
      
      {/* Chat-Content */}
      <main className="bg-pink-400 w-screen">
        <SidebarTrigger className="bg-green-400 m-2 fixed top-0" />
        {children}
      </main>
    </SidebarProvider>
  )
}