import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/my/AppSidebar";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidebarProvider className="bg-black">
        <AppSidebar />
        <SidebarTrigger className="m-2 fixed top-0 bg-linear-to-br from-purple-700 to-blue-700 text-white" />
        <main className="w-screen">{children}</main>
      </SidebarProvider>
    </>
  );
}
