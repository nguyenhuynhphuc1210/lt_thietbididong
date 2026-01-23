import api from "@/constants/api";

export const checkout = async (payload: any) => {
  const res = await api.post("/checkout", payload);

  return res.data;
};
