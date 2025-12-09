import { Ionicons } from '@expo/vector-icons'; // Icon thư viện có sẵn trong Expo
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Dữ liệu giả lập cho danh sách
const DATA = [
  { id: '1', title: 'Dịch vụ A', color: '#FF6B6B' },
  { id: '2', title: 'Dịch vụ B', color: '#4ECDC4' },
  { id: '3', title: 'Dịch vụ C', color: '#FFE66D' },
  { id: '4', title: 'Dịch vụ D', color: '#1A535C' },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 1. Header: Lời chào */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Xin chào,</Text>
          <Text style={styles.username}>Người dùng!</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* 2. Banner quảng cáo / Highlight */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Ưu đãi đặc biệt hôm nay!</Text>
        <Text style={styles.bannerSubText}>Giảm giá 50% cho thành viên mới</Text>
      </View>

      {/* 3. Danh mục nổi bật */}
      <Text style={styles.sectionTitle}>Danh mục nổi bật</Text>
      <View style={styles.gridContainer}>
        {DATA.map((item) => (
          <TouchableOpacity key={item.id} style={[styles.card, { backgroundColor: item.color }]}>
            <Text style={styles.cardText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 4. Tin tức mới (Ví dụ danh sách dọc) */}
      <Text style={styles.sectionTitle}>Tin tức mới nhất</Text>
      <View style={styles.newsItem}>
        <View style={styles.newsIcon} />
        <View>
          <Text style={styles.newsTitle}>Cập nhật phiên bản mới</Text>
          <Text style={styles.newsDesc}>Chúng tôi vừa nâng cấp hệ thống...</Text>
        </View>
      </View>
      <View style={styles.newsItem}>
        <View style={styles.newsIcon} />
        <View>
          <Text style={styles.newsTitle}>Chính sách bảo mật</Text>
          <Text style={styles.newsDesc}>Hãy xem qua chính sách mới...</Text>
        </View>
      </View>

      <View style={{ height: 20 }} /> 
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationBtn: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
  },
  banner: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  bannerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bannerSubText: {
    color: '#e0e0e0',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: '48%', // Chia đôi màn hình
    height: 100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  newsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  newsIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#ddd',
    borderRadius: 8,
    marginRight: 15,
  },
  newsTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  newsDesc: {
    color: '#666',
    fontSize: 14,
  },
});