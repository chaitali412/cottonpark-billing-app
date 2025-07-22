import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    billingInfo: {}
};

const billingSlice = createSlice({
    name: 'billing',
    initialState,
    reducers: {
        addBillingInfo(state, action) {
            state.billingInfo = action.payload;
        },
        clearBillingInfo(state) {
            state.billingInfo = {};
        }
    }
});

export const { addBillingInfo, clearBillingInfo } = billingSlice.actions;
export default billingSlice.reducer;