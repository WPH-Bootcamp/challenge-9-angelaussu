import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  category: string | null;
}

const initialState: FilterState = {
  category: null,
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
    },
  },
});

export const { setCategory } = filterSlice.actions;
export default filterSlice.reducer;
