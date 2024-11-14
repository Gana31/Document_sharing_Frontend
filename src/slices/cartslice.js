import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    product: []
};

const cartslice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setCartProduct(state, action) {
            const product = action.payload;
            state.product = product;
        },
      
    },
});

export const { setCartProduct} = cartslice.actions;

export default cartslice.reducer;