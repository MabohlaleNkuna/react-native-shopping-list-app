import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  error: null,
};

const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { name, quantity } = action.payload;
      if (!name || name.trim() === '') {
        state.error = 'Item name cannot be empty!';
        return;
      }
      if (isNaN(quantity) || quantity <= 0) {
        state.error = 'Quantity must be a valid number greater than 0!';
        return;
      }
      state.items.push({
        id: Date.now(),
        name,
        quantity: parseInt(quantity),
        purchased: false,
      });
      state.error = null;
    },
    setItems: (state, action) => {
      state.items = action.payload;
    },
    togglePurchased: (state, action) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.purchased = !item.purchased;
      }
    },
    deleteItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateItem: (state, action) => {
      const { id, name, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.name = name;
        item.quantity = quantity;
      }
    },
  },
});

export const { addItem, setItems, togglePurchased, deleteItem, updateItem } = shoppingListSlice.actions;

export default shoppingListSlice.reducer;
