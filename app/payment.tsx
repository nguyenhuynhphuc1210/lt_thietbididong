import { useCart } from "@/contexts/CartContext";
import { checkout } from "@/services/checkoutService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

type PaymentMethod = "COD" | "VNPAY";

export default function PaymentScreen() {
  const router = useRouter();
  const { items, totalSelected, clearSelected } = useCart();

  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("COD");
  const [loading, setLoading] = useState(false);

  /** 👉 CHỈ LẤY ITEM ĐƯỢC CHỌN */
  const selectedItems = useMemo(() => items.filter((i) => i.selected), [items]);

  const submit = async () => {
    if (!address.trim()) {
      Toast.show({
        type: "error",
        text1: "Thiếu thông tin",
        text2: "Vui lòng nhập địa chỉ giao hàng",
      });
      return;
    }

    if (selectedItems.length === 0) {
      Toast.show({
        type: "error",
        text1: "Chưa chọn sản phẩm",
        text2: "Vui lòng chọn ít nhất 1 sản phẩm",
      });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        shippingAddress: address,
        note,
        paymentMethod: method,
        items: selectedItems.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      };

      const res = await checkout(payload);

      /* ================= COD ================= */
      if (method === "COD") {
        clearSelected();

        Toast.show({
          type: "success",
          text1: "Đặt hàng thành công 🎉",
          text2: `Mã đơn: ${res.orderCode}`,
        });

        router.replace({
          pathname: "/orders/[orderCode]",
          params: { orderCode: res.orderCode },
        });
        return;
      }

      /* ================= VNPAY ================= */
      if (method === "VNPAY" && res.paymentUrl) {
        await Linking.openURL(res.paymentUrl);
        return;
      }
    } catch (e) {
      console.log("❌ CHECKOUT ERROR =", e);
      Toast.show({
        type: "error",
        text1: "Thanh toán thất bại",
        text2: "Vui lòng thử lại",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
      </View>

      {/* ADDRESS */}
      <Text style={styles.label}>Địa chỉ giao hàng</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập địa chỉ"
        value={address}
        onChangeText={setAddress}
      />

      {/* NOTE */}
      <Text style={styles.label}>Ghi chú</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Ghi chú cho shop (không bắt buộc)"
        value={note}
        onChangeText={setNote}
        multiline
      />

      {/* PAYMENT METHOD */}
      <Text style={styles.label}>Phương thức thanh toán</Text>

      <TouchableOpacity style={styles.radio} onPress={() => setMethod("COD")}>
        <View style={[styles.dot, method === "COD" && styles.active]} />
        <Text>Thanh toán khi nhận hàng (COD)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.radio} onPress={() => setMethod("VNPAY")}>
        <View style={[styles.dot, method === "VNPAY" && styles.active]} />
        <Text>Thanh toán VNPAY</Text>
      </TouchableOpacity>

      {/* TOTAL */}
      <View style={styles.totalBox}>
        <Text style={styles.totalText}>
          Tổng tiền: {totalSelected.toLocaleString()} ₫
        </Text>
      </View>

      {/* SUBMIT */}
      <TouchableOpacity
        style={[styles.btn, loading && { opacity: 0.6 }]}
        onPress={submit}
        disabled={loading}
      >
        <Text style={styles.btnText}>
          {loading ? "Đang xử lý..." : "Xác nhận thanh toán"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 12,
  },

  label: { fontWeight: "600", marginTop: 16, marginBottom: 6 },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fafafa",
  },

  radio: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#999",
    marginRight: 10,
  },
  active: {
    backgroundColor: "#C9A862",
    borderColor: "#C9A862",
  },

  totalBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "700",
  },

  btn: {
    marginTop: 24,
    backgroundColor: "#C9A862",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
