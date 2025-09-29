'use client';
import { useTheme } from "@/components/temp/theme-provider";
import { clientOnlyFunc } from "@/utils/clientOnlyFunction";

export default function ClientOnlyPage() {
    const { colors } = useTheme(); 
    const clientValue = clientOnlyFunc();

    return <div className="w-screen h-screen">
        <h1 style={{color: colors.primary, backgroundColor: colors.secondary}} className="text-3xl font-bold underline">
            Client Only Page
        </h1>
        <div className="bg-pink-600/80">
            Client Value: {clientValue}
        </div>
    </div>
}