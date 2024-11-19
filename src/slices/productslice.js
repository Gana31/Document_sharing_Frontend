import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    product: [],
    userProducts : []
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
        setUserProducts(state, action) {
            const products = action.payload;
            state.userProducts = products;
        },
    },
});

export const { setProduct,setSingleProduct,setUserProducts} = productslice.actions;

export default productslice.reducer;