// import ClientComponent1 from "@/components/client-component-1";
import ServerComponent1 from "@/components/server-component-1";

export default function InterleavingPage() {
    return (<div className="bg-blue-400 p-3">
        <h1 className="underline">Interleaving Page</h1>
        <ServerComponent1 />
        {/* <ClientComponent1/> */}
    </div>)
}