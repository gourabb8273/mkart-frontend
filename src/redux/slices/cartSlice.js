// src/redux/slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
      state.status = "succeeded";
    },
    setCartStatus: (state, action) => {
      state.status = action.payload;
    },
    setCartError: (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    },
    addToCart: (state, action) => {
      const { productId, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === productId
      );
      if (!existingItem) {
        state.items.push({ productId, quantity });
      }
    },
    removeFromCart: (state, action) => {
      const { productId } = action.payload;
      state.items = state.items.filter((item) => item.productId !== productId);
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.productId === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
  },
});

export const {
  setCartItems,
  setCartStatus,
  setCartError,
  updateQuantity,
  addToCart,
  removeFromCart,
} = cartSlice.actions;
export default cartSlice.reducer;
