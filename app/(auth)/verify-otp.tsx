import { verifyOtp } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import Toast from "react-native-toast-message";
import { z } from "zod";

// ================= SCHEMA =================
const schema = z.object({
  otp: z.string().length(6, "OTP phải gồm 6 chữ số"),
});

type FormData = z.infer<typeof schema>;

export default function VerifyOtpScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { otp: "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      Keyboard.dismiss();

      await verifyOtp({
        email,
        otp: data.otp,
      });

      Toast.show({
        type: "success",
        text1: "OTP hợp lệ",
      });

      router.push({
        pathname: "/(auth)/reset-password",
        params: { email },
      });

    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: err.response?.data?.message || "OTP không hợp lệ hoặc đã hết hạn",
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
      <View style={styles.content}>
        <Text style={styles.title}>Xác thực OTP</Text>
        <Text style={styles.subtitle}>
          Nhập mã OTP đã gửi đến email
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>OTP</Text>

          <Controller
            control={control}
            name="otp"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.otp && styles.inputError]}
                keyboardType="number-pad"
                maxLength={6}
                value={value}
                onChangeText={onChange}
                placeholder="123456"
              />
            )}
          />

          {errors.otp && (
            <Text style={styles.errorText}>{errors.otp.message}</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? "Đang xác thực..." : "Xác nhận"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  content: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  title: { fontSize: 28, fontWeight: "700", color: "#1a1a1a", marginBottom: 8 },
  subtitle: { fontSize: 15, color: "#666", textAlign: "center", lineHeight: 22 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    color: "#1a1a1a",
    textAlign: "center",
    letterSpacing: 2,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  inputError: { borderColor: "#ff4d4f" },
  errorText: { color: "#ff4d4f", fontSize: 12, marginTop: 4, marginLeft: 4 },
});
