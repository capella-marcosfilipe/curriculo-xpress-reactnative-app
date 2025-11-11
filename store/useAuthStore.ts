import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'jwt_auth_token';

interface AuthState {
    token: string | null;
    isLoading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
    token: null,
    isLoading: true,

    login: async (token) => {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
        set({ token: token });
    },

    logout: async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        set({ token: null });
    },

    checkAuth: async () => {
        try {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            if (token) {
                set({ token: token, isLoading: false });
            } else {
                set({ token: null, isLoading: false });
            }
        } catch (e) {
            console.error('Erro ao checar autenticação:', e);
            set({ token: null, isLoading: false });
        }
    },
}));

useAuthStore.getState().checkAuth();

export default useAuthStore;
