import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  error: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
      state.status = "succeeded";
    },
    addOrder: (state, action) => {
      state.orders.push(action.payload);
    },
    removeOrder: (state, action) => {
      state.orders = state.orders.filter(
        (order) => order.id !== action.payload
      );
    },
    updateOrder: (state, action) => {
      const index = state.orders.findIndex(
        (order) => order.id === action.payload.id
      );
      if (index !== -1) {
        state.orders[index] = action.payload;
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
  setOrders,
  addOrder,
  removeOrder,
  updateOrder,
  setError,
  setStatus,
} = orderSlice.actions;

export default orderSlice.reducer;
