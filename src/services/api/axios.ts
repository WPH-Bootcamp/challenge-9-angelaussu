import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 👉 INTERCEPTOR AUTH
api.interceptors.request.use((config) => {
  const token = import.meta.env.VITE_READ_ACCESS_TOKEN;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
