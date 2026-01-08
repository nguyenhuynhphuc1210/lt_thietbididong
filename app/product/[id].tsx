import api from "@/constants/api";
import { useCart } from "@/contexts/CartContext";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

/* ================= TYPES ================= */
interface ProductDetail {
  id: number;
  name: string;
  brandName: string;
  categoryName: string;
  price: number;
  description?: string;
  specification?: string;
  images: { imageUrl: string }[];
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addItem } = useCart();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (e) {
        console.log("Load product error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* ================= HANDLERS ================= */
  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setAdding(true);
      await addItem(product.id, 1);

      Toast.show({
        type: "success",
        text1: "Đã thêm vào giỏ hàng",
        position: "bottom",
        visibilityTime: 1200,
      });
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: e?.message || "Bạn cần đăng nhập",
        position: "bottom",
      });
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    try {
      await addItem(product.id, 1);
      router.push("/cart");
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: e?.message || "Bạn cần đăng nhập",
      });
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy sản phẩm</Text>
      </View>
    );
  }

  /* ================= UI ================= */
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ===== IMAGES ===== */}
        <View style={styles.imageWrapper}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            {product.images.map((img, idx) => (
              <Image key={idx} source={{ uri: img.imageUrl }} style={styles.image} />
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.heartBtn}
            onPress={() => setWishlisted(!wishlisted)}
          >
            <Ionicons
              name={wishlisted ? "heart" : "heart-outline"}
              size={22}
              color={wishlisted ? "#ef4444" : "#111"}
            />
          </TouchableOpacity>
        </View>

        {/* ===== INFO ===== */}
        <View style={styles.content}>
          <View style={styles.meta}>
            <Text style={styles.brand}>{product.brandName}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.category}>{product.categoryName}</Text>
          </View>

          <Text style={styles.name}>{product.name}</Text>

          <Text style={styles.price}>
            {product.price.toLocaleString("vi-VN")} đ
          </Text>

          <Text style={styles.section}>Mô tả</Text>
          <Text style={styles.desc}>
            {product.description || "Đồng hồ chính hãng cao cấp."}
          </Text>

          <Text style={styles.section}>Thông số kỹ thuật</Text>
          <View style={styles.specBox}>
            <Text style={styles.specText}>
              {product.specification || "Đang cập nhật."}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ===== BOTTOM BAR ===== */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.cartBtn}
          onPress={handleAddToCart}
          disabled={adding}
        >
          <Ionicons name="cart-outline" size={20} />
          <Text style={styles.cartText}>
            {adding ? "Đang thêm..." : "Thêm giỏ"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buyBtn} onPress={handleBuyNow}>
          <Text style={styles.buyText}>Mua ngay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  imageWrapper: { position: "relative" },
  image: { width, height: 320 },

  backBtn: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "#fff",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },

  heartBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#fff",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },

  content: { padding: 16 },

  meta: { flexDirection: "row", alignItems: "center" },
  brand: { fontSize: 12, color: "#999" },
  dot: { marginHorizontal: 6, color: "#999" },
  category: { fontSize: 12, color: "#999" },

  name: { fontSize: 20, fontWeight: "700", marginVertical: 6 },
  price: { fontSize: 22, fontWeight: "700", color: "#d32f2f" },

  section: { fontSize: 16, fontWeight: "600", marginTop: 16 },
  desc: { fontSize: 14, color: "#555", lineHeight: 22 },

  specBox: {
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 10,
    marginTop: 6,
  },

  specText: { fontSize: 14, color: "#444" },

  bottomBar: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  cartBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#fbbf24",
    borderRadius: 10,
    marginRight: 10,
  },

  cartText: { marginLeft: 6, fontWeight: "600" },

  buyBtn: {
    flex: 1,
    backgroundColor: "#fbbf24",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  buyText: { fontSize: 16, fontWeight: "700" },
});
