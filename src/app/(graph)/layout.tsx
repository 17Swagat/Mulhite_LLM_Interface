export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>

    <div className=" text-5xl h-screen w-screen flex items-center justify-center bg-green-900">
        {children}
    </div>
      </body>
    </html>
  );
}
