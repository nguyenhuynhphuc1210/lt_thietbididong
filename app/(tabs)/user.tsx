// app/(tabs)/user.tsx
import { logout } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons"; // Expo có sẵn thư viện icon này
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function UserScreen() {
  const [fullName, setFullName] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState(false);

  const confirmLogout = async () => {
    await logout();
    setShowConfirm(false);
    router.replace("/");
  };

  useEffect(() => {
    const loadUser = async () => {
      const userStr = await AsyncStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setFullName(user.fullName || user.username);
      }
    };
    loadUser();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={80} color="#007AFF" />
        <Text style={styles.username}>{fullName}</Text>
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

        <Modal transparent visible={showConfirm} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={{ fontSize: 16, marginBottom: 20 }}>
                Bạn có chắc chắn muốn đăng xuất?
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity onPress={() => setShowConfirm(false)}>
                  <Text>Hủy</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={confirmLogout}>
                  <Text style={{ color: "red" }}>Đăng xuất</Text>
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
  },
  username: { fontSize: 20, fontWeight: "600", marginTop: 10 },
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
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
});
