import { serverOnlyFunc } from "@/utils/serverOnlyFunction";
import { clientOnlyFunc } from "@/utils/clientOnlyFunction";

export default function ServerOnlyPage() {
    // const serverValue = serverOnlyFunc();
    const clientValue = clientOnlyFunc(); // ❌ This will cause a build error because a server component cannot import a client-only module
    return <div className="w-screen h-screen">
        Server Only Page
        {/* <div>Server Value: {serverValue}</div> */}
        <div className="bg-pink-600/80">
            Client Value: {clientValue}
        </div>
    </div>
}