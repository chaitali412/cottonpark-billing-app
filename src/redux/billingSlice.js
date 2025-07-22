import { createSlice } from '@reduxjs/toolkit';

const billingSlice = createSlice({
  name: 'billing',
  initialState: {
    records: []
  },
  reducers: {
    updateBillingData: (state, action) => {
        state.records.push(action.payload);
    },
    clearBillingData: () => ({
      customerName: '',
      itemName: '',
      quantity: 0,
      price: 0,
      gst: 0,
      totalAmount: 0,
    }),
  },
});

export const { updateBillingData, clearBillingData } = billingSlice.actions;
export default billingSlice.reducer;
