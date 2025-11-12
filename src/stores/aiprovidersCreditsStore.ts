import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'



export const useVercelAICreditsLeft = create<{
    vercelAiGatewayCredits: number;
    setVercelAiGatewayCredits: () => void;

}>()(

    persist(
        (set) => ({
            vercelAiGatewayCredits: 0,
            setVercelAiGatewayCredits() {
                fetch("/api/vercel-models/credits_left/")
                    .then((res) => res.json())
                    .then((data) => {
                        set({ vercelAiGatewayCredits: data.creditsLeft });
                    });
            },

        }),
        {
            name: 'credits-left',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)
