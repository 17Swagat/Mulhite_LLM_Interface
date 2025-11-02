import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/my/Sidebar/AppSidebar";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidebarProvider className="bg-black">
        <AppSidebar />
        <main className="w-full">
          <SidebarTrigger className="z-1000 m-2 fixed top-0 bg-linear-to-br from-purple-700 to-blue-700 text-white" />
          {children}
        </main>
      </SidebarProvider>
    </>
  );
}
