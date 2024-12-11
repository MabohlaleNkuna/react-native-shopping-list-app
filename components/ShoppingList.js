// components/ShoppingList.js

import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteItem, togglePurchased, setItems } from '../redux/shoppingListSlice';
import { loadShoppingList, saveShoppingList } from '../utils/storage';
import AddItem from './AddItem';

const ShoppingList = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.shoppingList.items);
  const [isAddingItem, setIsAddingItem] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      const storedItems = await loadShoppingList();
      dispatch(setItems(storedItems));
    };
    fetchItems();
  }, [dispatch]);

  const handleTogglePurchased = (id) => {
    dispatch(togglePurchased(id));
    saveShoppingList(items);
  };

  const handleDeleteItem = (id) => {
    dispatch(deleteItem(id));
    saveShoppingList(items.filter(item => item.id !== id));
  };

  return (
    <View>
      {isAddingItem ? (
        <AddItem closeModal={() => setIsAddingItem(false)} />
      ) : (
        <Button title="Add Item" onPress={() => setIsAddingItem(true)} />
      )}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ textDecorationLine: item.purchased ? 'line-through' : 'none' }}>
              {item.name} ({item.quantity})
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => handleTogglePurchased(item.id)}>
                <Text style={{ color: item.purchased ? 'green' : 'red' }}>
                  {item.purchased ? '✔' : '❌'}
                </Text>
              </TouchableOpacity>
              <Button title="Delete" onPress={() => handleDeleteItem(item.id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ShoppingList;
