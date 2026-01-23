import FloatingChat from "@/components/FloatingChat";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) return null;

  const isAuth = !!user;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {isAuth ? (
          <Stack.Screen name="(tabs)" />
        ) : (
          <Stack.Screen name="(auth)" />
        )}
      </Stack>

      {/* ✅ login là hiện – logout là mất LIỀN */}
      {isAuth && <FloatingChat />}
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <AppContent />
            <Toast />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
