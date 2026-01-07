import { Ionicons } from "@expo/vector-icons";
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
  isWishlisted?: boolean;
}

export default function ProductCard({
  id,
  name,
  brandName,
  price,
  imageUrl,
  onPress,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
}: ProductCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={() => onPress?.(id)}
    >
      {/* IMAGE */}
      <View style={styles.imageWrapper}>
        <Image
          source={{
            uri: imageUrl || "https://via.placeholder.com/300",
          }}
          style={styles.image}
        />

        {/* ❤️ HEART ICON */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => onToggleWishlist?.(id)}
        >
          <Ionicons
            name={isWishlisted ? "heart" : "heart-outline"}
            size={20}
            color={isWishlisted ? "#ef4444" : "#333"}
          />
        </TouchableOpacity>
      </View>

      {/* INFO */}
      <View style={styles.info}>
        <Text style={styles.brand}>{brandName}</Text>

        <Text numberOfLines={2} style={styles.name}>
          {name}
        </Text>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>
            {price.toLocaleString("vi-VN")} đ
          </Text>

          {/* 🛒 CART ICON */}
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => onAddToCart?.(id)}
          >
            <Ionicons name="cart-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: (width - 40) / 2,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },

  /* IMAGE */
  imageWrapper: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  /* HEART */
  heartButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },

  /* INFO */
  info: {
    padding: 10,
  },
  brand: {
    fontSize: 11,
    color: "#999",
    textTransform: "uppercase",
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    marginVertical: 4,
    height: 40,
  },

  /* PRICE + CART */
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#d32f2f",
  },
  cartButton: {
    backgroundColor: "#fbbf24",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
