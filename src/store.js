import { configureStore } from '@reduxjs/toolkit';
import messageReducer from '../src/slices/ToastSlice';
import cartReducer from '../src/slices/cartSlice';
import productReducer from '../src/slices/productSlice';
export const store = configureStore({
  reducer: {
    message: messageReducer,
    cart: cartReducer,
    product: productReducer,
  },
});

export default store;
