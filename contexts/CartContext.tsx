import { useAuth } from "@/contexts/AuthContext";
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
  selected: boolean;
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
  clearSelected: () => Promise<void>;
  refresh: () => Promise<void>;
};

const CartContext = createContext<CartContextType>({} as CartContextType);

/* ================= PROVIDER ================= */

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [items, setItems] = useState<CartItem[]>([]);
  const syncing = useRef(false);

  /* ---------- helpers ---------- */
  const normalizeItems = (data: any[]): CartItem[] =>
    data.map((i) => ({
      productId: i.productId ?? i.id,
      productName: i.productName ?? i.name,
      productImage: i.productImage ?? i.image,
      price: i.price,
      quantity: i.quantity,
      selected: i.selected ?? true,
    }));

  /* ---------- storage key ---------- */
  const storageKey = userId ? `cart_${userId}` : "cart_guest";

  /* ---------- load cart when user changes ---------- */
  useEffect(() => {
    const load = async () => {
      const cache = await AsyncStorage.getItem(storageKey);

      if (cache) {
        setItems(normalizeItems(JSON.parse(cache)));
      } else {
        setItems([]);
      }

      if (userId) {
        try {
          const res = await getCart();
          setItems(normalizeItems(res.data || []));
        } catch {}
      }
    };

    load();
  }, [userId, storageKey]);

  /* ---------- persist cache ---------- */
  useEffect(() => {
    AsyncStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  /* ---------- refresh from API ---------- */
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

  /* ================= ACTIONS ================= */

  const addItem = async (productId: number, qty = 1) => {
    setItems((prev) => {
      const exist = prev.find((i) => i.productId === productId);

      if (exist) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + qty } : i,
        );
      }

      return [
        ...prev,
        {
          productId,
          productName: "",
          productImage: "",
          price: 1,
          quantity: qty,
          selected: true,
        },
      ];
    });

    if (userId) {
      try {
        await addToCart(productId, qty);
        await refresh();
      } catch {}
    }
  };

  const decreaseItem = async (productId: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i,
        )
        .filter((i) => i.quantity > 0),
    );

    if (userId) {
      try {
        await decreaseFromCart(productId);
      } catch {
        await refresh();
      }
    }
  };

  const removeItem = async (productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
    if (userId) await removeFromCart(productId);
  };

  const clear = async () => {
    setItems([]);
    if (userId) await clearCart();
  };

  const clearSelected = async () => {
    const selectedIds = items.filter((i) => i.selected).map((i) => i.productId);

    setItems((prev) => prev.filter((i) => !i.selected));

    if (userId) {
      await Promise.all(selectedIds.map((id) => removeFromCart(id)));
    }
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
        clearSelected,
        refresh,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useCart = () => useContext(CartContext);
