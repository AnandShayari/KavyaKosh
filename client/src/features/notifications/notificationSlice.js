import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { items: [], unread: 0 },
  reducers: {
    setNotifications: (state, action) => {
      state.items = action.payload.data || [];
      state.unread = action.payload.unread || 0;
    },
    decrementUnread: (state) => {
      if (state.unread > 0) state.unread -= 1;
    },
    clearUnread: (state) => { state.unread = 0; },
  },
});

export const { setNotifications, decrementUnread, clearUnread } = notificationSlice.actions;
export default notificationSlice.reducer;
