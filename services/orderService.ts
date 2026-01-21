import api from "@/constants/api";

export const getMyOrders = () => api.get("/orders");

export const getOrderDetail = (orderCode: string) =>
  api.get(`/orders/${orderCode}`);

export const cancelOrder = (orderCode: string) =>
  api.put(`/orders/${orderCode}/cancel`);
