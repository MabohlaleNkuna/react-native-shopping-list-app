import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import icons
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
        <TouchableOpacity onPress={() => setIsAddingItem(true)} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Item</Text>
        </TouchableOpacity>
      )}
  
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            {editingItem === item.id ? (
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.textInput}
                  value={editedName}
                  onChangeText={setEditedName}
                  placeholder="Edit Name"
                />
                <TextInput
                  style={styles.textInput}
                  value={editedQuantity}
                  onChangeText={setEditedQuantity}
                  placeholder="Edit Quantity"
                  keyboardType="numeric"
                />
                <TouchableOpacity onPress={() => handleSaveEdit(item.id)}>
                  <Icon name="save" size={24} color="blue" />
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={[styles.itemText, item.purchased && styles.purchased]}>
                {item.name} ({item.quantity})
              </Text>
            )}
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => handleTogglePurchased(item.id)}>
                <Icon
                  name={item.purchased ? 'check-circle' : 'radio-button-unchecked'}
                  size={24}
                  color={item.purchased ? 'green' : 'red'}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleEditItem(item)}>
                <Icon name="edit" size={24} color="orange" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
                <Icon name="delete" size={24} color="red" style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
  
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  editContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    borderBottomWidth: 1,
    flex: 1,
    marginHorizontal: 5,
  },
  itemText: {
    flex: 1,
  },
  purchased: {
    textDecorationLine: 'line-through',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginHorizontal: 5,
  },
  addButton: {
    backgroundColor: '#4CAF50', 
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 10,
    elevation: 2, 
  },
  addButtonText: {
    color: '#FFFFFF', 
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});


export default ShoppingList;
