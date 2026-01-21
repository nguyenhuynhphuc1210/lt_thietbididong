import { login } from "@/hooks/useAuth";
import { router } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { Controller, useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import { z } from "zod";

// ================= SCHEMA VALIDATE =================
const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      Keyboard.dismiss();

      await login(data.email, data.password);

      Toast.show({
        type: "success",
        text1: "Đăng nhập thành công",
        text2: "Chào mừng bạn quay trở lại! 👋",
        visibilityTime: 2000,
      });

      router.replace("/(tabs)/home");
    } catch (err: any) {
      console.log("Chi tiết lỗi:", err.response?.data);

      const errorMsg =
        err.response?.data?.message || "Email hoặc mật khẩu không đúng";

      Toast.show({
        type: "error",
        text1: "Lỗi đăng nhập",
        text2: errorMsg,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient colors={["#F5F5F0", "#FFFFFF"]} style={styles.gradient}>
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
                <Ionicons name="watch" size={42} color="#FFFFFF" />
              </LinearGradient>
            </View>

            <Text style={styles.brandName}>LUXURY WATCH</Text>
            <View style={styles.brandLine} />

            <Text style={styles.title}>Chào Mừng Trở Lại</Text>
            <Text style={styles.subtitle}>
              Đăng nhập để khám phá bộ sưu tập đồng hồ cao cấp
            </Text>
          </View>

          {/* FORM */}
          <View style={styles.form}>
            {/* EMAIL */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>EMAIL</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color="#999"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, errors.email && styles.inputError]}
                      placeholder="your@email.com"
                      placeholderTextColor="#B0B0B0"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      editable={!loading}
                    />
                  </View>
                )}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>

            {/* PASSWORD */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>MẬT KHẨU</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="#999"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[
                        styles.input,
                        errors.password && styles.inputError,
                      ]}
                      placeholder="••••••••"
                      placeholderTextColor="#B0B0B0"
                      secureTextEntry={!showPassword}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
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
                )}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>

            {/* FORGOT PASSWORD */}
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => router.push("/(auth)/forgot-password")}
              disabled={loading}
            >
              <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            {/* LOGIN BUTTON */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={
                  loading ? ["#D4D4D4", "#B8B8B8"] : ["#C9A862", "#A68B4D"]
                }
                style={styles.loginGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.loginButtonText}>
                  {loading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* DIVIDER */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>HOẶC</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* REGISTER BUTTON */}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => router.push("/(auth)/register")}
              disabled={loading}
              activeOpacity={0.9}
            >
              <Text style={styles.registerButtonText}>TẠO TÀI KHOẢN MỚI</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
  },

  /* HEADER & LOGO */
  header: {
    marginBottom: 40,
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
    lineHeight: 20,
    paddingHorizontal: 20,
  },

  /* FORM */
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
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
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: "500",
  },

  /* FORGOT PASSWORD */
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
    marginTop: -8,
  },
  forgotPasswordText: {
    color: "#C9A862",
    fontSize: 13,
    fontWeight: "600",
  },

  /* LOGIN BUTTON */
  loginButton: {
    borderRadius: 14,
    overflow: "hidden",

    shadowColor: "#C9A862",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1.5,
  },

  /* DIVIDER */
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    paddingHorizontal: 16,
    color: "#999",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
  },

  /* REGISTER BUTTON */
  registerButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#C9A862",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  registerButtonText: {
    color: "#C9A862",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
});
