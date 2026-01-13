import { getCurrentUser } from "@/hooks/useAuth";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function AppHeader() {
  const [fullName, setFullName] = useState<string>("");

  const loadUser = async () => {
    const data = await getCurrentUser();
    if (data?.user?.fullName) {
      setFullName(data.user.fullName);
    } else {
      setFullName("");
    }
  };

  // 👉 chạy lại mỗi khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Xin chào 👋</Text>
      <Text style={styles.name}>
        {fullName || "Khách"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 14,
    color: "#666",
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },
});
