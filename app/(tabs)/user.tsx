import { logout } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function UserScreen() {
  const [fullName, setFullName] = useState<string>("Người dùng");
  const [showConfirm, setShowConfirm] = useState(false);

  const confirmLogout = async () => {
    await logout();
    setShowConfirm(false);
    router.replace("/login");
  };

  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        const userStr = await AsyncStorage.getItem("user");
        if (!userStr) return;
        const data = JSON.parse(userStr);
        setFullName(data.fullName || "Người dùng");
      };
      loadUser();
    }, []),
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <LinearGradient colors={["#C9A862", "#A68B4D"]} style={styles.header}>
        <Ionicons name="person-circle-outline" size={90} color="#fff" />
        <Text style={styles.fullNameText}>{fullName}</Text>
      </LinearGradient>

      {/* MENU */}
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/account-setting")}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="settings-outline" size={24} color="#C9A862" />
          </View>
          <Text style={styles.menuText}>Cài đặt tài khoản</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setShowConfirm(true)}
        >
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: "rgba(255,59,48,0.1)" },
            ]}
          >
            <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          </View>
          <Text style={[styles.menuText, { color: "#FF3B30" }]}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL LOGOUT */}
      <Modal transparent visible={showConfirm} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              Bạn có chắc chắn muốn đăng xuất?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setShowConfirm(false)}
                style={[styles.modalBtn, styles.btnCancel]}
              >
                <Text style={styles.textCancel}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmLogout}
                style={[styles.modalBtn, styles.btnLogout]}
              >
                <Text style={styles.textLogout}>Đăng xuất</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ===== STYLES ===== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  /* HEADER */
  header: {
    alignItems: "center",
    paddingVertical: 50,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  fullNameText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginTop: 12,
  },

  /* MENU */
  menu: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: {
    fontSize: 16,
    marginLeft: 16,
    color: "#333",
    fontWeight: "600",
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(201,168,98,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 24,
    color: "#1A1A1A",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  btnCancel: {
    backgroundColor: "#f0f0f0",
    marginRight: 12,
  },
  btnLogout: {
    backgroundColor: "#FF3B30",
  },
  textCancel: {
    color: "#333",
    fontWeight: "600",
    fontSize: 16,
  },
  textLogout: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
