import { Card } from "@/components/my/card";
import Link from "next/link";
export default async function ComplexDashboard_ViewMoneyDefault(){

    return (
        <Card>
            <div className="flex flex-col items-center">
                Money: $5000
                <Link href='/complex-dashboard/' className="bg-amber-600 p-1.5 text-2xl text-black font-bold hover:brightness-150 active:brightness-75">Go Back</Link>
            </div>
        </Card>
    );
}