import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; 
import { persistStore, persistReducer } from "redux-persist";
import { initMessageListener } from "redux-state-sync";
import cartReducer from './slices/cartSlice';
import userReducer from "./slices/userSlice";
import productReducer from "./slices/productSlice";
import orderReducer from "./slices/orderSlice";

// Configure Redux Persist
const persistConfig = {
  key: "root", // Key for storage
  storage, // Storage engine (localStorage)
  whitelist: ["user", "products", "cart", "order"],
};

const rootReducer = combineReducers({
  user: userReducer,
  products: productReducer,
  cart: cartReducer,
  order: orderReducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

initMessageListener(store);

export const persistor = persistStore(store); 
export default store;
