import Navbar from "@/components/my/Navbar";
export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <div className="min-h-screen bg-[#0a0b10]">
        <Navbar />
        {children}
      </div>
    </>
  );
}
