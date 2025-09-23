// [Unmatached Routes]:=>
// * "When you are in the link: <http://localhost:3000/complex-dashboard/archive> and try to reload, we will encounter a [Page-Note-Found: 404]"
// * For encontering this we need a `default.tsx` file in each unmatched slot. This file is critical as it serves as a fallback to render content when the framework cannot retrieve a slot's active state from teh current URL. Without the fiel, you'll get a 404 error.

import { Card } from "@/components/my/card";
import Link from "next/link";
export default async function ComplexDashboard_NotificationsArchive(){

    return (
        <Card>
            <div className="flex flex-col items-center">
                Notifications-Archive
                <Link href='/complex-dashboard/' className="bg-amber-600 p-1.5 text-2xl text-black font-bold hover:brightness-150 active:brightness-75">Go Back</Link>
            </div>
        </Card>
    );
}