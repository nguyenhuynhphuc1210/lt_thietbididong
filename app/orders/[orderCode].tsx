import { cancelOrder, getOrderDetail } from "@/services/orderService";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function OrderDetailScreen() {
  const { orderCode } = useLocalSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    getOrderDetail(orderCode as string).then((res) => setOrder(res.data));
  }, []);

  if (!order) return null;

  const canCancel = order.status === "PENDING";

  return (
    <ScrollView style={styles.container}>
      {/* ===== HEADER ===== */}
      <LinearGradient colors={["#C9A862", "#A68B4D"]} style={styles.header}>
        {/* BACK */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.replace("/orders")}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>

        {/* TITLE */}
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.orderCode}>{order.orderCode}</Text>
          <Text style={styles.status}>{order.status}</Text>
        </View>

        {/* placeholder để canh giữa */}
        <View style={{ width: 36 }} />
      </LinearGradient>

      {/* ===== INFO ===== */}
      <View style={styles.card}>
        <InfoRow label="📅 Ngày tạo" value={formatDate(order.createdAt)} />
        <InfoRow label="📍 Địa chỉ" value={order.shippingAddress} />
        <InfoRow label="📝 Ghi chú" value={order.note || "—"} />
      </View>

      {/* ===== PRODUCTS ===== */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🛒 Sản phẩm</Text>

        {order.orderDetails.map((item: any) => (
          <View key={item.productId} style={styles.productRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.productName}>{item.productName}</Text>
              <Text style={styles.sub}>
                {item.quantity} × {item.price.toLocaleString()} ₫
              </Text>
            </View>

            <Text style={styles.productTotal}>
              {item.total.toLocaleString()} ₫
            </Text>
          </View>
        ))}
      </View>

      {/* ===== TOTAL ===== */}
      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Tổng thanh toán</Text>
        <Text style={styles.totalAmount}>
          {order.totalAmount.toLocaleString()} ₫
        </Text>
      </View>

      {/* ===== CANCEL ===== */}
      {canCancel && (
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() =>
            Alert.alert("Hủy đơn hàng?", "Bạn có chắc muốn hủy đơn này?", [
              { text: "Không" },
              {
                text: "Hủy",
                onPress: async () => {
                  await cancelOrder(order.orderCode);
                  router.back();
                },
              },
            ])
          }
        >
          <Text style={styles.cancelText}>Hủy đơn hàng</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

/* ===== COMPONENT ===== */

const InfoRow = ({ label, value }: any) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const formatDate = (iso: string) => new Date(iso).toLocaleString("vi-VN");

/* ===== STYLES ===== */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  header: {
    padding: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  orderCode: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  status: {
    marginTop: 4,
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },

  card: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: { color: "#555", fontWeight: "600" },
  infoValue: { color: "#111", maxWidth: "60%", textAlign: "right" },

  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  productName: { fontWeight: "600" },
  sub: { color: "#666", fontSize: 13 },
  productTotal: { fontWeight: "700", color: "#C9A862" },

  totalBox: {
    marginHorizontal: 16,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  totalLabel: { fontSize: 16, fontWeight: "700" },
  totalAmount: {
    fontSize: 18,
    fontWeight: "800",
    color: "#C9A862",
  },

  cancelBtn: {
    marginHorizontal: 16,
    marginBottom: 40,
    backgroundColor: "#ef4444",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  cancelText: { color: "#fff", fontWeight: "700" },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
});
