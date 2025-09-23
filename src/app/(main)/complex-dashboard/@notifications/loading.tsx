import { LoadingCircle } from "@/components/3rdParty/loading";
import { Card } from "@/components/my/card";
export default function Loading_BlogPage(){
    return (
        // <div className="w-full h-full bg-pink-800 text-white flex justify-center items-center">
        <Card>
            <LoadingCircle/>
        </Card>
        // </div>
    );
}