import { useAuth } from "@/contexts/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function AppHeader() {
  const { user } = useAuth();

  const fullName = user?.fullName ?? "";

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  const avatarChar = fullName ? fullName.charAt(0).toUpperCase() : "K";

  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <View style={styles.userInfo}>
          {/* AVATAR */}
          <LinearGradient
            colors={["#FFD700", "#C9A862"]}
            style={styles.avatarGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.avatarText}>{avatarChar}</Text>
          </LinearGradient>

          {/* TEXT */}
          <View style={styles.textContainer}>
            <Text style={styles.greeting}>{getTimeGreeting()} 👋</Text>
            <Text style={styles.name} numberOfLines={1}>
              {fullName || "Khách"}
            </Text>
          </View>
        </View>

        <View style={styles.rightActions} />
      </View>

      {/* DECORATIVE LINE */}
      <LinearGradient
        colors={["#FFD700", "#C9A862"]}
        style={styles.decorativeLine}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#1F1F1F", // ⭐ background header khác Home (Home #F5F5F0)
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  avatarGradient: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 4,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
  },

  textContainer: { flex: 1 },
  greeting: {
    fontSize: 14,
    color: "#FFD966", // text vàng nổi bật
    fontWeight: "500",
    marginBottom: 2,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF", // tên người dùng màu trắng trên nền tối
    letterSpacing: 0.3,
  },

  rightActions: {
    flexDirection: "row",
    alignItems: "center",
  },

  decorativeLine: {
    height: 4,
    borderRadius: 2,
    marginTop: 14,
    width: "50%",
    alignSelf: "flex-start",
  },
});
