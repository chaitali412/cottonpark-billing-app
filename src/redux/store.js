import { configureStore } from '@reduxjs/toolkit';
import billingReducer from './billingSlice';

const store = configureStore({
  reducer: {
    billing: billingReducer,
  },
});

export default store;
