import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const API_URL = 'https://curriculo-express-api-10112025.vercel.app/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Interceptor de requisição (adiciona token)
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta (loga sucesso e trata 401)
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.config?.url, error.message);
    
    if (error.response) {
      console.error('Response data:', error.response.data);
      
      // ✅ NOVO: Detecta 401 e faz logout
      if (error.response.status === 401) {
        console.log('🚪 Token expirado ou inválido. Fazendo logout...');
        
        // Limpa o token do store
        useAuthStore.getState().logout();
        
        // Nota: O roteamento protegido vai detectar e redirecionar para login
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
