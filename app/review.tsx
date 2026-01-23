import { createReview } from "@/services/reviewService";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function ReviewScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const router = useRouter();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submit = async () => {
    try {
      await createReview({
        productId: Number(productId),
        rating,
        comment,
      });

      Toast.show({
        type: "success",
        text1: "Đánh giá thành công ⭐",
      });

      router.back();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";

      Toast.show({
        type: "error",
        text1: message,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Đánh giá sản phẩm</Text>

        {/* placeholder để canh giữa */}
        <View style={{ width: 26 }} />
      </View>

      {/* ===== RATING ===== */}
      <Text style={styles.label}>Đánh giá</Text>

      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((i) => (
          <TouchableOpacity key={i} onPress={() => setRating(i)}>
            <Ionicons
              name={i <= rating ? "star" : "star-outline"}
              size={32}
              color="#facc15"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* ===== COMMENT ===== */}
      <Text style={styles.label}>Nội dung đánh giá</Text>
      <TextInput
        style={styles.input}
        placeholder="Chia sẻ cảm nhận của bạn..."
        value={comment}
        onChangeText={setComment}
        multiline
      />

      {/* ===== SUBMIT ===== */}
      <TouchableOpacity style={styles.btn} onPress={submit}>
        <Text style={styles.btnText}>Gửi đánh giá</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  label: {
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    padding: 14,
    minHeight: 120,
    backgroundColor: "#fafafa",
    textAlignVertical: "top",
  },

  btn: {
    marginTop: 24,
    backgroundColor: "#C9A862",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  starRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
});
