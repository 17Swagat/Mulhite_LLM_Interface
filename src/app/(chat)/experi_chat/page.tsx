import { Suspense } from "react";
import { DataComponent } from "@/components/my/tempDataComponent";

export default function Page() {

    return (
        <div>
            {/* {data ? data : "Loading..."} */}
            <Suspense fallback={<div>Loading...</div>}>
                <DataComponent />
            </Suspense>
        </div>
    );
}