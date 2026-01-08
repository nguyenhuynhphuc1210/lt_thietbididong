import { CartProvider } from "@/contexts/CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("user").then((user) => {
      setIsAuth(!!user);
    });
  }, []);

  if (isAuth === null) return null; // loading

  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {isAuth ? (
          <Stack.Screen name="(tabs)" />
        ) : (
          <Stack.Screen name="(auth)" />
        )}
      </Stack>
      <Toast />
    </CartProvider>
  );
}
