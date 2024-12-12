import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { deleteItem, togglePurchased, setItems, updateItem } from '../redux/shoppingListSlice';
import { loadShoppingList, saveShoppingList } from '../utils/storage';
import AddItem from './AddItem';

const ShoppingList = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.shoppingList.items);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
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
    setEditingItem(item.id);
    setEditedName(item.name);
    setEditedQuantity(item.quantity.toString());
  };

  const handleSaveEdit = (id) => {
    dispatch(updateItem({ id, name: editedName, quantity: parseInt(editedQuantity) }));
    saveShoppingList(
      items.map((item) =>
        item.id === id ? { ...item, name: editedName, quantity: parseInt(editedQuantity) } : item
      )
    );
    setEditingItem(null);
    setEditedName('');
    setEditedQuantity('');
  };

  return (
    <View style={styles.container}>
      {isAddingItem ? (
        <AddItem closeModal={() => setIsAddingItem(false)} />
      ) : null}

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
                <Icon name="edit" size={24} color="orange" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
                <Icon name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        onPress={() => setIsAddingItem(true)}
        style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Item</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
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
    fontSize: 16,
    color: '#333',
  },
  purchased: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
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
