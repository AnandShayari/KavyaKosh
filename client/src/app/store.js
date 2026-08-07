import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import notificationReducer from '../features/notifications/notificationSlice';
import themeReducer from '../features/theme/themeSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    notifications: notificationReducer,
    theme: themeReducer,
  },
});

export default store;
