import api from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getUserId = async (): Promise<number> => {
  const stored = await AsyncStorage.getItem("user");
  if (!stored) throw new Error("Bạn cần đăng nhập");

  const user = JSON.parse(stored);
  return user.user.id;
};

// GET CART
export const getCart = async () => {
  const userId = await getUserId();
  return api.get("/cart", { params: { userId } });
};

// ADD TO CART
export const addToCart = async (productId: number, quantity = 1) => {
  const userId = await getUserId();
  return api.post(
    "/cart/add",
    { productId, quantity },
    { params: { userId } }
  );
};

// REMOVE ITEM
export const removeFromCart = async (productId: number) => {
  const userId = await getUserId();
  return api.delete("/cart/remove", {
    params: { userId, productId },
  });
};

// CLEAR CART
export const clearCart = async () => {
  const userId = await getUserId();
  return api.delete("/cart/clear", {
    params: { userId },
  });
};
