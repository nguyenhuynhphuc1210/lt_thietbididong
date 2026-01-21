import { verifyOtp } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
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
      <LinearGradient
        colors={["#F5F5F0", "#FFFFFF"]}
        style={styles.gradient}
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
                <Ionicons name="shield-checkmark" size={42} color="#FFFFFF" />
              </LinearGradient>
            </View>

            <Text style={styles.brandName}>LUXURY WATCH</Text>
            <View style={styles.brandLine} />
            
            <Text style={styles.title}>Xác Thực OTP</Text>
            <Text style={styles.subtitle}>
              Mã xác thực đã được gửi đến
            </Text>
            <Text style={styles.emailText}>{email}</Text>
          </View>

          {/* FORM */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>MÃ OTP (6 CHỮ SỐ)</Text>

              <Controller
                control={control}
                name="otp"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.otpWrapper}>
                    <Ionicons 
                      name="keypad-outline" 
                      size={20} 
                      color="#C9A862" 
                      style={styles.otpIcon}
                    />
                    <TextInput
                      style={[styles.input, errors.otp && styles.inputError]}
                      keyboardType="number-pad"
                      maxLength={6}
                      value={value}
                      onChangeText={onChange}
                      placeholder="• • • • • •"
                      placeholderTextColor="#D0D0D0"
                      editable={!loading}
                    />
                  </View>
                )}
              />

              {errors.otp && (
                <Text style={styles.errorText}>{errors.otp.message}</Text>
              )}
            </View>

            {/* SUBMIT BUTTON */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={loading ? ["#D4D4D4", "#B8B8B8"] : ["#C9A862", "#A68B4D"]}
                style={styles.submitGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons 
                  name="checkmark-circle-outline" 
                  size={18} 
                  color="#FFFFFF" 
                  style={styles.buttonIcon}
                />
                <Text style={styles.submitButtonText}>
                  {loading ? "ĐANG XÁC THỰC..." : "XÁC NHẬN"}
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
            <Ionicons name="time-outline" size={20} color="#C9A862" />
            <Text style={styles.infoText}>
              Mã OTP có hiệu lực trong 10 phút. Vui lòng kiểm tra email và nhập chính xác.
            </Text>
          </View>

          {/* RESEND LINK */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Không nhận được mã? </Text>
            <TouchableOpacity
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={styles.resendLink}>Gửi lại</Text>
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
    lineHeight: 22,
  },
  emailText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#C9A862",
    marginTop: 4,
  },

  /* FORM */
  form: {
    width: "100%",
  },
  inputContainer: { 
    marginBottom: 24,
  },
  label: { 
    fontSize: 11,
    fontWeight: "700",
    color: "#C9A862",
    marginBottom: 12,
    letterSpacing: 1.5,
    textAlign: "center",
  },
  otpWrapper: {
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
  otpIcon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    padding: 20,
    paddingLeft: 12,
    fontSize: 24,
    color: "#1A1A1A",
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 8,
  },
  inputError: { 
    borderColor: "#EF4444",
  },
  errorText: { 
    color: "#EF4444", 
    fontSize: 12, 
    marginTop: 6, 
    textAlign: "center",
    fontWeight: "500",
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

  /* RESEND */
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  resendText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  resendLink: {
    fontSize: 14,
    color: "#C9A862",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});