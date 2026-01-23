import { useAuth } from "@/contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface WishlistContextType {
  wishlist: number[];
  isWishlisted: (id: number) => boolean;
  toggleWishlist: (id: number) => Promise<void>;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  isWishlisted: () => false,
  toggleWishlist: async () => {},
  clearWishlist: () => {},
});

export const WishlistProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [wishlist, setWishlist] = useState<number[]>([]);

  /* ⭐ SYNC THEO USER */
  useEffect(() => {
    const loadWishlist = async () => {
      if (!userId) {
        setWishlist([]);
        return;
      }

      const key = `wishlist_${userId}`;
      const saved = await AsyncStorage.getItem(key);

      setWishlist(saved ? JSON.parse(saved) : []);
    };

    loadWishlist();
  }, [userId]);

  const isWishlisted = (productId: number) => {
    return wishlist.includes(productId);
  };

  const toggleWishlist = async (productId: number) => {
    if (!userId) return;

    const newWishlist = wishlist.includes(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];

    setWishlist(newWishlist);
    await AsyncStorage.setItem(
      `wishlist_${userId}`,
      JSON.stringify(newWishlist),
    );
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, isWishlisted, toggleWishlist, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
