import {
    addToCart,
    clearCart,
    getCart,
    removeFromCart,
} from "@/services/cartService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useRef, useState } from "react";

type CartItem = {
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (productId: number, qty?: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  decreaseItem: (productId: number) => Promise<void>;
  clear: () => Promise<void>;
  refresh: () => Promise<void>;
};

const CartContext = createContext<CartContextType>({} as CartContextType);

const STORAGE_KEY = "cart_cache";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const syncing = useRef(false);

  /* ================= LOAD CACHE FIRST ================= */
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((cache) => {
      if (cache) setItems(JSON.parse(cache));
    });

    refresh(); // sync server sau
  }, []);

  /* ================= PERSIST ================= */
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  /* ================= API SYNC ================= */
  const refresh = async () => {
    if (syncing.current) return;
    syncing.current = true;

    try {
      const res = await getCart();
      setItems(res.data);
    } catch (e) {
      console.log("Cart sync error:", e);
    } finally {
      syncing.current = false;
    }
  };

  /* ================= HELPERS ================= */
  const optimisticAdd = (productId: number, qty: number) => {
    setItems((prev) => {
      const found = prev.find((i) => i.productId === productId);
      if (found) {
        return prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return prev; // server sẽ trả item đầy đủ
    });
  };

  /* ================= ACTIONS ================= */
  const addItem = async (productId: number, qty = 1) => {
    optimisticAdd(productId, qty);

    try {
      await addToCart(productId, qty);
      refresh();
    } catch (e) {
      refresh(); // rollback
      throw e;
    }
  };

  const decreaseItem = async (productId: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0)
    );

    try {
      await removeFromCart(productId);
      refresh();
    } catch (e) {
      refresh();
      throw e;
    }
  };

  const removeItem = async (productId: number) => {
    const backup = items;
    setItems((prev) => prev.filter((i) => i.productId !== productId));

    try {
      await removeFromCart(productId);
    } catch (e) {
      setItems(backup);
      throw e;
    }
  };

  const clear = async () => {
    const backup = items;
    setItems([]);

    try {
      await clearCart();
    } catch (e) {
      setItems(backup);
      throw e;
    }
  };

  /* ================= DERIVED ================= */
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.quantity * i.price, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        total,
        addItem,
        decreaseItem,
        removeItem,
        clear,
        refresh,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
