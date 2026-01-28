import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: attach token automatically
api.interceptors.request.use(async (config) => {
  // TODO: read token from Zustand or SecureStore
  // const token = useUserStore.getState().token;
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Optional: global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
