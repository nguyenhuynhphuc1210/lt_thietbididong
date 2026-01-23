import api from "@/constants/api";
import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AccountSettingScreen() {
  const { user, updateUser } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===== init data ===== */
  useEffect(() => {
    if (!user) return;

    setFullName(user.fullName || "");
    setPhone(user.phone || "");
  }, [user]);

  /* ===== save ===== */
  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage("");
      setErrorMessage("");

      const res = await api.put("/users/me", {
        fullName,
        phone,
        password: password || undefined,
      });

      // 🔥 update context → UserScreen re-render liền
      updateUser(res.data);

      setPassword("");
      setMessage("✔ Cập nhật tài khoản thành công");
    } catch (e) {
      console.log(e);
      setErrorMessage("❌ Không thể cập nhật tài khoản");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <LinearGradient colors={["#C9A862", "#A68B4D"]} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Cài đặt tài khoản</Text>

        <View style={{ width: 36 }} />
      </LinearGradient>

      {/* BODY */}
      <View style={styles.body}>
        <Text style={styles.label}>Họ tên</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Nhập họ tên"
        />

        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="Nhập số điện thoại"
        />

        <Text style={styles.label}>Email (không thể thay đổi)</Text>
        <TextInput
          style={styles.inputDisabled}
          value={user?.email || ""}
          editable={false}
        />

        <Text style={styles.label}>Mật khẩu mới</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Để trống nếu không đổi"
        />

        <TouchableOpacity
          style={[styles.saveBtn, loading && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={loading}
        >
          <LinearGradient
            colors={["#C9A862", "#A68B4D"]}
            style={styles.saveBtnGradient}
          >
            <Text style={styles.saveBtnText}>
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {message !== "" && <Text style={styles.success}>{message}</Text>}
        {errorMessage !== "" && (
          <Text style={styles.error}>{errorMessage}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    flex: 1,
  },

  body: { padding: 16 },

  label: { fontSize: 14, fontWeight: "600", marginTop: 12, color: "#444" },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  inputDisabled: {
    backgroundColor: "#e5e7eb",
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
    color: "#999",
  },

  saveBtn: {
    marginTop: 24,
    borderRadius: 12,
    overflow: "hidden",
  },

  saveBtnGradient: {
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
  },

  saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  success: {
    color: "green",
    marginTop: 12,
    fontWeight: "600",
    flexDirection: "row",
    alignItems: "center",
  },

  error: {
    color: "red",
    marginTop: 12,
    fontWeight: "600",
    flexDirection: "row",
    alignItems: "center",
  },
});
