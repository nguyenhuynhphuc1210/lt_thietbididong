import AppHeader from "@/components/AppHeader";
import ProductCard from "@/components/ProductCard";
import api from "@/constants/api";
import { useCart } from "@/contexts/CartContext";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

/* ================= TYPES ================= */
interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
  logoUrl: string;
}

interface Product {
  id: number;
  name: string;
  brandId: number;
  brandName: string;
  categoryId: number;
  price: number;
  images: { imageUrl: string }[];
}

/* ================= MOCK BANNER ================= */
const banners = [
  { id: 1, image: "https://i.imgur.com/5KZ6K0p.jpg" },
  { id: 2, image: "https://i.imgur.com/9Qn5K7B.jpg" },
  { id: 3, image: "https://i.imgur.com/NvZ4GzK.jpg" },
];

export default function HomeScreen() {
  const { addItem } = useCart(); // ⭐ realtime cart
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);

  useEffect(() => {
    loadHome();
  }, []);

  const loadHome = async () => {
    try {
      const [c, b, p] = await Promise.all([
        api.get("/categories"),
        api.get("/brands"),
        api.get("/products"),
      ]);

      setCategories(c.data);
      setBrands(b.data);
      setProducts(p.data);
    } catch (err) {
      console.log("Home API error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER ================= */
  const filteredProducts = products.filter((p) => {
    const matchKeyword = p.name.toLowerCase().includes(keyword.toLowerCase());
    const matchCategory =
      !selectedCategory || p.categoryId === selectedCategory;
    const matchBrand = !selectedBrand || p.brandId === selectedBrand;

    return matchKeyword && matchCategory && matchBrand;
  });

  /* ================= ADD TO CART ================= */
  const handleAddToCart = async (productId: number) => {
    try {
      await addItem(productId, 1);

      Toast.show({
        type: "success",
        text1: "Đã thêm vào giỏ hàng",
        position: "bottom",
        visibilityTime: 1000,
      });
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: e?.message || "Bạn cần đăng nhập",
        position: "bottom",
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

  /* ================= UI ================= */
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <AppHeader />

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Tìm kiếm đồng hồ..."
            value={keyword}
            onChangeText={setKeyword}
            style={styles.searchInput}
          />
        </View>

        {/* BANNER */}
        <FlatList
          data={banners}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(i) => i.id.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item.image }} style={styles.banner} />
          )}
        />

        {/* CATEGORY */}
        <View style={styles.section}>
          <Text style={styles.title}>Danh mục</Text>
          <FlatList
            horizontal
            data={categories}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(i) => i.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  setSelectedCategory(
                    selectedCategory === item.id ? null : item.id
                  )
                }
              >
                <View
                  style={[
                    styles.badge,
                    selectedCategory === item.id && styles.badgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      selectedCategory === item.id && styles.badgeTextActive,
                    ]}
                  >
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* BRAND */}
        <View style={styles.section}>
          <Text style={styles.title}>Thương hiệu</Text>
          <FlatList
            horizontal
            data={brands}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(i) => i.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  setSelectedBrand(selectedBrand === item.id ? null : item.id)
                }
              >
                <View
                  style={[
                    styles.brandCard,
                    selectedBrand === item.id && styles.brandActive,
                  ]}
                >
                  <Image
                    source={{ uri: item.logoUrl }}
                    style={styles.brandLogo}
                  />
                  <Text numberOfLines={1} style={styles.brandName}>
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* PRODUCT */}
        <View style={styles.section}>
          <Text style={styles.title}>Sản phẩm</Text>
          <View style={styles.grid}>
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                brandName={p.brandName}
                price={p.price}
                imageUrl={p.images[0]?.imageUrl}
                onPress={() => router.push(`/product/${p.id}`)}
                onAddToCart={() => handleAddToCart(p.id)}
                onToggleWishlist={() => {}}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  searchBox: { margin: 16 },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },

  banner: {
    width: width - 32,
    height: 160,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 10,
  },

  section: { marginTop: 20, paddingHorizontal: 16 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12 },

  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  badgeActive: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  badgeText: { color: "#333" },
  badgeTextActive: { color: "#fff", fontWeight: "600" },

  brandCard: {
    width: 110,
    padding: 10,
    marginRight: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  brandActive: { borderColor: "#007AFF" },
  brandLogo: { width: 90, height: 50, resizeMode: "contain" },
  brandName: { fontSize: 12, marginTop: 6 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
