import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteItem, togglePurchased, setItems, updateItem } from '../redux/shoppingListSlice';
import { loadShoppingList, saveShoppingList } from '../utils/storage';
import AddItem from './AddItem';
import CustomButton from './CustomButton';

const ShoppingList = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.shoppingList.items);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedQuantity, setEditedQuantity] = useState('');

  // Load items once on initial load
  useEffect(() => {
    const fetchItems = async () => {
      const storedItems = await loadShoppingList();
      dispatch(setItems(storedItems));
    };
    fetchItems();
  }, [dispatch]);

  // Save items to AsyncStorage whenever items are updated
  useEffect(() => {
    saveShoppingList(items);
  }, [items]);

  const handleTogglePurchased = (id) => {
    dispatch(togglePurchased(id));
  };

  const handleDeleteItem = (id) => {
    dispatch(deleteItem(id));
  };

  const handleEditItem = (item) => {
    setEditingItem(item.id);
    setEditedName(item.name);
    setEditedQuantity(item.quantity.toString());
  };

  const handleSaveEdit = (id) => {
    dispatch(updateItem({ id, name: editedName, quantity: parseInt(editedQuantity) }));
    setEditingItem(null);
    setEditedName('');
    setEditedQuantity('');
  };

  return (
    <View style={styles.container}>
      {isAddingItem && <AddItem closeModal={() => setIsAddingItem(false)} />}

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
                <CustomButton title="Save" icon="save" onPress={() => handleSaveEdit(item.id)} />
              </View>
            ) : (
              <Text style={[styles.itemText, item.purchased && styles.purchased]}>
                {item.name} ({item.quantity})
              </Text>
            )}
            <View style={styles.iconContainer}>
              <CustomButton icon={item.purchased ? 'check-circle' : 'radio-button-unchecked'} color="transparent" iconColor={item.purchased ? 'green' : 'red'} onPress={() => handleTogglePurchased(item.id)} />
              <CustomButton icon="edit" color="transparent" iconColor="orange" onPress={() => handleEditItem(item)} />
              <CustomButton icon="delete" color="transparent" iconColor="red" onPress={() => handleDeleteItem(item.id)} />
            </View>
          </View>
        )}
      />

      <CustomButton title="Add Item" icon="add" onPress={() => setIsAddingItem(true)} />
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
  },
});

export default ShoppingList;
