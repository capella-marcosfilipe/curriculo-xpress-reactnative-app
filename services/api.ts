import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

// ✅ Certifique-se de que a URL está correta (sem barra no final)
const API_URL = 'https://curriculo-express-api-10112025.vercel.app/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 segundos de timeout
});

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

// Interceptor de resposta para debug
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.config?.url, error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;
