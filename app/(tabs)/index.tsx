import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false, // Ẩn header mặc định của Tab
      tabBarActiveTintColor: '#007AFF', // Màu icon khi được chọn
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      
      {/* Ẩn các file không muốn hiện trên thanh menu (ví dụ modal) */}
      <Tabs.Screen 
        name="modal" 
        options={{ 
          href: null, // Dòng này giúp ẩn tab modal khỏi thanh menu
        }} 
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Cá nhân',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}