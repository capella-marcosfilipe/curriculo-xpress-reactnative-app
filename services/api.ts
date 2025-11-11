import axios from 'axios';
import useAuthStore from '../store/useAuthStore'; // Importa o "cofre" que criaremos a seguir

// Esta é a sua URL de deploy! Eu a peguei do seu arquivo Postman.
const API_URL = 'https://curriculo-express-api-10112025.vercel.app/api'; 

const api = axios.create({
  baseURL: API_URL,
});

/**
 * Interceptor do Axios:
 * Isso é uma função "mágica" que roda ANTES de CADA requisição.
 * Ela pega o token do nosso "cofre" (Zustand) e o anexa
 * no cabeçalho 'Authorization' automaticamente.
 * * Você nunca mais precisará se preocupar em adicionar o token manualmente
 * nas suas chamadas de API protegidas.
 */
api.interceptors.request.use(
  (config) => {
    // Pega o token de dentro do nosso "cofre" (Zustand)
    const token = useAuthStore.getState().token;

    if (token) {
      // Se o token existir, coloca ele no cabeçalho
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Em caso de erro na configuração da requisição
    return Promise.reject(error);
  }
);

export default api;