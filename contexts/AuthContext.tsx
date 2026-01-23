import { authService } from "@/services/authService";
import React, { createContext, useContext, useEffect, useState } from "react";

/* ================= TYPES ================= */

type AuthContextType = {
  user: any;
  loading: boolean;

  // auth
  login: (email: string, password: string) => Promise<any>;
  register: (data: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
  }) => Promise<any>;
  logout: () => Promise<void>;

  // forgot password
  forgotPassword: (email: string) => Promise<any>;
  verifyOtp: (data: { email: string; otp: string }) => Promise<any>;
  resetPassword: (data: { email: string; newPassword: string }) => Promise<any>;

  updateUser: (newUser: any) => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

/* ================= PROVIDER ================= */

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* ---------- init ---------- */
  useEffect(() => {
    const init = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    init();
  }, []);

  /* ---------- auth ---------- */
  const login = async (email: string, password: string) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    return data;
  };

  const register = async (data: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
  }) => {
    return authService.register(data);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  /* ---------- forgot password ---------- */
  const forgotPassword = async (email: string) => {
    return authService.forgotPassword(email);
  };

  const verifyOtp = async (data: { email: string; otp: string }) => {
    return authService.verifyOtp(data);
  };

  const resetPassword = async (data: {
    email: string;
    newPassword: string;
  }) => {
    return authService.resetPassword(data);
  };

  const updateUser = (newUser: any) => {
    setUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,

        // auth
        login,
        register,
        logout,

        // forgot password
        forgotPassword,
        verifyOtp,
        resetPassword,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useAuth = () => useContext(AuthContext);
