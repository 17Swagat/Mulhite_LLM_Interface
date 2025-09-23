import { Card } from "@/components/my/card";
import Link from "next/link";

export default function ComplexDashboard_RevenueDefault(){
    return (
        <Card>
            <div className="flex flex-col items-center">
                Revenue
                <Link href='/complex-dashboard/view-money' className="bg-blue-400 p-1.5 text-2xl text-black font-bold hover:brightness-150 active:brightness-75">See Money</Link>
            </div>
        </Card>
    );
}