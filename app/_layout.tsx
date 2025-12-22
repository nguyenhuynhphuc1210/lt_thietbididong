import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
       {/* Bạn có thể chỉ định trang đầu tiên ở đây nếu cần */}
      <Stack.Screen name="/(auth)/login" options={{}} />
    </Stack>
  );
}
