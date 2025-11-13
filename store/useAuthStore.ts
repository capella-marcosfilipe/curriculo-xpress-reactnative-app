import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'jwt_auth_token';

interface AuthState {
  token: string | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// Helper para storage que funciona em todas as plataformas
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      // No web, usa localStorage (se disponível)
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
      return null; // SSR ou ambiente sem localStorage
    } else {
      // No mobile, usa SecureStore
      return await SecureStore.getItemAsync(key);
    }
  },
  
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value);
      }
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
      }
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }
};

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isLoading: true,

  login: async (token) => {
    try {
      await storage.setItem(TOKEN_KEY, token);
      set({ token: token });
      console.log('✅ Token salvo com sucesso');
    } catch (error) {
      console.error('❌ Erro ao salvar token:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await storage.removeItem(TOKEN_KEY);
      set({ token: null });
      console.log('✅ Token removido com sucesso');
    } catch (error) {
      console.error('❌ Erro ao remover token:', error);
    }
  },

  checkAuth: async () => {
    try {
      console.log('🔍 Verificando autenticação...');
      const token = await storage.getItem(TOKEN_KEY);
      
      if (token) {
        console.log('✅ Token encontrado:', token.substring(0, 20) + '...');
        set({ token: token, isLoading: false });
      } else {
        console.log('❌ Nenhum token encontrado');
        set({ token: null, isLoading: false });
      }
    } catch (error) {
      console.error('❌ Erro ao checar autenticação:', error);
      set({ token: null, isLoading: false });
    }
  },
}));

// Inicializa o checkAuth quando o store é criado
// Mas só no cliente (não no SSR)
if (typeof window !== 'undefined') {
  useAuthStore.getState().checkAuth();
}

export default useAuthStore;
