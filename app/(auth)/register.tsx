import { register } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";


// 1. Định nghĩa Schema validate (Khớp hoàn toàn với Java DTO)
const registerSchema = z.object({
  username: z.string().trim().min(3, "Tên đăng nhập từ 3-20 ký tự").max(20, "Tên đăng nhập quá dài"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  email: z.string().trim().email("Email không đúng định dạng"),
  fullName: z.string().trim().min(1, "Vui lòng nhập họ và tên"),
  phone: z.string().trim().regex(/^(0|84)[3|5|7|8|9][0-9]{8}$/, "Số điện thoại Việt Nam không hợp lệ"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const [loading, setLoading] = useState(false);

  // 2. Khởi tạo Hook Form
  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      fullName: "",
      phone: ""
    }
  });

  const fieldLabels = {
    username: "Tên đăng nhập",
    password: "Mật khẩu",
    email: "Email",
    fullName: "Họ và tên",
    phone: "Số điện thoại"
  };

  const fieldPlaceholders = {
    username: "Nhập tên đăng nhập",
    password: "Nhập mật khẩu",
    email: "example@email.com",
    fullName: "Nhập họ và tên đầy đủ",
    phone: "0123456789"
  };

  // 3. Hàm xử lý khi bấm Đăng ký
const onSubmit = async (data: RegisterFormData) => {
  // 1. Tắt bàn phím ngay lập tức
  Keyboard.dismiss();
  setLoading(true);

  try {
    console.log("1. Bắt đầu gọi API Register...");
    const result = await register(data);
    console.log("2. API thành công:", result);

    // 2. Hiện thông báo thành công bằng Toast
    Toast.show({
      type: "success",
      text1: "Đăng ký thành công!",
      text2: "Bây giờ bạn có thể đăng nhập vào hệ thống.",
      visibilityTime: 2000, // Hiển thị trong 2 giây
    });

    // 3. Tắt loading và chuyển trang sau một khoảng nghỉ ngắn
    // để người dùng kịp nhìn thấy Toast thành công
    setTimeout(() => {
      setLoading(false);
      router.replace("/(auth)/login");
    }, 1500);

  } catch (err: any) {
    setLoading(false);
    console.log("Lỗi xảy ra:", err);
    
    const errorMsg = err.response?.data?.message || "Đăng ký thất bại";
    
    // Hiện lỗi bằng Toast đỏ
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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Tạo tài khoản</Text>
            <Text style={styles.subtitle}>Tham gia hệ thống quản lý Salon</Text>
          </View>

          <View style={styles.form}>
            {(Object.keys(fieldLabels) as (keyof RegisterFormData)[]).map((key) => (
              <View key={key} style={styles.inputContainer}>
                <Text style={styles.label}>{fieldLabels[key]}</Text>
                
                <Controller
                  control={control}
                  name={key}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={[styles.input, errors[key] && styles.inputError]}
                      placeholder={fieldPlaceholders[key]}
                      placeholderTextColor="#999"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      secureTextEntry={key === "password"}
                      autoCapitalize={key === "email" || key === "username" ? "none" : "sentences"}
                      keyboardType={
                        key === "email" ? "email-address" : 
                        key === "phone" ? "phone-pad" : "default"
                      }
                      editable={!loading}
                    />
                  )}
                />
                
                {/* Hiển thị thông báo lỗi ngay dưới ô nhập */}
                {errors[key] && (
                  <Text style={styles.errorText}>{errors[key]?.message}</Text>
                )}
              </View>
            ))}

            <TouchableOpacity 
              style={[styles.registerButton, loading && styles.registerButtonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>
                {loading ? "Đang xử lý..." : "Đăng ký"}
              </Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Đã có tài khoản? </Text>
              <TouchableOpacity onPress={() => router.back()} disabled={loading}>
                <Text style={styles.loginLink}>Đăng nhập ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    color: "#1a1a1a",
  },
  registerButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  registerButtonDisabled: {
    backgroundColor: "#99c7ff",
    shadowOpacity: 0,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  loginText: {
    fontSize: 15,
    color: "#666",
  },
  loginLink: {
    fontSize: 15,
    color: "#007AFF",
    fontWeight: "600",
  },
  inputError: {
    borderColor: "#FF3B30",
    borderWidth: 1.5,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: "500",
  },
});