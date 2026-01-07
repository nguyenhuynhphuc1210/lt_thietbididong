import api from "@/constants/api";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
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

const { width } = Dimensions.get("window");

interface ProductDetail {
  id: number;
  name: string;
  brandName: string;
  price: number;
  description?: string;
  images: { imageUrl: string }[];
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.log("Lỗi load product:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text>Không tìm thấy sản phẩm</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ===== IMAGE GALLERY ===== */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        >
          {product.images.map((img, index) => (
            <Image
              key={index}
              source={{ uri: img.imageUrl }}
              style={styles.image}
            />
          ))}
        </ScrollView>

        {/* ❤️ HEART */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => setWishlisted(!wishlisted)}
        >
          <Ionicons
            name={wishlisted ? "heart" : "heart-outline"}
            size={22}
            color={wishlisted ? "#ef4444" : "#111"}
          />
        </TouchableOpacity>

        {/* ===== INFO ===== */}
        <View style={styles.content}>
          <Text style={styles.brand}>{product.brandName}</Text>
          <Text style={styles.name}>{product.name}</Text>

          <Text style={styles.price}>
            {product.price.toLocaleString("vi-VN")} đ
          </Text>

          <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
          <Text style={styles.description}>
            {product.description || "Đồng hồ cao cấp chính hãng."}
          </Text>
        </View>
      </ScrollView>

      {/* ===== BOTTOM ACTION ===== */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.cartBtn}
          onPress={() => console.log("Add cart", product.id)}
        >
          <Ionicons name="cart-outline" size={20} color="#111" />
          <Text style={styles.cartText}>Thêm giỏ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buyBtn}
          onPress={() => console.log("Buy now", product.id)}
        >
          <Text style={styles.buyText}>Mua ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },

  image: {
    width,
    height: 320,
  },

  heartButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#fff",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  content: {
    padding: 16,
  },

  brand: {
    fontSize: 12,
    color: "#999",
    textTransform: "uppercase",
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    marginVertical: 6,
  },

  price: {
    fontSize: 22,
    fontWeight: "700",
    color: "#d32f2f",
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },

  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },

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

  cartText: {
    marginLeft: 6,
    fontWeight: "600",
  },

  buyBtn: {
    flex: 1,
    backgroundColor: "#fbbf24",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  buyText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
