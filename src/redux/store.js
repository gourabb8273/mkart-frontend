// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import reduxLogger from "redux-logger";
import { createStateSyncMiddleware, initMessageListener } from "redux-state-sync";

import userReducer from "./slices/userSlice";

const reduxStateSyncConfig = {};

const reducer = combineReducers({
  user: userReducer,
});

// const middlewares = [
//   createStateSyncMiddleware(reduxStateSyncConfig),
//   reduxLogger,
// ];

const store = configureStore({
  reducer,
//   middleware: [...middlewares],
});

initMessageListener(store);

export default store;
