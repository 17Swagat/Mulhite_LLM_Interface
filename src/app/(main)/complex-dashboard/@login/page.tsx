import { Card } from "@/components/my/card";
export default function ComplexDashboard_Login(){

    return (
        <Card>
            <div className="flex flex-col items-center">
                Login
            </div>
        </Card>
    );
}

/*
[Conditional Routes]:=>

* Imagine you want to show different content based on whether a user is logged in or not.

* You might want to display a dashboard for authenticated users but show a login page for those who aren't

* Conditional routes allow us to achieve this while maintaining completely separate code on the same URL.

*/