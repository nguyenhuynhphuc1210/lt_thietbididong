// app/(tabs)/product.tsx
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const PRODUCTS = [
  { id: 'p1', name: 'Sản phẩm A', price: '100.000 VNĐ' },
  { id: 'p2', name: 'Sản phẩm B', price: '250.000 VNĐ' },
  { id: 'p3', name: 'Sản phẩm C', price: '50.000 VNĐ' },
];

const ProductItem = ({ name, price }: { name: string; price: string }) => (
  <View style={styles.productCard}>
    <Text style={styles.productName}>{name}</Text>
    <Text style={styles.productPrice}>{price}</Text>
  </View>
);

export default function ProductScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Danh Sách Sản Phẩm</Text>
      <FlatList
        data={PRODUCTS}
        renderItem={({ item }) => <ProductItem name={item.name} price={item.price} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  listContent: {
    paddingHorizontal: 20,
  },
  productCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  productPrice: {
    marginTop: 5,
    fontSize: 16,
    color: '#555',
  },
});