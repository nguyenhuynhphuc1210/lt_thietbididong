import { useWishlist } from "@/contexts/WishlistContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface ProductCardProps {
  id: number;
  name: string;
  brandName: string;
  price: number;
  imageUrl?: string;
  onPress?: (id: number) => void;
  onAddToCart?: (id: number) => void;
  onToggleWishlist?: (id: number) => void;
}

/* FORMAT PRICE – tránh tràn */
const formatPrice = (price: number) => {
  if (price >= 1_000_000_000)
    return (price / 1_000_000_000).toFixed(1) + "B ₫";
  if (price >= 1_000_000)
    return (price / 1_000_000).toFixed(1) + "M ₫";
  return price.toLocaleString("vi-VN") + " ₫";
};

export default function ProductCard({
  id,
  name,
  brandName,
  price,
  imageUrl,
  onPress,
  onAddToCart,
}: ProductCardProps) {
  const { isWishlisted, toggleWishlist } = useWishlist();

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      style={styles.card}
      onPress={() => onPress?.(id)}
    >
      {/* IMAGE */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: imageUrl || "https://via.placeholder.com/300" }}
          style={styles.image}
        />

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.15)"]}
          style={styles.imageGradient}
        />

        {/* WISHLIST */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={(e) => {
            e.stopPropagation();
            toggleWishlist(id);
          }}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isWishlisted(id) ? "heart" : "heart-outline"}
            size={20}
            color={isWishlisted(id) ? "#EF4444" : "#1A1A1A"}
          />
        </TouchableOpacity>
      </View>

      {/* INFO */}
      <View style={styles.info}>
        <Text style={styles.brand} numberOfLines={1}>
          {brandName}
        </Text>

        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>

        {/* PRICE + CART */}
        <View style={styles.bottomRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Giá</Text>
            <Text
              style={styles.price}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {formatPrice(price)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.cartButton}
            onPress={(e) => {
              e.stopPropagation();
              onAddToCart?.(id);
            }}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={["#C9A862", "#A68B4D"]}
              style={styles.cartGradient}
            >
              <Ionicons name="cart-outline" size={18} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* ACCENT */}
      <View style={styles.accentLine} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: (width - 48) / 2,
    backgroundColor: "#FFF",
    borderRadius: 18,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F0F0F0",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },

  /* IMAGE */
  imageWrapper: {
    position: "relative",
    backgroundColor: "#F8F8F8",
  },
  image: {
    width: "100%",
    height: 180,
  },
  imageGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
  },

  /* HEART */
  heartButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  /* INFO */
  info: {
    padding: 14,
  },

  brand: {
    fontSize: 11,
    color: "#C9A862",
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 4,
    textTransform: "uppercase",
  },

  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    lineHeight: 20,
    height: 40,
    marginBottom: 8,
  },

  /* PRICE + CART */
  bottomRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },

  priceContainer: {
    flex: 1,
    paddingRight: 4,
  },

  priceLabel: {
    fontSize: 10,
    color: "#999",
    textTransform: "uppercase",
    marginBottom: 2,
  },

  price: {
    fontSize: 16,
    fontWeight: "800",
    color: "#C9A862",
  },

  cartButton: {
    minWidth: 40,
    height: 40,
    borderRadius: 14,
    overflow: "hidden",

    shadowColor: "#C9A862",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  cartGradient: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  /* ACCENT */
  accentLine: {
    position: "absolute",
    bottom: 0,
    left: 14,
    right: 14,
    height: 2,
    backgroundColor: "#C9A862",
    opacity: 0.2,
  },
});
