import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.status = "succeeded";
    },
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    removeProduct: (state, action) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex(
        (product) => product.id === action.payload.id
      );
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const {
  setProducts,
  addProduct,
  removeProduct,
  updateProduct,
  setError,
  setStatus,
} = productSlice.actions;

export default productSlice.reducer;
