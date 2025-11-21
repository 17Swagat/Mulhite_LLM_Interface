import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware';

export const useAPIVercelGateway = create<{
    vercelAIGatewayAPIKey: string;
    setVercelGatewayAPIKey: (key: string) => void;
}>()(
    persist((set) => ({
        vercelAIGatewayAPIKey: '',
        setVercelGatewayAPIKey(key: string) {
            set({ vercelAIGatewayAPIKey: key });
        },
    }), {
        name: 'aiApiKeys',
        storage: createJSONStorage(() => localStorage),
    })
)