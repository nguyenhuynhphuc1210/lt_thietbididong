import api from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const login = async (email: string, password: string) => {
  try {
    const res = await api.post("/auth/login", { email, password });

    console.log("✅ LOGIN RESPONSE =", res.data);
    await AsyncStorage.setItem("token", res.data.token);
    await AsyncStorage.setItem("user", JSON.stringify(res.data.user));
    console.log(await AsyncStorage.getItem("token"));

    return res.data;
  } catch (err) {
    throw err;
  }
};

export const register = async (data: {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}) => {
  try {
    const res = await api.post("/auth/register", data);
    return res.data;
  } catch (err) {
    throw err;
  }
};

// Gửi OTP về email
export const forgotPassword = async (email: string) => {
  try {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data; // { message }
  } catch (err) {
    throw err;
  }
};

export const verifyOtp = async (data: { email: string; otp: string }) => {
  const res = await api.post("/auth/verify-otp", data);
  return res.data;
};

export const resetPassword = async (data: {
  email: string;
  newPassword: string;
}) => {
  try {
    const res = await api.post("/auth/reset-password", data);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getCurrentUser = async () => {
  const userStr = await AsyncStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export const logout = async () => {
  await AsyncStorage.multiRemove(["token", "user"]);
};
