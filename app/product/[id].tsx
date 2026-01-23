import api from "@/constants/api";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { getReviewsByProduct } from "@/services/reviewService";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

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
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [reviews, setReviews] = useState<any[]>([]);

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const insets = useSafeAreaInsets();

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

  useEffect(() => {
    if (!id) return;

    getReviewsByProduct(Number(id))
      .then((res) => {
        console.log("REVIEWS API:", res.data);
        setReviews(res.data);
      })
      .catch((err) => {
        console.log("ERROR:", err);
        setReviews([]);
      });
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setAdding(true);
      await addItem(product.id, 1);

      Toast.show({
        type: "success",
        text1: "Đã thêm vào giỏ hàng",
        position: "bottom",
        visibilityTime: 1000,
      });
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    await addItem(product.id, 1);
    router.push("/cart");
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#C9A862" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ===== IMAGE GALLERY ===== */}
        <View style={styles.imageWrapper}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const x = e.nativeEvent.contentOffset.x;
              const index = Math.round(x / width);
              setCurrentImageIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {product.images.map((img, idx) => (
              <View key={idx} style={styles.imageContainer}>
                <Image
                  source={{ uri: img.imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.3)"]}
                  style={styles.imageGradient}
                />
              </View>
            ))}
          </ScrollView>

          {/* IMAGE INDICATORS */}
          {product.images.length > 1 && (
            <View style={styles.indicatorContainer}>
              {product.images.map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.indicator,
                    currentImageIndex === idx && styles.indicatorActive,
                  ]}
                />
              ))}
            </View>
          )}

          {/* BACK BUTTON */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
          </TouchableOpacity>

          {/* WISHLIST BUTTON */}
          <TouchableOpacity
            style={styles.heartBtn}
            onPress={() => toggleWishlist(product.id)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isWishlisted(product.id) ? "heart" : "heart-outline"}
              size={22}
              color={isWishlisted(product.id) ? "#EF4444" : "#1A1A1A"}
            />
          </TouchableOpacity>
        </View>

        {/* ===== PRODUCT INFO ===== */}
        <View style={styles.content}>
          {/* BRAND & CATEGORY */}
          <View style={styles.metaContainer}>
            <View style={styles.metaBadge}>
              <Ionicons name="diamond-outline" size={12} color="#C9A862" />
              <Text style={styles.brandText}>{product.brandName}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaBadge}>
              <Ionicons name="pricetag-outline" size={12} color="#C9A862" />
              <Text style={styles.categoryText}>{product.categoryName}</Text>
            </View>
          </View>

          {/* PRODUCT NAME */}
          <Text style={styles.name}>{product.name}</Text>

          {/* PRICE */}
          <View style={styles.priceContainer}>
            <View style={styles.priceWrapper}>
              <Text style={styles.priceLabel}>GIÁ BÁN</Text>
              <Text style={styles.price}>
                {product.price.toLocaleString("vi-VN")}₫
              </Text>
            </View>
          </View>

          {/* DIVIDER */}
          <View style={styles.divider} />

          {/* DESCRIPTION */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#C9A862"
              />
              <Text style={styles.sectionTitle}>Mô Tả Sản Phẩm</Text>
            </View>
            <Text style={styles.descText}>
              {product.description ||
                "Đồng hồ chính hãng cao cấp với thiết kế tinh tế, chất lượng đảm bảo."}
            </Text>
          </View>

          {/* SPECIFICATIONS */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="settings-outline" size={20} color="#C9A862" />
              <Text style={styles.sectionTitle}>Thông Số Kỹ Thuật</Text>
            </View>
            <View style={styles.specBox}>
              <Text style={styles.specText}>
                {product.specification ||
                  "• Chất liệu: Thép không gỉ cao cấp\n• Kháng nước: 5ATM\n• Bảo hành: 12 tháng chính hãng"}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="star-outline" size={20} color="#C9A862" />
              <Text style={styles.sectionTitle}>Đánh giá khách hàng</Text>
            </View>

            {reviews.length === 0 ? (
              <Text style={styles.noReviewText}>
                Chưa có đánh giá nào cho sản phẩm này
              </Text>
            ) : (
              reviews.map((r) => (
                <View key={r.id} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewUser}>{r.userName}</Text>

                    <View style={styles.reviewStars}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Ionicons
                          key={i}
                          name={i <= r.rating ? "star" : "star-outline"}
                          size={14}
                          color="#facc15"
                        />
                      ))}
                    </View>
                  </View>

                  <Text style={styles.reviewComment}>{r.comment}</Text>

                  <Text style={styles.reviewDate}>{r.createdAt}</Text>
                </View>
              ))
            )}

            {/* WRITE REVIEW BUTTON */}
            <TouchableOpacity
              style={styles.reviewBtn}
              onPress={() =>
                router.push({
                  pathname: "/review",
                  params: { productId: product.id },
                })
              }
            >
              <Ionicons name="create-outline" size={16} color="#C9A862" />
              <Text style={styles.reviewBtnText}>Viết đánh giá</Text>
            </TouchableOpacity>
          </View>

          {/* FEATURES */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="shield-checkmark" size={24} color="#C9A862" />
              </View>
              <Text style={styles.featureText}>Chính Hãng{"\n"}100%</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="sync" size={24} color="#C9A862" />
              </View>
              <Text style={styles.featureText}>Đổi Trả{"\n"}7 Ngày</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="gift" size={24} color="#C9A862" />
              </View>
              <Text style={styles.featureText}>Bảo Hành{"\n"}12 Tháng</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="car" size={24} color="#C9A862" />
              </View>
              <Text style={styles.featureText}>Giao Hàng{"\n"}Miễn Phí</Text>
            </View>
          </View>

          {/* BOTTOM SPACING */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* ===== BOTTOM ACTION BAR ===== */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 },
        ]}
      >
        <TouchableOpacity
          style={styles.cartBtn}
          onPress={handleAddToCart}
          disabled={adding}
          activeOpacity={0.8}
        >
          <View style={styles.cartBtnContent}>
            <Ionicons name="cart-outline" size={20} color="#C9A862" />
            <Text style={styles.cartText}>
              {adding ? "Đang thêm..." : "Thêm giỏ"}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buyBtn}
          onPress={handleBuyNow}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={["#C9A862", "#A68B4D"]}
            style={styles.buyGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons
              name="flash"
              size={18}
              color="#FFFFFF"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.buyText}>MUA NGAY</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F0",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F0",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },

  /* IMAGE GALLERY */
  imageWrapper: {
    position: "relative",
    backgroundColor: "#FFFFFF",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width,
    height: 380,
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },

  /* IMAGE INDICATORS */
  indicatorContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 4,
  },
  indicatorActive: {
    width: 24,
    backgroundColor: "#FFFFFF",
  },

  /* BUTTONS ON IMAGE */
  backBtn: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(255,255,255,0.95)",
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  heartBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(255,255,255,0.95)",
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },

  /* CONTENT */
  content: {
    padding: 20,
    backgroundColor: "#F5F5F0",
  },

  /* META */
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(201, 168, 98, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  brandText: {
    fontSize: 12,
    color: "#C9A862",
    fontWeight: "700",
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 10,
  },
  categoryText: {
    fontSize: 12,
    color: "#C9A862",
    fontWeight: "600",
    marginLeft: 4,
  },

  /* PRODUCT NAME */
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    lineHeight: 32,
    marginBottom: 16,
    letterSpacing: 0.3,
  },

  /* PRICE */
  priceContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  priceWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#999",
    letterSpacing: 1.5,
  },
  price: {
    fontSize: 28,
    fontWeight: "800",
    color: "#C9A862",
    letterSpacing: 0.5,
  },

  /* DIVIDER */
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 20,
  },

  /* SECTION */
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginLeft: 8,
    letterSpacing: 0.3,
  },
  descText: {
    fontSize: 15,
    color: "#555",
    lineHeight: 24,
  },

  /* SPECIFICATIONS BOX */
  specBox: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#C9A862",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  specText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 22,
  },

  /* FEATURES */
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginTop: 20,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureItem: {
    alignItems: "center",
    flex: 1,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(201, 168, 98, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  featureText: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
    fontWeight: "600",
    lineHeight: 16,
  },

  /* BOTTOM BAR */
  bottomBar: {
    flexDirection: "row",
    alignItems: "center", // Đảm bảo 2 nút luôn thẳng hàng ngang
    paddingHorizontal: 16,
    paddingTop: 12, // Thêm padding top cho thoáng
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderColor: "#E8E8E8",

    // Đổ bóng cho cả thanh bar để tạo cảm giác nổi lên trên nội dung
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 10,
  },
  cartBtn: {
    borderWidth: 2,
    borderColor: "#C9A862",
    borderRadius: 14,
    marginRight: 12,
    backgroundColor: "#FFFFFF",
  },
  cartBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  cartText: {
    marginLeft: 6,
    fontWeight: "700",
    color: "#C9A862",
    fontSize: 14,
    letterSpacing: 0.5,
  },

  /* BUY BUTTON */
  buyBtn: {
    flex: 1,
    // Bỏ overflow: "hidden" ở đây để hiện shadow
    borderRadius: 14,
    backgroundColor: "#FFFFFF", // Cần có màu nền để shadow hiển thị tốt trên iOS

    // Shadow cho nút
    shadowColor: "#C9A862",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },

  buyGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 14, // Thêm borderRadius vào đây
    overflow: "hidden", // Để gradient bo theo nút
  },
  buyText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 1.5,
  },
  /* REVIEW */
  reviewItem: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  reviewUser: {
    fontWeight: "700",
    color: "#111",
  },

  reviewStars: {
    flexDirection: "row",
  },

  reviewComment: {
    color: "#444",
    lineHeight: 22,
  },

  reviewDate: {
    marginTop: 6,
    fontSize: 12,
    color: "#888",
  },

  noReviewText: {
    color: "#666",
    fontStyle: "italic",
  },

  reviewBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#C9A862",
  },

  reviewBtnText: {
    marginLeft: 6,
    fontWeight: "700",
    color: "#C9A862",
  },
});
