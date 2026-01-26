import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { Provider } from "react-redux";
import { store } from "./features/store";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/react-query";

import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/context/CartContext"; // ✅ API-BASED

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            {" "}
            {/* ✅ HARUS DI SINI */}
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
);
