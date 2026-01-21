import { useCart } from "@/contexts/CartContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
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
    totalSelected,
    toggleSelectItem,
    selectAll,
  } = useCart();

  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const router = useRouter();

  // ===== SELECT ALL LOGIC =====
  const selectedCount = cart.filter((i) => i.selected).length;
  const allSelected = cart.length > 0 && selectedCount === cart.length;
  const hasSelected = selectedCount > 0;

  if (!cart) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#C9A862" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* ===== CHỌN TẤT CẢ ===== */}
      {cart.length > 0 && (
        <View style={styles.selectAllRow}>
          <TouchableOpacity
            style={styles.selectAllLeft}
            onPress={() => selectAll(!allSelected)}
          >
            <Ionicons
              name={allSelected ? "checkbox" : "square-outline"}
              size={22}
              color={allSelected ? "#C9A862" : "#999"}
            />
            <Text style={styles.selectAllText}>Chọn tất cả</Text>
          </TouchableOpacity>

          <Text style={styles.selectAllCount}>
            ({selectedCount}/{cart.length})
          </Text>
        </View>
      )}

      {/* ===== LIST ===== */}
      <FlatList
        data={cart}
        keyExtractor={(item) => item.productId.toString()}
        ListEmptyComponent={<Text style={styles.empty}>🛒 Giỏ hàng trống</Text>}
        contentContainerStyle={{ paddingBottom: 150 }}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {/* CHECKBOX ITEM */}
            <TouchableOpacity
              onPress={() => toggleSelectItem(item.productId)}
              style={{ marginRight: 8 }}
            >
              <Ionicons
                name={item.selected ? "checkbox" : "square-outline"}
                size={24}
                color={item.selected ? "#C9A862" : "#999"}
              />
            </TouchableOpacity>

            <Image source={{ uri: item.productImage }} style={styles.image} />

            <View style={{ flex: 1, marginHorizontal: 10 }}>
              <Text style={styles.name} numberOfLines={1}>
                {item.productName}
              </Text>
              <Text style={styles.price}>{item.price.toLocaleString()} ₫</Text>

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
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>

                <Text style={styles.qty}>{item.quantity}</Text>

                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => addItem(item.productId, 1)}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                setSelectedProductId(item.productId);
                setShowRemoveModal(true);
              }}
              style={styles.removeBtn}
            >
              <Text style={styles.remove}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* ===== FOOTER ===== */}
      {cart.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.total}>
            Tổng tiền: {totalSelected.toLocaleString()} ₫
          </Text>

          <TouchableOpacity
            disabled={!hasSelected}
            style={[styles.checkout, !hasSelected && { opacity: 0.5 }]}
            onPress={() => {
              router.push("/payment");
            }}
          >
            <LinearGradient
              colors={["#C9A862", "#A68B4D"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.checkoutGradient}
            >
              <Text style={styles.checkoutText}>
                Thanh toán ({selectedCount})
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowClearModal(true)}>
            <Text style={styles.clear}>Xóa giỏ hàng</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ===== MODAL XÓA 1 SP ===== */}
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
                  if (selectedProductId) removeItem(selectedProductId);
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

      {/* ===== MODAL CLEAR ===== */}
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

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { textAlign: "center", marginTop: 100, color: "#999", fontSize: 16 },

  selectAllRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  selectAllLeft: { flexDirection: "row", alignItems: "center" },
  selectAllText: { marginLeft: 8, fontWeight: "600", color: "#1a1a1a" },
  selectAllCount: { fontSize: 12, color: "#666" },

  item: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  image: { width: 90, height: 90, borderRadius: 12 },
  name: { fontSize: 16, fontWeight: "600", color: "#1a1a1a" },
  price: { marginVertical: 4, color: "#C9A862", fontWeight: "700" },

  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtnText: { fontSize: 16, fontWeight: "600", color: "#333" },
  qty: { marginHorizontal: 12, fontWeight: "600" },

  removeBtn: { justifyContent: "center", paddingHorizontal: 4 },
  remove: { color: "#ef4444", fontSize: 18 },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 6,
  },
  total: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  checkout: { borderRadius: 12, overflow: "hidden", marginBottom: 8 },
  checkoutGradient: {
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
  },
  checkoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  clear: { textAlign: "center", color: "#ef4444", fontWeight: "600" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  modalActions: { flexDirection: "row", justifyContent: "space-between" },
  modalCancel: {
    padding: 14,
    flex: 1,
    alignItems: "center",
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
  },
  modalConfirm: {
    padding: 14,
    flex: 1,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#ef4444",
  },
});
