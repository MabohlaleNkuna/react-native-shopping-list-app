import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteItem, togglePurchased, setItems, updateItem } from '../redux/shoppingListSlice';
import { loadShoppingList, saveShoppingList } from '../utils/storage';
import AddItem from './AddItem';

const ShoppingList = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.shoppingList.items);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // Track the item being edited
  const [editedName, setEditedName] = useState('');
  const [editedQuantity, setEditedQuantity] = useState('');

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
    saveShoppingList(items.filter((item) => item.id !== id));
  };

  const handleEditItem = (item) => {
    setEditingItem(item.id); // Set the item being edited
    setEditedName(item.name); // Pre-fill name
    setEditedQuantity(item.quantity.toString()); // Pre-fill quantity
  };

  const handleSaveEdit = (id) => {
    dispatch(updateItem({ id, name: editedName, quantity: parseInt(editedQuantity) }));
    saveShoppingList(items.map((item) =>
      item.id === id ? { ...item, name: editedName, quantity: parseInt(editedQuantity) } : item
    ));
    setEditingItem(null); // Exit edit mode
    setEditedName('');
    setEditedQuantity('');
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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            {editingItem === item.id ? (
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <TextInput
                  style={{ borderBottomWidth: 1, marginRight: 5, flex: 1 }}
                  value={editedName}
                  onChangeText={setEditedName}
                  placeholder="Edit Name"
                />
                <TextInput
                  style={{ borderBottomWidth: 1, marginRight: 5, flex: 1 }}
                  value={editedQuantity}
                  onChangeText={setEditedQuantity}
                  placeholder="Edit Quantity"
                  keyboardType="numeric"
                />
                <Button title="Save" onPress={() => handleSaveEdit(item.id)} />
              </View>
            ) : (
              <Text style={{ textDecorationLine: item.purchased ? 'line-through' : 'none', flex: 1 }}>
                {item.name} ({item.quantity})
              </Text>
            )}
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => handleTogglePurchased(item.id)}>
                <Text style={{ color: item.purchased ? 'green' : 'red', marginHorizontal: 5 }}>
                  {item.purchased ? '✔' : '❌'}
                </Text>
              </TouchableOpacity>
              <Button title="Edit" onPress={() => handleEditItem(item)} />
              <Button title="Delete" onPress={() => handleDeleteItem(item.id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ShoppingList;
