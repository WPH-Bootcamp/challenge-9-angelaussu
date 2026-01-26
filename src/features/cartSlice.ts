import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  items: any[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<any>) {
      state.items.push(action.payload);
    },
  },
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
