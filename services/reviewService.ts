import api from "@/constants/api";

export const createReview = (data: {
  productId: number;
  rating: number;
  comment?: string;
}) => api.post("/reviews", data);

export const getReviewsByProduct = (productId: number) =>
  api.get(`/reviews/product/${productId}`);
