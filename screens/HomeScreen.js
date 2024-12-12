import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ShoppingList from '../components/ShoppingList';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>🛒 Shopping List</Text>
      <ShoppingList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#F4F4F4',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default HomeScreen;
