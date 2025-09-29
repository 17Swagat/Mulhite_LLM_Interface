import { serverOnlyFunc } from "@/utils/serverOnlyFunction";

export default function ServerOnlyPage() {
    const serverValue = serverOnlyFunc();
    return <div className="w-screen h-screen">
        Server Only Page
        <div>Server Value: {serverValue}</div>
    </div>
}