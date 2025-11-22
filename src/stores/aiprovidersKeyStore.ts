import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware';

export const useAPIVercelGateway = create<{
    vercelAIGatewayAPIKey: string;
    setVercelGatewayAPIKey: (key: string) => void;
    // For, Hydration Fix:
    hydrated: boolean;
    setHydrated: () => void;
}>()(
    persist((set) => ({
        vercelAIGatewayAPIKey: '',
        setVercelGatewayAPIKey(key: string) {
            set({ vercelAIGatewayAPIKey: key });
        },
        // Hydration Fix:
        hydrated: false,
        setHydrated: () => set({ hydrated: true })
    }), {
        name: 'aiApiKeys',
        storage: createJSONStorage(() => localStorage),
        onRehydrateStorage: () => (state) => {
            state?.setHydrated();
        }
    })
)