import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// REQUEST INTERCEPTOR — Attach JWT token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE INTERCEPTOR — Handle 401 globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ───
export const authAPI = {
  register: (data: { email: string; password: string }) =>
    apiClient.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    apiClient.post('/auth/login', data),
};

// ─── Products API ───
export const productsAPI = {
  getAll: (page = 1, limit = 12) =>
    apiClient.get('/products', { params: { page, limit } }),
  getOne: (id: string) => apiClient.get(`/products/${id}`),
  create: (data: object) => apiClient.post('/products', data),
  update: (id: string, data: object) => apiClient.patch(`/products/${id}`, data),
  delete: (id: string) => apiClient.delete(`/products/${id}`),
};

// ─── Variants API ───
export const variantsAPI = {
  create: (data: object) => apiClient.post('/variants', data),
  getByProduct: (productId: string) =>
    apiClient.get(`/variants/product/${productId}`),
  updateStock: (id: string, quantity: number) =>
    apiClient.patch(`/variants/${id}/stock`, { quantity }),
  delete: (id: string) => apiClient.delete(`/variants/${id}`),
};

export default apiClient;