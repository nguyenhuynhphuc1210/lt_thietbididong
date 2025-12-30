import api from "@/constants/api";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
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

export default function ServicesScreen() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const res = await api.get("/services");
      setServices(res.data);
    } catch (err) {
      console.log("Lỗi load dịch vụ:", err);
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

  return (
    <FlatList
      data={services}
      keyExtractor={(item) => item.id.toString()}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/services/[id]",
              params: { id: item.id.toString() },
            })
          }
        >
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>

          <Text style={styles.price}>
            Giá: {item.price.toLocaleString()} ₫
          </Text>

          <Text style={styles.duration}>
            Thời gian: {item.duration} phút
          </Text>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <Text style={styles.empty}>Chưa có dịch vụ</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },

  list: {
    padding: 16,
    paddingBottom: 100, // chừa tab bar
    backgroundColor: "#f2f2f2",
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },

  name: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
  },

  price: {
    marginTop: 6,
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 15,
  },

  duration: {
    marginTop: 4,
    color: "#666",
    fontSize: 14,
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#888",
  },
});
