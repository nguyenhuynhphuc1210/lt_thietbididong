import AppHeader from "@/components/AppHeader";
import ProductCard from "@/components/ProductCard";
import api from "@/constants/api";
import { useCart } from "@/contexts/CartContext";
import { LinearGradient } from "expo-linear-gradient";
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
  { id: 1, image: require("@/assets/images/banner1.jpg") },
  { id: 2, image: require("@/assets/images/banner2.jpg") },
  { id: 3, image: require("@/assets/images/banner3.jpg") },
];

export default function HomeScreen() {
  const { addItem } = useCart();
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
        <ActivityIndicator size="large" color="#C9A862" />
      </View>
    );
  }

  /* ================= UI ================= */
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <AppHeader />

        {/* SEARCH BOX - Luxury Style */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              placeholder="Tìm kiếm đồng hồ cao cấp..."
              placeholderTextColor="#999"
              value={keyword}
              onChangeText={setKeyword}
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* BANNER CAROUSEL */}
        <View style={styles.bannerSection}>
          <FlatList
            data={banners}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(i) => i.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.bannerWrapper}>
                <Image
                  source={item.image}
                  style={styles.banner}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.4)"]}
                  style={styles.bannerOverlay}
                />
              </View>
            )}
          />
        </View>

        {/* CATEGORY SECTION */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Danh Mục</Text>
            <View style={styles.divider} />
          </View>
          
          <FlatList
            horizontal
            data={categories}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(i) => i.id.toString()}
            contentContainerStyle={styles.categoryList}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  setSelectedCategory(
                    selectedCategory === item.id ? null : item.id
                  )
                }
              >
                <View
                  style={[
                    styles.categoryChip,
                    selectedCategory === item.id && styles.categoryActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === item.id && styles.categoryTextActive,
                    ]}
                  >
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* BRAND SECTION */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Thương Hiệu Nổi Bật</Text>
            <View style={styles.divider} />
          </View>
          
          <FlatList
            horizontal
            data={brands}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(i) => i.id.toString()}
            contentContainerStyle={styles.brandList}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  setSelectedBrand(selectedBrand === item.id ? null : item.id)
                }
              >
                <View
                  style={[
                    styles.brandCard,
                    selectedBrand === item.id && styles.brandCardActive,
                  ]}
                >
                  <View style={styles.brandLogoWrapper}>
                    <Image
                      source={{ uri: item.logoUrl }}
                      style={styles.brandLogo}
                    />
                  </View>
                  <Text numberOfLines={1} style={styles.brandName}>
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* PRODUCT SECTION */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bộ Sưu Tập</Text>
            <View style={styles.divider} />
          </View>
          
          {filteredProducts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>
            </View>
          ) : (
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
          )}
        </View>

        {/* BOTTOM SPACING */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F5F5F0" 
  },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "#F5F5F0"
  },

  /* SEARCH */
  searchWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1A1A1A",
    fontWeight: "400",
  },

  /* BANNER */
  bannerSection: {
    marginTop: 8,
    marginBottom: 20,
  },
  bannerWrapper: {
    position: "relative",
  },
  banner: {
    width: width - 40,
    height: 180,
    borderRadius: 20,
    marginHorizontal: 20,
  },
  bannerOverlay: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 20,
    height: 80,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  /* SECTION */
  section: { 
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: { 
    fontSize: 22, 
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: 0.3,
  },
  divider: {
    width: 40,
    height: 3,
    backgroundColor: "#C9A862",
    marginTop: 8,
    borderRadius: 2,
  },

  /* CATEGORY */
  categoryList: {
    paddingVertical: 4,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: "#E8E8E8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryActive: { 
    backgroundColor: "#1A1A1A",
    borderColor: "#1A1A1A",
  },
  categoryText: { 
    color: "#4A4A4A",
    fontSize: 14,
    fontWeight: "600",
  },
  categoryTextActive: { 
    color: "#FFFFFF",
  },

  /* BRAND */
  brandList: {
    paddingVertical: 4,
  },
  brandCard: {
    width: 130,
    padding: 16,
    marginRight: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  brandCardActive: { 
    borderColor: "#C9A862",
    borderWidth: 2,
    backgroundColor: "#FFFEF8",
  },
  brandLogoWrapper: {
    width: "100%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  brandLogo: { 
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  brandName: { 
    fontSize: 13,
    marginTop: 10,
    color: "#2A2A2A",
    fontWeight: "600",
    textAlign: "center",
  },

  /* PRODUCT GRID */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
  },

  /* EMPTY STATE */
  emptyState: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#999",
    fontWeight: "500",
  },
});