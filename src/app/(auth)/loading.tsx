import { LoadingCircle } from "@/components/3rdParty/loading";
export default function Loading_BlogPage(){
    return (
        <div className="w-screen h-screen bg-pink-400 text-white flex justify-center items-center">
            <LoadingCircle/>
        </div>
    );
}