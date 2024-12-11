//components/ShoppingList.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, editItem, deleteItem, togglePurchased, setItems } from '../redux/shoppingListSlice';
import { loadShoppingList, saveShoppingList } from '../utils/storage';

const ShoppingList = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.shoppingList.items);
  
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      const storedItems = await loadShoppingList();
      dispatch(setItems(storedItems));
    };
    fetchItems();
  }, [dispatch]);

  const handleAddItem = () => {
    if (itemName && itemQuantity) {
      const newItem = {
        id: Date.now().toString(),
        name: itemName,
        quantity: itemQuantity,
        purchased: false,
      };
      dispatch(addItem(newItem));
      saveShoppingList([...items, newItem]);
      setItemName('');
      setItemQuantity('');
    }
  };

  const handleEditItem = (id, name, quantity) => {
    setEditingItemId(id);
    setItemName(name);
    setItemQuantity(quantity);
  };

  const handleSaveEdit = () => {
    if (itemName && itemQuantity && editingItemId) {
      dispatch(editItem({ id: editingItemId, name: itemName, quantity: itemQuantity }));
      saveShoppingList(items);
      setItemName('');
      setItemQuantity('');
      setEditingItemId(null);
    }
  };

  const handleDeleteItem = (id) => {
    dispatch(deleteItem(id));
    saveShoppingList(items.filter(item => item.id !== id));
  };

  const handleTogglePurchased = (id) => {
    dispatch(togglePurchased(id));
    saveShoppingList(items);
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
      {editingItemId ? (
        <Button title="Save" onPress={handleSaveEdit} />
      ) : (
        <Button title="Add Item" onPress={handleAddItem} />
      )}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name} ({item.quantity})</Text>
            <Button title={item.purchased ? 'Mark as Unpurchased' : 'Mark as Purchased'} onPress={() => handleTogglePurchased(item.id)} />
            <Button title="Edit" onPress={() => handleEditItem(item.id, item.name, item.quantity)} />
            <Button title="Delete" onPress={() => handleDeleteItem(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

export default ShoppingList;
