// screens/HomeScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ShoppingList from '../components/ShoppingList';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shopping List</Text>
      <ShoppingList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
