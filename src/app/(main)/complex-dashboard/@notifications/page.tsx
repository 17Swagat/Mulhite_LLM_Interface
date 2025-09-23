import { Card } from "@/components/my/card";
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
            Notifications
        </Card>
    );
}