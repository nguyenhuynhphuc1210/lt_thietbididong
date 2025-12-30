import api from "@/constants/api";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Service = {
  id: number;
  name: string;
  price: number;
  duration: number; // phút
  description?: string;
};

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadService();
  }, [id]);

  const loadService = async () => {
    try {
      const res = await api.get(`/services/${id}`);
      setService(res.data);
    } catch (err) {
      console.log("Lỗi load chi tiết dịch vụ:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!service) {
    return (
      <View style={styles.center}>
        <Text>Dịch vụ không tồn tại</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Tên dịch vụ */}
      <Text style={styles.name}>{service.name}</Text>

      {/* Giá */}
      <Text style={styles.price}>
        {service.price.toLocaleString()} ₫
      </Text>

      {/* Thời gian */}
      <Text style={styles.duration}>
        ⏱ Thời gian: {service.duration} phút
      </Text>

      {/* Mô tả */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mô tả dịch vụ</Text>
        <Text style={styles.description}>
          {service.description || "Chưa có mô tả cho dịch vụ này."}
        </Text>
      </View>

      {/* Nút đặt lịch */}
      <TouchableOpacity
        style={styles.bookButton}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/home",
            params: { serviceId: service.id.toString() },
          })
        }
      >
        <Text style={styles.bookText}>Đặt lịch ngay</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },

  container: {
    padding: 20,
    paddingBottom: 120,
    backgroundColor: "#f2f2f2",
  },

  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },

  price: {
    fontSize: 22,
    fontWeight: "700",
    color: "#007AFF",
    marginTop: 8,
  },

  duration: {
    marginTop: 6,
    color: "#555",
    fontSize: 15,
  },

  section: {
    marginTop: 24,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  description: {
    color: "#555",
    lineHeight: 22,
  },

  bookButton: {
    marginTop: 28,
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  bookText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
