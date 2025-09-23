import { Card } from "@/components/my/card";
import Link from "next/link";
export default function ComplexDashboard_Revenue(){
    return (
        // <div className="bg-purple-600 text-4xl w-1/2">
        //     Revenue
        // </div>
        <Card>

            <div className="flex flex-col items-center">
                Revenue
                <Link href='/complex-dashboard/view-money' className="bg-blue-400 p-1.5 text-2xl text-black font-bold hover:brightness-150 active:brightness-75">See Money</Link>
            </div>
        </Card>
    );
}