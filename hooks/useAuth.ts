import api from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const login = async (username: string, password: string) => {
  try {
    const res = await api.post("/auth/login", { username, password });
    await AsyncStorage.setItem("user", JSON.stringify(res.data));
    return res.data;
  } catch (err) {
    throw err; // ⚠️ BẮT BUỘC
  }
};

export const register = async (data: {
  username: string;
  password: string;
  email: string;
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

export const logout = async () => {
  await AsyncStorage.removeItem("user");
};
