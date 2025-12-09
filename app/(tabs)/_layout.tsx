import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false, 
      tabBarActiveTintColor: '#007AFF', 
      tabBarInactiveTintColor: '#999',
    }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="product" 
        options={{
          title: 'Sản phẩm',
          tabBarIcon: ({ color }) => <Ionicons name="grid" size={24} color={color} />,
        }}
      />

      <Tabs.Screen 
        name="modal" 
        options={{ 
          href: null,
        }} 
      />

    </Tabs>
  );
}