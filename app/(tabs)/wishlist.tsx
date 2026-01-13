import ProductCard from "@/components/ProductCard";
import api from "@/constants/api";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";

export default function WishlistScreen() {
  const { wishlist } = useWishlist();
  const { addItem } = useCart();

  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (wishlist.length === 0) {
      setProducts([]);
      return;
    }

    const load = async () => {
      const res = await api.get("/products");
      const all = res.data;
      setProducts(all.filter((p: any) => wishlist.includes(p.id)));
    };

    load();
  }, [wishlist]);

  /* ===== empty ===== */
  if (wishlist.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Bạn chưa có sản phẩm yêu thích ❤️</Text>
      </View>
    );
  }

  /* ===== UI ===== */
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Yêu thích</Text>

      <View style={styles.grid}>
        {products.map((p) => (
          <ProductCard
            key={p.id}
            id={p.id}
            name={p.name}
            price={p.price}
            brandName={p.brandName}
            imageUrl={p.images[0]?.imageUrl}
            onPress={() => router.push(`/product/${p.id}`)}
            onAddToCart={async () => {
              try {
                await addItem(p.id, 1);
                Toast.show({ type: "success", text1: "Đã thêm vào giỏ hàng" });
              } catch (e: any) {
                Toast.show({
                  type: "error",
                  text1: e?.message || "Bạn cần đăng nhập",
                });
              }
            }}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "700", margin: 16 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 16,
  },
});
