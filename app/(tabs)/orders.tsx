import { getMyOrders } from "@/services/orderService";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function OrdersScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      getMyOrders().then((res) => setOrders(res.data));
    }, []),
  );

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>
        📦 Đơn hàng của tôi
      </Text>

      <FlatList
        data={orders}
        keyExtractor={(i) => i.orderCode}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/orders/${item.orderCode}`)}
            style={{
              padding: 14,
              backgroundColor: "#fff",
              borderRadius: 12,
              marginTop: 12,
            }}
          >
            <Text style={{ fontWeight: "700" }}>{item.orderCode}</Text>
            <Text>{item.totalAmount.toLocaleString()} ₫</Text>
            <Text>Trạng thái: {item.status}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
