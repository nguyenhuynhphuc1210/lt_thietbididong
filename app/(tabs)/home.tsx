// app/(tabs)/home.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

type User = {
  username: string;
  customer?: {
    fullName: string;
  };
  employee?: {
    fullName: string;
  };
};

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const userStr = await AsyncStorage.getItem("user");
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  const fullName =
    user?.customer?.fullName ||
    user?.employee?.fullName ||
    user?.username;

  return (
    <View style={styles.container}>
      {/* HEADER USER */}
      <View style={styles.header}>
        <Text style={styles.hello}>Xin chào 👋</Text>
        <Text style={styles.name}>{fullName}</Text>
      </View>

      {/* NỘI DUNG HOME */}
      <View style={styles.body}>
        <Text>Chọn dịch vụ để đặt lịch ✂️</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 3,
  },
  hello: {
    fontSize: 14,
    color: "#666",
  },
  name: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 4,
  },
  body: {
    padding: 20,
  },
});
