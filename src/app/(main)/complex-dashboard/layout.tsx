import "@/app/globals.css";

export default function ComplexDashBoardLayout({
    children,
    // NOTE: "The parallel routes names here should matching their @folder-names."
    notifications, revenue, userAnalytics
}: Readonly<{
    children: React.ReactNode;
    notifications: React.ReactNode;
    revenue: React.ReactNode;
    userAnalytics: React.ReactNode;
}>) {
    return (
        <div className="w-full h-screen flex justify-center items-center
        bg-gradient-to-br from-green-800 to-purple-900">
            <div>{children}</div>
            <div style={{ display: "flex" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div>{userAnalytics}</div>
                    <div>{revenue}</div>
                </div>
                <div style={{ display: "flex", flex: 1 }}>{notifications}</div>
            </div>
        </div>
    );
}