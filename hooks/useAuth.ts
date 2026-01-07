import api from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const login = async (email: string, password: string) => {
  try {
    const res = await api.post("/auth/login", { email, password });
    console.log("Dữ liệu Login trả về:", res.data);
    await AsyncStorage.setItem("user", JSON.stringify(res.data));
    return res.data;
  } catch (err) {
    throw err; // ⚠️ BẮT BUỘC
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
    return res.data; // Đảm bảo trả về dữ liệu
  } catch (err) {
    // Rất quan trọng: Phải throw err để RegisterScreen nhận biết được có lỗi
    throw err; 
  }
};

export const getCurrentUser = async () => {
  const userStr = await AsyncStorage.getItem("user");
  if (!userStr) return null;
  return JSON.parse(userStr);
};

export const logout = async () => {
  await AsyncStorage.removeItem("user");
};
