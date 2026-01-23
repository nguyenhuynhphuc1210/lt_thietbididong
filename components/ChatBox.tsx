import { chatApi } from "@/services/chatService";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

/* ================= TYPES ================= */
export type ChatMessage = {
  id: string;
  text: string;
  isUser: boolean;
};

/* ================= CONSTANT ================= */
const CHAT_STORAGE_KEY = "CHAT_MESSAGES";

/* ================= COMPONENT ================= */
export default function ChatBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const listRef = useRef<FlatList>(null);

  /* ================= LOAD CHAT ================= */
  useEffect(() => {
    const loadChat = async () => {
      try {
        const saved = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
        if (saved) {
          setMessages(JSON.parse(saved));
        } else {
          setMessages([
            {
              id: "welcome",
              text: "Xin chào 👋 Tôi có thể hỗ trợ gì cho bạn?",
              isUser: false,
            },
          ]);
        }
      } catch (err) {
        console.log("Load chat error", err);
      }
    };

    loadChat();
  }, []);

  /* ================= SAVE CHAT ================= */
  useEffect(() => {
    if (messages.length > 0) {
      AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  /* ================= SEND MESSAGE ================= */
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
    } catch (err) {
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

  /* ================= RENDER MESSAGE ================= */
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

  /* ================= UI ================= */
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

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 14,
    backgroundColor: "#111",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
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
    backgroundColor: "#111",
    alignSelf: "flex-end",
  },
  botMessage: {
    backgroundColor: "#e0e0e0",
    alignSelf: "flex-start",
  },
  userText: {
    color: "#fff",
  },
  botText: {
    color: "#000",
  },
  inputRow: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    maxHeight: 100,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
  },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: "#111",
    padding: 12,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
