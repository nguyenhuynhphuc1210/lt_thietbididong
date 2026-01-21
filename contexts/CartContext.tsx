import { getCurrentUser } from "@/hooks/useAuth";
import {
  addToCart,
  clearCart,
  decreaseFromCart,
  getCart,
  removeFromCart,
} from "@/services/cartService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/* ================= TYPES ================= */

export type CartItem = {
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  selected: boolean; // ⭐ tick chọn
};

type CartContextType = {
  items: CartItem[];
  count: number;
  totalSelected: number;

  toggleSelectItem: (productId: number) => void;
  selectAll: (value: boolean) => void;

  addItem: (productId: number, qty?: number) => Promise<void>;
  decreaseItem: (productId: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clear: () => Promise<void>;
  refresh: () => Promise<void>;
};

const CartContext = createContext<CartContextType>({} as CartContextType);

/* ================= PROVIDER ================= */

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const syncing = useRef(false);

  /* ---------- helpers ---------- */
  const normalizeItems = (data: any[]): CartItem[] =>
    data.map((i) => ({
      ...i,
      selected: i.selected ?? true,
    }));

  /* ---------- 1. load current user ---------- */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await getCurrentUser();
        setUserId(res?.id ?? null);
      } catch {
        setUserId(null);
      }
    };
    loadUser();
  }, []);

  /* ---------- 2. storage key theo user ---------- */
  const storageKey = userId ? `cart_${userId}` : "cart_guest";

  /* ---------- 3. refresh từ API ---------- */
  const refresh = useCallback(async () => {
    if (!userId || syncing.current) return;

    syncing.current = true;
    try {
      const res = await getCart();
      setItems(normalizeItems(res.data || []));
    } catch {
      console.log("cart sync error");
    } finally {
      syncing.current = false;
    }
  }, [userId]);

  /* ---------- 4. load cache khi user thay đổi ---------- */
  useEffect(() => {
    const load = async () => {
      const cache = await AsyncStorage.getItem(storageKey);

      if (cache) setItems(normalizeItems(JSON.parse(cache)));
      else setItems([]);

      if (userId) await refresh();
    };

    load();
  }, [userId, storageKey, refresh]);

  /* ---------- 5. persist cache ---------- */
  useEffect(() => {
    AsyncStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  /* ================= ACTIONS ================= */

  const addItem = async (productId: number, qty = 1) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity: i.quantity + qty } : i,
      ),
    );

    if (userId) await addToCart(productId, qty);
    await refresh();
  };

  const decreaseItem = async (productId: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i,
        )
        .filter((i) => i.quantity > 0),
    );

    if (userId) await decreaseFromCart(productId);
    await refresh();
  };

  const removeItem = async (productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));

    if (userId) await removeFromCart(productId);
  };

  const clear = async () => {
    setItems([]);
    if (userId) await clearCart();
  };

  /* ---------- select ---------- */

  const toggleSelectItem = (productId: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, selected: !i.selected } : i,
      ),
    );
  };

  const selectAll = (value: boolean) => {
    setItems((prev) => prev.map((i) => ({ ...i, selected: value })));
  };

  /* ================= DERIVED ================= */

  const count = items.reduce((s, i) => s + i.quantity, 0);

  const totalSelected = items
    .filter((i) => i.selected)
    .reduce((s, i) => s + i.quantity * i.price, 0);

  /* ================= PROVIDER ================= */

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        totalSelected,
        toggleSelectItem,
        selectAll,
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

/* ================= HOOK ================= */

export const useCart = () => useContext(CartContext);
