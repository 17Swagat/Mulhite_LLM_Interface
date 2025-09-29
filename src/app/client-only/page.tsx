'use client';
import { serverOnlyFunc } from "@/utils/serverOnlyFunction";

export default function ClientOnlyPage() {
    const serverValue = serverOnlyFunc();
    return <div className="w-screen h-screen">
        Client Only Page
        <div>Client Value: {serverValue}</div>
    </div>
}