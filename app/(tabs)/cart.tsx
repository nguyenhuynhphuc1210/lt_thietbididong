import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CartScreen() {
  const {
    items: cart,
    addItem,
    decreaseItem,
    removeItem,
    clear,
    total,
  } = useCart();

  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  if (!cart) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.productId.toString()}
        ListEmptyComponent={
          <Text style={styles.empty}>🛒 Giỏ hàng trống</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.productImage }} style={styles.image} />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.productName}</Text>
              <Text style={styles.price}>
                {item.price.toLocaleString()} ₫
              </Text>

              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => {
                    if (item.quantity === 1) {
                      setSelectedProductId(item.productId);
                      setShowRemoveModal(true);
                    } else {
                      decreaseItem(item.productId);
                    }
                  }}
                >
                  <Text>-</Text>
                </TouchableOpacity>

                <Text style={styles.qty}>{item.quantity}</Text>

                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => addItem(item.productId, 1)}
                >
                  <Text>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                setSelectedProductId(item.productId);
                setShowRemoveModal(true);
              }}
            >
              <Text style={styles.remove}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {cart.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.total}>
            Tổng tiền: {total.toLocaleString()} ₫
          </Text>

          <TouchableOpacity style={styles.checkout}>
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              Thanh toán
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowClearModal(true)}>
            <Text style={styles.clear}>Xóa giỏ hàng</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* MODAL XÓA 1 SP */}
      <Modal transparent visible={showRemoveModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Xóa sản phẩm?</Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setShowRemoveModal(false)}
              >
                <Text>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirm}
                onPress={() => {
                  if (selectedProductId) {
                    removeItem(selectedProductId);
                  }
                  setShowRemoveModal(false);
                  setSelectedProductId(null);
                }}
              >
                <Text style={{ color: "#fff" }}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL CLEAR */}
      <Modal transparent visible={showClearModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Xóa toàn bộ giỏ hàng?</Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setShowClearModal(false)}
              >
                <Text>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirm}
                onPress={() => {
                  clear();
                  setShowClearModal(false);
                }}
              >
                <Text style={{ color: "#fff" }}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { textAlign: "center", marginTop: 100, color: "#666" },

  item: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 10,
  },
  name: { fontSize: 16, fontWeight: "600" },
  price: { marginVertical: 4, color: "#e11d48" },

  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  qtyBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  qty: { marginHorizontal: 10 },

  remove: { color: "red", fontSize: 18, padding: 6 },

  footer: {
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 12,
  },
  total: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  checkout: {
    backgroundColor: "#22c55e",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 8,
  },
  clear: { textAlign: "center", color: "#ef4444" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalCancel: {
    padding: 12,
    flex: 1,
    alignItems: "center",
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: "#e5e7eb",
  },
  modalConfirm: {
    padding: 12,
    flex: 1,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#ef4444",
  },
});
