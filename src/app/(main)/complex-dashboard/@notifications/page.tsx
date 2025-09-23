import { Card } from "@/components/my/card";
import Link from "next/link";
export default async function ComplexDashboard_Notifications(){

    await new Promise((resolve)=>{
    // new Promise((resolve)=>{
        setTimeout(()=>{
            resolve('Intentional Delay Complete')
        }, 1200);
    }).then((res)=>{
        console.log(res)
    });

    return (
        <Card>
            <div className="flex flex-col items-center">
                Notifications
                <Link href='/complex-dashboard/archive' className="bg-amber-400 p-1.5 text-2xl text-black font-bold hover:brightness-150 active:brightness-75">Archive</Link>
            </div>
        </Card>
    );
}