import { register } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
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
import { z } from "zod";

// ================= SCHEMA VALIDATION =================
const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Email không đúng định dạng"),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  fullName: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập họ và tên"),
  phone: z
    .string()
    .trim()
    .regex(
      /^(0|84)[3|5|7|8|9][0-9]{8}$/,
      "Số điện thoại Việt Nam không hợp lệ"
    ),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      phone: "",
    },
  });

  // ================= SUBMIT =================
  const onSubmit = async (data: RegisterFormData) => {
    Keyboard.dismiss();
    setLoading(true);

    try {
      await register(data);

      Toast.show({
        type: "success",
        text1: "Đăng ký thành công 🎉",
        text2: "Bạn có thể đăng nhập ngay bây giờ",
        visibilityTime: 2000,
      });

      setTimeout(() => {
        setLoading(false);
        router.replace("/(auth)/login");
      }, 1500);
    } catch (err: any) {
      setLoading(false);

      const errorMsg =
        err.response?.data?.message || "Đăng ký thất bại";

      Toast.show({
        type: "error",
        text1: "Lỗi đăng ký",
        text2: errorMsg,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={["#F5F5F0", "#FFFFFF"]}
        style={styles.gradient}
      >
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
                  <Ionicons name="watch" size={42} color="#FFFFFF" />
                </LinearGradient>
              </View>

              <Text style={styles.brandName}>LUXURY WATCH</Text>
              <View style={styles.brandLine} />
              
              <Text style={styles.title}>Tạo Tài Khoản</Text>
              <Text style={styles.subtitle}>
                Tham gia cùng chúng tôi để khám phá thế giới đồng hồ cao cấp
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
                        style={[styles.input, errors.password && styles.inputError]}
                        placeholder="Tối thiểu 6 ký tự"
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

              {/* FULL NAME */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>HỌ VÀ TÊN</Text>
                <Controller
                  control={control}
                  name="fullName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputWrapper}>
                      <Ionicons 
                        name="person-outline" 
                        size={20} 
                        color="#999" 
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={[styles.input, errors.fullName && styles.inputError]}
                        placeholder="Nguyễn Văn A"
                        placeholderTextColor="#B0B0B0"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        editable={!loading}
                      />
                    </View>
                  )}
                />
                {errors.fullName && (
                  <Text style={styles.errorText}>
                    {errors.fullName.message}
                  </Text>
                )}
              </View>

              {/* PHONE */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>SỐ ĐIỆN THOẠI</Text>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputWrapper}>
                      <Ionicons 
                        name="call-outline" 
                        size={20} 
                        color="#999" 
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={[styles.input, errors.phone && styles.inputError]}
                        placeholder="0987654321"
                        placeholderTextColor="#B0B0B0"
                        keyboardType="phone-pad"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        editable={!loading}
                      />
                    </View>
                  )}
                />
                {errors.phone && (
                  <Text style={styles.errorText}>{errors.phone.message}</Text>
                )}
              </View>

              {/* REGISTER BUTTON */}
              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={loading ? ["#D4D4D4", "#B8B8B8"] : ["#C9A862", "#A68B4D"]}
                  style={styles.registerGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.registerButtonText}>
                    {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* LOGIN LINK */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Đã có tài khoản? </Text>
                <TouchableOpacity
                  onPress={() => router.replace("/(auth)/login")}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <Text style={styles.loginLink}>Đăng nhập</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

// ================= STYLES =================
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
    fontSize: 13,
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

  /* REGISTER BUTTON */
  registerButton: {
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 8,
    
    shadowColor: "#C9A862",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  registerGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1.5,
  },

  /* LOGIN LINK */
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    fontSize: 15,
    color: "#666",
    fontWeight: "500",
  },
  loginLink: {
    fontSize: 15,
    color: "#C9A862",
    fontWeight: "700",
  },
});