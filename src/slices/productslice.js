import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    product: []
};

const productslice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setProduct(state, action) {
            const product = action.payload;
            state.product = product;
        },
        setSingleProduct(state, action) {
            const product = action.payload;
            state.product = product;
        },

    },
});

export const { setProduct,setSingleProduct} = productslice.actions;

export default productslice.reducer;