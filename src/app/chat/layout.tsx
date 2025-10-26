import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/my/AppSidebar";

export default async function ChatLayout({ 
  children,
}: { 
  children: React.ReactNode, 
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-screen">
        <SidebarTrigger className="m-2 fixed top-0" />
        {children}
      </main>
    </SidebarProvider>
  )
}