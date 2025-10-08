import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
// import { AppSidebar } from "@/components/app-sidebar"
import { AppSidebar } from "./AppSidebar"

export default function Layout({ 
  children, 
  chatArea
}: { children: React.ReactNode, chatArea: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="bg-pink-400 w-screen">
        <SidebarTrigger className="bg-green-400 m-2 fixed top-0" />
        {chatArea}
        {/* {children} */}
      </main>
    </SidebarProvider>
  )
}