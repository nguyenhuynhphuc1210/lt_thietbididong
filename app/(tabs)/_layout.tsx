// app/(tabs)/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />

      {/* TAB DỊCH VỤ */}
      <Tabs.Screen
        name="services/index"
        options={{
          title: "Dịch vụ",
          tabBarIcon: ({ color }) => (
            <Ionicons name="cut" size={24} color={color} />
          ),
        }}
      />

      {/* ẨN services/[id] */}
      <Tabs.Screen
        name="services/[id]"
        options={{
          href: null, // ⭐ QUAN TRỌNG
        }}
      />

      <Tabs.Screen
        name="user"
        options={{
          title: "Cá nhân",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
