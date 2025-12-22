import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function HomeScreen() {
  const logout = async () => {
    await AsyncStorage.removeItem("user");
    router.replace("/(auth)/login");
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>🏠 Home</Text>
      <Button title="Đăng xuất" onPress={logout} />
    </View>
  );
}
