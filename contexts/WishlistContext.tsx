import { getCurrentUser } from "@/hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

interface WishlistContextType {
  wishlist: number[];
  isWishlisted: (id: number) => boolean;
  toggleWishlist: (id: number) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  isWishlisted: () => false,
  toggleWishlist: async () => {},
});

export const WishlistProvider = ({ children }: any) => {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  /* ⭐ TỰ ĐỒNG BỘ KHI ĐỔI USER */
  useEffect(() => {
    const loadUserAndWishlist = async () => {
      const data = await getCurrentUser();

      const newUserId = data?.id ?? null;

      // nếu đổi user → reset & load lại
      if (newUserId !== userId) {
        setUserId(newUserId);

        if (!newUserId) {
          setWishlist([]);
          return;
        }

        const key = `wishlist_${newUserId}`;
        const saved = await AsyncStorage.getItem(key);

        setWishlist(saved ? JSON.parse(saved) : []);
      }
    };

    // chạy lần đầu + mỗi 1s kiểm tra tài khoản thay đổi
    const interval = setInterval(loadUserAndWishlist, 1000);

    return () => clearInterval(interval);
  }, [userId]);

  const isWishlisted = (id: number) => wishlist.includes(id);

  const toggleWishlist = async (productId: number) => {
    if (!userId) return;

    let newList: number[];

    if (wishlist.includes(productId)) {
      newList = wishlist.filter((x) => x !== productId);
    } else {
      newList = [...wishlist, productId];
    }

    setWishlist(newList);

    await AsyncStorage.setItem(`wishlist_${userId}`, JSON.stringify(newList));
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, isWishlisted, toggleWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
