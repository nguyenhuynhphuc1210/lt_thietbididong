import api from "@/constants/api";

export const chatApi = async (message: string) => {
  const res = await api.post("/chat", {
    message,
  });

  return res.data;
};
