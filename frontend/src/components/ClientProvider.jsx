"use client"; // ✅ Ensures it's a client component

import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react"; 
import store, { persistor } from "../store/store"; // Import `persistor`

export default function ClientProvider({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Toaster />
        {children}
      </PersistGate>
    </Provider>
  );
}
