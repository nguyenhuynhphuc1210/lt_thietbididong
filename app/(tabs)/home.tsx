import AppHeader from "@/components/AppHeader";
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
import ProductCard from "../../components/ProductCard";
import api from "../../constants/api";

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [resCat, resBrand, resProd] = await Promise.all([
        api.get("/categories"),
        api.get("/brands"),
        api.get("/products"),
      ]);

      setCategories(resCat.data);
      setBrands(resBrand.data);
      setProducts(resProd.data);
    } catch (error) {
      console.error("Lỗi API:", error);
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

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ===== HEADER ===== */}
        <AppHeader />

        {/* ===== SEARCH ===== */}
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Tìm kiếm đồng hồ..."
            value={keyword}
            onChangeText={setKeyword}
            style={styles.searchInput}
          />
        </View>

        {/* ===== BANNER ===== */}
        <FlatList
          data={banners}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item.image }} style={styles.banner} />
          )}
        />

        {/* ===== CATEGORY ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danh mục</Text>
          <FlatList
            horizontal
            data={categories}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
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
                    styles.categoryBadge,
                    selectedCategory === item.id && styles.activeBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === item.id && styles.activeText,
                    ]}
                  >
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* ===== BRAND ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thương hiệu</Text>
          <FlatList
            horizontal
            data={brands}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  setSelectedBrand(selectedBrand === item.id ? null : item.id)
                }
              >
                <View
                  style={[
                    styles.brandCard,
                    selectedBrand === item.id && styles.activeBrand,
                  ]}
                >
                  <Image
                    source={{ uri: item.logoUrl }}
                    style={styles.brandLogo}
                  />
                  <Text style={styles.brandName}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* ===== PRODUCT ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sản phẩm</Text>
          <View style={styles.productGrid}>
            {filteredProducts.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                name={item.name}
                brandName={item.brandName}
                price={item.price}
                imageUrl={item.images[0]?.imageUrl}
                onPress={(id) =>
                  router.push({
                    pathname: "/product/[id]",
                    params: { id: id.toString() },
                  })
                }
                onAddToCart={(id) => console.log("Add cart", id)}
                onToggleWishlist={(id) => console.log("Wishlist", id)}
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
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: { paddingHorizontal: 16, marginTop: 10 },
  greeting: { fontSize: 14, color: "#666" },
  userName: { fontSize: 22, fontWeight: "700", color: "#111" },

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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  categoryText: { color: "#333" },
  activeBadge: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  activeText: { color: "#fff", fontWeight: "600" },

  brandCard: { alignItems: "center", marginRight: 16 },
  brandLogo: { width: 60, height: 60, borderRadius: 30 },
  brandName: { fontSize: 12, marginTop: 4 },
  activeBrand: { opacity: 0.6 },

  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
