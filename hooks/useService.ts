import api from "@/constants/api";

export const getServices = async () => {
  const res = await api.get("/services");
  return res.data;
};
