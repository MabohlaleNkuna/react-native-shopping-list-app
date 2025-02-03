import AsyncStorage from '@react-native-async-storage/async-storage';

//load the shopping list from AsyncStorage
export const loadShoppingList = async () => {
  try {
    const storedItems = await AsyncStorage.getItem('shoppingList');
    return storedItems ? JSON.parse(storedItems) : [];
  } catch (error) {
    console.error('Error loading shopping list from AsyncStorage:', error);
    return [];
  }
};

// save the shopping list to AsyncStorage
export const saveShoppingList = async (items) => {
  try {
    await AsyncStorage.setItem('shoppingList', JSON.stringify(items));
  } catch (error) {
    console.error('Error saving shopping list to AsyncStorage:', error);
  }
};
