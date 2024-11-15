import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [], // Keep track of cart items
};

const cartslice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    addOrUpdateProduct(state, action) {
      const { product, quantity } = action.payload;
      const numericQuantity = Number(quantity);
      const existingProduct = state.products.find((item) => item.id === product.id);

      if (existingProduct) {
        existingProduct.quantity += numericQuantity; // Add as a number
      } else {
        state.products.push({ ...product, quantity: numericQuantity });
      }
    },
    removeProduct(state, action) {
        const productId = action.payload;
        state.products = state.products.filter((product) => product.id !== productId);
    },

  },
});

export const { addOrUpdateProduct ,removeProduct} = cartslice.actions;

export default cartslice.reducer;
