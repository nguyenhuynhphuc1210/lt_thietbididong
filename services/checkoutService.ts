import api from "@/constants/api";

export const checkout = async (payload: any) => {
  console.log("📦 CHECKOUT PAYLOAD =", payload);

  const res = await api.post("/checkout", payload);

  console.log("✅ CHECKOUT RESPONSE =", res.data);

  return res.data;
};
