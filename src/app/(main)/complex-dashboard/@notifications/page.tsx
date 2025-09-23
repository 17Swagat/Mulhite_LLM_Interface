import { Card } from "@/components/my/card";
import Link from "next/link";
export default function ComplexDashboard_Notifications(){

    return (
        <Card>
            <div className="flex flex-col items-center">
                Notifications
                <Link href='/complex-dashboard/archive' className="bg-amber-400 p-1.5 text-2xl text-black font-bold hover:brightness-150 active:brightness-75">Archive</Link>
            </div>
        </Card>
    );
}