import api from "@/constants/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const userStr = await AsyncStorage.getItem("user");
      if (!userStr) return;

      const data = JSON.parse(userStr);

      setFullName(data.user.fullName);
      setPhone(data.user.phone || "");
      setEmail(data.user.email);
    };

    loadUser();
  }, []);

  const handleSave = async () => {
    try {
      setMessage("");
      setErrorMessage("");

      await api.put("/users/me", {
        fullName,
        phone,
        password: password || undefined,
      });

      // update local storage
      const userStr = await AsyncStorage.getItem("user");
      if (userStr) {
        const data = JSON.parse(userStr);
        data.user.fullName = fullName;
        data.user.phone = phone;

        await AsyncStorage.setItem("user", JSON.stringify(data));
      }

      setPassword("");
      setMessage("✔ Cập nhật tài khoản thành công");
    } catch (error) {
      console.log(error);
      setErrorMessage("❌ Không thể cập nhật tài khoản");
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        {/* back left */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#333" />
        </TouchableOpacity>

        {/* centered title */}
        <Text style={styles.headerTitle}>Cài đặt tài khoản</Text>

        {/* fake box to balance layout (same width as back button) */}
        <View style={{ width: 36 }} />
      </View>

      {/* BODY */}
      <View style={styles.body}>
        <Text style={styles.label}>Họ tên</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Email (không thể thay đổi)</Text>
        <TextInput style={styles.inputDisabled} value={email} editable={false} />

        <Text style={styles.label}>Mật khẩu mới</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Để trống nếu không đổi"
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
        </TouchableOpacity>

        {message !== "" && <Text style={styles.success}>{message}</Text>}
        {errorMessage !== "" && <Text style={styles.error}>{errorMessage}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },

  header: {
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: "white",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
  },

  body: { padding: 16 },

  label: { fontSize: 14, fontWeight: "600", marginTop: 10 },

  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 10,
    marginTop: 4,
  },

  inputDisabled: {
    backgroundColor: "#e5e7eb",
    padding: 10,
    borderRadius: 10,
    marginTop: 4,
  },

  saveBtn: {
    backgroundColor: "#007AFF",
    padding: 14,
    marginTop: 20,
    borderRadius: 12,
    alignItems: "center",
  },

  saveBtnText: { color: "white", fontWeight: "700", fontSize: 16 },

  success: { color: "green", marginTop: 10 },

  error: { color: "red", marginTop: 10 },
});
