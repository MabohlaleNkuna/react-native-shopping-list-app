// components/AddItem.js

import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { addItem } from '../redux/shoppingListSlice';

const AddItem = ({ closeModal }) => {
  const dispatch = useDispatch();
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');

  const handleAddItem = () => {
    if (!itemName || !itemQuantity) {
      Alert.alert("Please enter item name and quantity");
      return;
    }
    dispatch(addItem({ name: itemName, quantity: itemQuantity }));
    closeModal(); 
  };

  return (
    <View>
      <TextInput
        value={itemName}
        onChangeText={setItemName}
        placeholder="Item Name"
      />
      <TextInput
        value={itemQuantity}
        onChangeText={setItemQuantity}
        placeholder="Quantity"
        keyboardType="numeric"
      />
      <Button title="Add Item" onPress={handleAddItem} />
    </View>
  );
};

export default AddItem;
