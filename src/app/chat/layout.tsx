import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/my/Sidebar/AppSidebar";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidebarProvider className="bg-[#0f1117]">
        <AppSidebar />
        <main className="w-full">
          <SidebarTrigger className="z-1000 m-2 fixed top-0 bg-slate-800/80 backdrop-blur-sm border border-white/10 text-slate-300 hover:bg-slate-700/80 hover:text-white transition-all duration-200" />
          {children}
        </main>
      </SidebarProvider>
    </>
  );
}
