import React, { useState } from 'react';
import { View, TextInput, Alert, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { addItem } from '../redux/shoppingListSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={itemName}
        onChangeText={setItemName}
        placeholder="Item Name"
        placeholderTextColor="#777"
      />
      <TextInput
        style={styles.textInput}
        value={itemQuantity}
        onChangeText={setItemQuantity}
        placeholder="Quantity"
        keyboardType="numeric"
        placeholderTextColor="#777"
      />
      <Icon
        name="add-circle"
        size={40}
        color="green"
        onPress={handleAddItem}
        style={styles.addButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    alignItems: 'center',
  },
  textInput: {
    width: '80%',
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#F4F4F4',
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addButton: {
    marginTop: 15,
  },
});

export default AddItem;
