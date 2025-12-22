import api from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const login = async (username: string, password: string) => {
  const res = await api.post("/auth/login", { username, password });
  await AsyncStorage.setItem("user", JSON.stringify(res.data));
  return res.data;
};

export const register = async (data: {
  username: string;
  password: string;
  email: string;
  fullName: string;
  phone: string;
}) => {
  return api.post("/auth/register", data);
};

export const logout = async () => {
  await AsyncStorage.removeItem("user");
};
