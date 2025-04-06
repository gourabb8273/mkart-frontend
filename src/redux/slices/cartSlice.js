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
      const { productId } = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === productId
      );
      if (!existingItem) {
        state.items.push(action.payload); 
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
    clearCart: (state) => {
      state.items = [];
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
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
