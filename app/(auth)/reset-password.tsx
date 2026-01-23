import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function ResetPasswordScreen() {
  const { resetPassword } = useAuth();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const submit = async () => {
    try {
      // ================= VALIDATE =================
      if (!password || !confirm) {
        Toast.show({
          type: "error",
          text1: "Vui lòng nhập đầy đủ mật khẩu",
        });
        return;
      }

      if (password.length < 6) {
        Toast.show({
          type: "error",
          text1: "Mật khẩu tối thiểu 6 ký tự",
        });
        return;
      }

      if (password !== confirm) {
        Toast.show({
          type: "error",
          text1: "Mật khẩu không khớp",
        });
        return;
      }

      setLoading(true);

      await resetPassword({
        email,
        newPassword: password,
      });

      Toast.show({
        type: "success",
        text1: "Mật khẩu đã được cập nhật 🎉",
      });

      router.replace("/(auth)/login");
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: err?.response?.data?.message || "Đổi mật khẩu thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient colors={["#F5F5F0", "#FFFFFF"]} style={styles.gradient}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* LOGO & HEADER */}
            <View style={styles.header}>
              {/* LOGO */}
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={["#C9A862", "#A68B4D"]}
                  style={styles.logoGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="lock-open" size={42} color="#FFFFFF" />
                </LinearGradient>
              </View>

              <Text style={styles.brandName}>LUXURY WATCH</Text>
              <View style={styles.brandLine} />

              <Text style={styles.title}>Đặt Lại Mật Khẩu</Text>
              <Text style={styles.subtitle}>
                Tạo mật khẩu mới cho tài khoản của bạn
              </Text>
            </View>

            {/* FORM */}
            <View style={styles.form}>
              {/* NEW PASSWORD */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>MẬT KHẨU MỚI</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#999"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Tối thiểu 6 ký tự"
                    placeholderTextColor="#B0B0B0"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#999"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* CONFIRM PASSWORD */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>XÁC NHẬN MẬT KHẨU</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color="#999"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập lại mật khẩu mới"
                    placeholderTextColor="#B0B0B0"
                    secureTextEntry={!showConfirm}
                    value={confirm}
                    onChangeText={setConfirm}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirm(!showConfirm)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showConfirm ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#999"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* PASSWORD REQUIREMENTS */}
              <View style={styles.requirementsBox}>
                <Text style={styles.requirementsTitle}>Yêu cầu mật khẩu:</Text>
                <View style={styles.requirementRow}>
                  <Ionicons
                    name={
                      password.length >= 6
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={16}
                    color={password.length >= 6 ? "#10B981" : "#999"}
                  />
                  <Text
                    style={[
                      styles.requirementText,
                      password.length >= 6 && styles.requirementMet,
                    ]}
                  >
                    Tối thiểu 6 ký tự
                  </Text>
                </View>
                <View style={styles.requirementRow}>
                  <Ionicons
                    name={
                      password && confirm && password === confirm
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={16}
                    color={
                      password && confirm && password === confirm
                        ? "#10B981"
                        : "#999"
                    }
                  />
                  <Text
                    style={[
                      styles.requirementText,
                      password &&
                        confirm &&
                        password === confirm &&
                        styles.requirementMet,
                    ]}
                  >
                    Mật khẩu khớp nhau
                  </Text>
                </View>
              </View>

              {/* SUBMIT BUTTON */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={submit}
                disabled={loading}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={
                    loading ? ["#D4D4D4", "#B8B8B8"] : ["#C9A862", "#A68B4D"]
                  }
                  style={styles.submitGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={18}
                    color="#FFFFFF"
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.submitButtonText}>
                    {loading ? "ĐANG XỬ LÝ..." : "CẬP NHẬT MẬT KHẨU"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* BACK BUTTON */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                disabled={loading}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={18} color="#C9A862" />
                <Text style={styles.backButtonText}>Quay lại</Text>
              </TouchableOpacity>
            </View>

            {/* INFO BOX */}
            <View style={styles.infoBox}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#C9A862"
              />
              <Text style={styles.infoText}>
                Sau khi đặt lại mật khẩu, bạn sẽ được chuyển đến trang đăng nhập
                để sử dụng mật khẩu mới.
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 40,
  },

  /* HEADER & LOGO */
  header: {
    marginBottom: 36,
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoGradient: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#C9A862",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  brandName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: 3,
    marginBottom: 8,
  },
  brandLine: {
    width: 60,
    height: 3,
    backgroundColor: "#C9A862",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },

  /* FORM */
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#C9A862",
    marginBottom: 10,
    letterSpacing: 1.5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E8E8E8",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  inputIcon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    padding: 16,
    paddingLeft: 12,
    fontSize: 15,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  eyeIcon: {
    padding: 16,
  },

  /* REQUIREMENTS BOX */
  requirementsBox: {
    backgroundColor: "rgba(201, 168, 98, 0.05)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(201, 168, 98, 0.2)",
  },
  requirementsTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 10,
  },
  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  requirementText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 8,
  },
  requirementMet: {
    color: "#10B981",
    fontWeight: "600",
  },

  /* SUBMIT BUTTON */
  submitButton: {
    borderRadius: 14,
    overflow: "hidden",

    shadowColor: "#C9A862",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitGradient: {
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1.5,
  },

  /* BACK BUTTON */
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingVertical: 12,
  },
  backButtonText: {
    color: "#C9A862",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },

  /* INFO BOX */
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(201, 168, 98, 0.08)",
    borderRadius: 12,
    padding: 16,
    marginTop: 28,
    borderLeftWidth: 3,
    borderLeftColor: "#C9A862",
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
    marginLeft: 10,
  },
});
