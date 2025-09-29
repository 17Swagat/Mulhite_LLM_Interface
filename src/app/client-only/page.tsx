'use client';
// import { serverOnlyFunc } from "@/utils/serverOnlyFunction";
import { useTheme } from "@/components/temp/theme-provider";

export default function ClientOnlyPage() {
    const serverValue = 'sc' //serverOnlyFunc();
    const { colors } = useTheme(); 
    return <div className="w-screen h-screen">
        <h1 style={{color: colors.primary, backgroundColor: colors.secondary}} className="text-3xl font-bold underline">
            Client Only Page
        </h1>
        {/* <div>Client Value: {serverValue}</div> */}
    </div>
}