import { logout } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function UserScreen() {
  const [fullName, setFullName] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState(false);

  // Xử lý đăng xuất
  const confirmLogout = async () => {
    await logout();
    setShowConfirm(false);
    router.replace("/login"); // Chuyển hướng về trang đăng nhập
  };

  // Lấy dữ liệu fullName từ AsyncStorage khi vào trang
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userStr = await AsyncStorage.getItem("user");
        if (userStr) {
          const data = JSON.parse(userStr);

          if (data.user && data.user.fullName) {
            setFullName(data.user.fullName);
          } else {
            setFullName("Người dùng");
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin:", error);
        setFullName("Người dùng");
      }
    };
    loadUser();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header chỉ hiển thị Avatar và Full Name */}
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={80} color="#007AFF" />
        <Text style={styles.fullNameText}>{fullName}</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings-outline" size={24} color="#333" />
          <Text style={styles.menuText}>Cài đặt tài khoản</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setShowConfirm(true)}
        >
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          <Text style={[styles.menuText, { color: "#FF3B30" }]}>Đăng xuất</Text>
        </TouchableOpacity>

        {/* Modal xác nhận đăng xuất */}
        <Modal transparent visible={showConfirm} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>
                Bạn có chắc chắn muốn đăng xuất?
              </Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  onPress={() => setShowConfirm(false)}
                  style={styles.btnCancel}
                >
                  <Text style={styles.textCancel}>Hủy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={confirmLogout}
                  style={styles.btnLogout}
                >
                  <Text style={styles.textLogout}>Đăng xuất</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  // Đã đổi tên từ username sang fullNameText
  fullNameText: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 10,
    color: "#1a1a1a",
  },
  menu: { marginTop: 20, backgroundColor: "#fff" },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: { fontSize: 16, marginLeft: 12, color: "#333" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  modalTitle: {
    fontSize: 16,
    marginBottom: 25,
    textAlign: "center",
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  btnCancel: { padding: 10 },
  textCancel: { color: "#666", fontSize: 16, fontWeight: "500" },
  btnLogout: { padding: 10 },
  textLogout: { color: "#FF3B30", fontSize: 16, fontWeight: "700" },
});
