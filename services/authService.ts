import api from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAT_STORAGE_KEY = "CHAT_MESSAGES";

export const authService = {
  login: async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });

    await AsyncStorage.setItem("token", res.data.token);
    await AsyncStorage.setItem("user", JSON.stringify(res.data.user));

    return res.data;
  },

  register: async (data: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
  }) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  forgotPassword: async (email: string) => {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data;
  },

  verifyOtp: async (data: { email: string; otp: string }) => {
    const res = await api.post("/auth/verify-otp", data);
    return res.data;
  },

  resetPassword: async (data: { email: string; newPassword: string }) => {
    const res = await api.post("/auth/reset-password", data);
    return res.data;
  },

  getCurrentUser: async () => {
    const userStr = await AsyncStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  logout: async () => {
    await AsyncStorage.multiRemove(["token", "user", CHAT_STORAGE_KEY]);
  },
};
