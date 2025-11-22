import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useAPIVercelGateway } from './aiprovidersKeyStore';



export const useVercelAICreditsLeft = create<{
    vercelAiGatewayCredits: number;
    setVercelAiGatewayCredits: () => void;
}>()(
    persist(
        (set) => ({
            vercelAiGatewayCredits: 0,
            setVercelAiGatewayCredits() {
                fetch(`/api/vercel-models/credits_left/${useAPIVercelGateway.getState().vercelAIGatewayAPIKey}`,
                    {
                        method: "GET",
                    }
                )
                    .then((res) => res.json())
                    .then((data) => {
                        set({ vercelAiGatewayCredits: data.creditsLeft });
                    }).catch((err) => {
                        set({ vercelAiGatewayCredits: 0 });
                    });
            },
        }),
        {
            name: 'credits-left',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)
