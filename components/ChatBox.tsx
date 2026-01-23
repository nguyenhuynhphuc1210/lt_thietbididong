import { chatApi } from "@/services/chatService"; // chỉnh path theo project bạn
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// ================= TYPES =================
export type ChatMessage = {
  id: string;
  text: string;
  isUser: boolean;
};

// ================= COMPONENT =================
export default function ChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      text: "Xin chào 👋 Tôi có thể hỗ trợ gì cho bạn?",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const listRef = useRef<FlatList>(null);

  // auto scroll khi có tin nhắn mới
  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // ================= SEND MESSAGE =================
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const content = input.trim();

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: content,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const typingId = "typing";

    // bot typing
    setMessages((prev) => [
      ...prev,
      {
        id: typingId,
        text: "Đang trả lời...",
        isUser: false,
      },
    ]);

    try {
      const res = await chatApi(content);

      setMessages((prev) =>
        prev
          .filter((m) => m.id !== typingId)
          .concat({
            id: Date.now().toString() + "-bot",
            text: res.reply ?? "Tôi chưa có câu trả lời phù hợp.",
            isUser: false,
          }),
      );
    } catch (error) {
      setMessages((prev) =>
        prev
          .filter((m) => m.id !== typingId)
          .concat({
            id: Date.now().toString() + "-error",
            text: "⚠️ Chatbot đang bận, vui lòng thử lại.",
            isUser: false,
          }),
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= RENDER MESSAGE =================
  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isUser = item.isUser;

    return (
      <View
        style={[
          styles.message,
          isUser ? styles.userMessage : styles.botMessage,
        ]}
      >
        <Text style={isUser ? styles.userText : styles.botText}>
          {item.text}
        </Text>
      </View>
    );
  };

  // ================= UI =================
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat hỗ trợ</Text>
      </View>

      {/* MESSAGES */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* INPUT */}
      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Nhập tin nhắn..."
          style={styles.input}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, loading && { opacity: 0.5 }]}
          onPress={sendMessage}
          disabled={loading}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// ================= STYLES =================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  header: {
    height: 48,
    backgroundColor: "#ff5a5f",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  list: {
    padding: 12,
  },

  message: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },

  userMessage: {
    backgroundColor: "#ff5a5f",
    alignSelf: "flex-end",
    borderBottomRightRadius: 2,
  },
  botMessage: {
    backgroundColor: "#ffffff",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 2,
  },

  userText: {
    color: "#fff",
    fontSize: 14,
  },
  botText: {
    color: "#333",
    fontSize: 14,
  },

  inputRow: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#fff",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxHeight: 100,
  },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: "#ff5a5f",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
