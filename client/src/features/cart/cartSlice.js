import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], count: 0 },
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload.items || [];
      state.count = state.items.length;
    },
    clearCart: (state) => {
      state.items = [];
      state.count = 0;
    },
  },
});

export const { setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
