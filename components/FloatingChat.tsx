import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ChatBox from "./ChatBox";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);

  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true, // 👈 QUAN TRỌNG
      onPanResponderGrant: () => {
        pan.extractOffset();
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset(); // 👈 giữ vị trí
      },
    }),
  ).current;

  return (
    <>
      {/* BONG BÓNG CHAT */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.container,
          {
            transform: pan.getTranslateTransform(),
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.button}
          onPress={() => setOpen(true)}
        >
          <Ionicons name="chatbubble-ellipses" size={26} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      {/* CHAT BOX */}
      <Modal visible={open} transparent animationType="slide">
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        <View style={styles.chatBox}>
          <ChatBox />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    right: 20,
    zIndex: 9999,
    pointerEvents: "box-none", // 👈 rất quan trọng
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ff5a5f",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  chatBox: {
    position: "absolute",
    bottom: 100,
    right: 16,
    width: "90%",
    maxHeight: "70%",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
  },
});
