import api from "./axios";

/* =========================
   TYPES
========================= */

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  data?: {
    user: AuthUser;
    token: string;
  };
  errors?: string[];
};

/* =========================
   REGISTER
========================= */
export const registerUser = async (payload: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) => {
  const res = await api.post<AuthResponse>("/api/auth/register", payload);
  return res.data;
};

/* =========================
   LOGIN
========================= */
export const loginUser = async (payload: {
  email: string;
  password: string;
}) => {
  const res = await api.post<AuthResponse>("/api/auth/login", payload);
  return res.data;
};

/* =========================
   ALIAS (UNTUK KOMPATIBILITAS)
========================= */
export const loginApi = loginUser;
export const registerApi = registerUser;
