"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";

import tokenReducer from "./slices/tokenSlice";
import socketReducer from "./slices/soketSlice"; // ✅ Correct import

// 🔹 Combine all reducers
const rootReducer = combineReducers({
  token: tokenReducer,
  socket: socketReducer, 
});

// 🔹 Persist the entire Redux store
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"], // ✅ Ignore persist actions
      },
    }),
});

export const persistor = persistStore(store);
export default store;
