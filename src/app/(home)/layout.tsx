import Navbar from "@/components/my/Navbar";
export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <div className="min-h-screen bg-black">
        <Navbar />
        {children}
      </div>
    </>
  );
}
