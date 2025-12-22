import { register } from "@/hooks/useAuth";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function RegisterScreen() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);

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

  const handleRegister = async () => {
    // Validation
    if (!form.username || !form.password || !form.email || !form.fullName || !form.phone) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      await register(form);
      Alert.alert("Thành công", "Đăng ký thành công", [
        { text: "OK", onPress: () => router.replace("/(auth)/login") }
      ]);
    } catch (err: any) {
      Alert.alert("Lỗi", err.response?.data || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Tạo tài khoản</Text>
            <Text style={styles.subtitle}>Điền thông tin để đăng ký</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {Object.keys(form).map((key) => (
              <View key={key} style={styles.inputContainer}>
                <Text style={styles.label}>{fieldLabels[key as keyof typeof fieldLabels]}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={fieldPlaceholders[key as keyof typeof fieldPlaceholders]}
                  placeholderTextColor="#999"
                  value={(form as any)[key]}
                  secureTextEntry={key === "password"}
                  onChangeText={(v) =>
                    setForm((prev) => ({ ...prev, [key]: v }))
                  }
                  autoCapitalize={key === "email" ? "none" : "sentences"}
                  keyboardType={
                    key === "email" ? "email-address" : 
                    key === "phone" ? "phone-pad" : 
                    "default"
                  }
                  editable={!loading}
                />
              </View>
            ))}

            <TouchableOpacity 
              style={[styles.registerButton, loading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>
                {loading ? "Đang đăng ký..." : "Đăng ký"}
              </Text>
            </TouchableOpacity>

            {/* Back to Login */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Đã có tài khoản? </Text>
              <TouchableOpacity 
                onPress={() => router.back()}
                disabled={loading}
              >
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
});