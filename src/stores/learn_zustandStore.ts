// #2
import { create } from 'zustand'

interface User {
    id: string;
    name: string;
    email: string;
}

interface UserState {
    user: User | null;
    isLoggedIn: boolean;
    login: (user: User) => void;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
}

const useUserStore = create<UserState>((set) => ({
    user: null,
    isLoggedIn: false,
    login: (user: User) => set({ user, isLoggedIn: true }),
    logout: () => set({ user: null, isLoggedIn: false }),
    updateUser: (updates) =>
        set((state) => ({
            user: state.user ? { ...state.user, ...updates } : null
        })),
}));

