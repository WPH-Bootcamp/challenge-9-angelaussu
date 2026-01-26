import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import filterReducer from "./filterSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    filters: filterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
