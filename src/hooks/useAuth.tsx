// src/hooks/useAuth.ts
import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "@/services/api/auth.service";
import type { AuthUser } from "@/services/api/auth.service";

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<void>;
  register: (
    name: string,
    email: string,
    phone: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session dari localStorage / sessionStorage
  useEffect(() => {
    const storedToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  /* =========================
     LOGIN
  ========================= */
  const login = async (email: string, password: string, rememberMe = true) => {
    const res = await loginUser({ email, password });

    if (!res.success || !res.data) {
      throw new Error(res.message || "Login gagal");
    }

    setUser(res.data.user);
    setToken(res.data.token);

    if (rememberMe) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    } else {
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  /* =========================
     REGISTER
  ========================= */
  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string,
    rememberMe = true,
  ) => {
    const res = await registerUser({ name, email, phone, password });

    if (!res.success || !res.data) {
      throw new Error(res.message || "Register gagal");
    }

    setUser(res.data.user);
    setToken(res.data.token);

    if (rememberMe) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    } else {
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  /* =========================
     LOGOUT
  ========================= */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =========================
   HOOK
========================= */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
