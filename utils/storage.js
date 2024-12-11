//utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';


export const saveShoppingList = async (items) => {
  try {
    await AsyncStorage.setItem('shoppingList', JSON.stringify(items));
  } catch (error) {
    console.error('Error saving shopping list to storage:', error);
  }
};


export const loadShoppingList = async () => {
  try {
    const storedItems = await AsyncStorage.getItem('shoppingList');
    return storedItems ? JSON.parse(storedItems) : [];
  } catch (error) {
    console.error('Error loading shopping list from storage:', error);
    return [];
  }
};
