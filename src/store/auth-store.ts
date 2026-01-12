import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LoginResponse } from '@/types';
import { STORAGE_KEYS } from '@/utils/constants';

interface AuthState {
    isAuthenticated: boolean;
    user: LoginResponse | null;
    token: string | null;

    // Actions
    setAuth: (user: LoginResponse) => void;
    clearAuth: () => void;
    updateUser: (user: Partial<LoginResponse>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            user: null,
            token: null,

            setAuth: (user) =>
                set({
                    isAuthenticated: true,
                    user,
                    token: user.token || null,
                }),

            clearAuth: () =>
                set({
                    isAuthenticated: false,
                    user: null,
                    token: null,
                }),

            updateUser: (userData) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...userData } : null,
                })),
        }),
        {
            name: STORAGE_KEYS.LOCAL_TOKEN,
        }
    )
);
