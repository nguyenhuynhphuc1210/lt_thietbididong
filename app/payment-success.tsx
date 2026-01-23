import { useCart } from "@/contexts/CartContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const { orderCode } = useLocalSearchParams<{ orderCode: string }>();
  const { clearSelected } = useCart();

  useEffect(() => {
    clearSelected();
  }, [clearSelected]);

  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle" size={90} color="#2ecc71" />

      <Text style={styles.title}>Thanh toán thành công 🎉</Text>

      <Text style={styles.code}>
        Mã đơn hàng: <Text style={{ fontWeight: "700" }}>{orderCode}</Text>
      </Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() =>
          router.replace({
            pathname: "/orders/[orderCode]",
            params: { orderCode },
          })
        }
      >
        <Text style={styles.btnText}>Xem đơn hàng</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.replace("/")}
        style={{ marginTop: 12 }}
      >
        <Text style={{ color: "#555" }}>Về trang chủ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 16,
  },
  code: {
    marginTop: 8,
    color: "#666",
  },
  btn: {
    marginTop: 24,
    backgroundColor: "#C9A862",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
