import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    product: [],
    singleProduct :[],
    userProducts : [],
    categories : [],
    searchResults: null, 
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
            state.singleProduct = product;
        },
        setCategories(state, action) {
            const categories = action.payload;
            state.categories = categories;
        },
        setUserProducts(state, action) {
            const products = action.payload;
            state.userProducts = products;
        },
        updateSearchResults: (state, action) => {
            state.searchResults = action.payload;
          },
    },
});

export const { setProduct,setSingleProduct,setUserProducts,setCategories,updateSearchResults} = productslice.actions;

export default productslice.reducer;