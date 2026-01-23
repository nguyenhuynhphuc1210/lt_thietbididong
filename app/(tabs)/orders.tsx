import { ORDER_STATUS_LABEL } from "@/constants/orderStatus";
import ORDER_STATUS_COLOR from "@/constants/orderStatusColor";
import { getMyOrders } from "@/services/orderService";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrdersScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getMyOrders()
        .then((res) => {
          setOrders(res.data);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, []),
  );

  const renderEmpty = () => (
    <View style={{ alignItems: "center", marginTop: 60 }}>
      <Text style={{ fontSize: 64, marginBottom: 16 }}>📦</Text>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          color: "#666",
          marginBottom: 8,
        }}
      >
        Chưa có đơn hàng nào
      </Text>
      <Text style={{ fontSize: 14, color: "#999", textAlign: "center" }}>
        Các đơn hàng của bạn sẽ hiển thị tại đây
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#f5f5f5" }}
        edges={["top"]}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#f5f5f5" }}
      edges={["top"]}
    >
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 12,
          backgroundColor: "#fff",
          borderBottomWidth: 1,
          borderBottomColor: "#f0f0f0",
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: "700", color: "#1a1a1a" }}>
          Đơn hàng của tôi
        </Text>
        {orders.length > 0 && (
          <Text style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
            {orders.length} đơn hàng
          </Text>
        )}
      </View>

      <FlatList
        data={orders}
        keyExtractor={(i) => i.orderCode}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={renderEmpty}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/orders/${item.orderCode}`)}
            style={{
              padding: 16,
              backgroundColor: "#fff",
              borderRadius: 16,
              marginBottom: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
              borderWidth: 1,
              borderColor: "#f0f0f0",
            }}
            activeOpacity={0.7}
          >
            {/* Order Code & Status Badge */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>
                  Mã đơn hàng
                </Text>
                <Text
                  style={{ fontSize: 16, fontWeight: "700", color: "#1a1a1a" }}
                >
                  {item.orderCode}
                </Text>
              </View>

              <View
                style={{
                  backgroundColor:
                    ORDER_STATUS_COLOR[item.status] + "20" || "#f0f0f0",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor:
                    ORDER_STATUS_COLOR[item.status] + "40" || "#e0e0e0",
                }}
              >
                <Text
                  style={{
                    color: ORDER_STATUS_COLOR[item.status] || "#666",
                    fontWeight: "600",
                    fontSize: 13,
                  }}
                >
                  {ORDER_STATUS_LABEL[item.status] || item.status}
                </Text>
              </View>
            </View>

            {/* Divider */}
            <View
              style={{
                height: 1,
                backgroundColor: "#f0f0f0",
                marginBottom: 12,
              }}
            />

            {/* Price & Arrow */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <Text style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>
                  Tổng tiền
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#007AFF",
                  }}
                >
                  {item.totalAmount.toLocaleString()} ₫
                </Text>
              </View>

              <Text style={{ fontSize: 18, color: "#ccc" }}>›</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
