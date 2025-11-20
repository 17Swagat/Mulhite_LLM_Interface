import { create } from 'zustand'

export const useAPIVercelGateway = create<{
    vercelAIGatewayAPIKey: string;
    setVercelGatewayAPIKey: (key: string) => void;
}>()(
    (set) => ({
        vercelAIGatewayAPIKey: '',
        setVercelGatewayAPIKey(key: string) {

            set({ vercelAIGatewayAPIKey: key });
        },
    })
)