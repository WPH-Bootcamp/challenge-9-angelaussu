// src/context/AuthContext.tsx
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  login: (data: { user: AuthUser; token: string }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(
    JSON.parse(localStorage.getItem("auth_user") || "null"),
  );

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("auth_token"),
  );

  const login = ({ user, token }: { user: AuthUser; token: string }) => {
    setUser(user);
    setToken(token);

    localStorage.setItem("auth_user", JSON.stringify(user));
    localStorage.setItem("auth_token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
