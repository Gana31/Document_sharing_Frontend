import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: JSON.parse(localStorage.getItem("cartProducts")) || [], 
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
      localStorage.setItem("cartProducts", JSON.stringify(state.products));
    },
    removeProduct(state, action) {
        const productId = action.payload;
        state.products = state.products.filter((product) => product.id !== productId);
        localStorage.setItem("cartProducts", JSON.stringify(state.products));
    },
    increaseQuantity(state, action) {
      const productId = action.payload;
      const product = state.products.find((item) => item.id === productId);
      if (product) {
        product.quantity += 1;
        localStorage.setItem("cartProducts", JSON.stringify(state.products));
      }
    },
    decreaseQuantity(state, action) {
      const productId = action.payload;
      const product = state.products.find((item) => item.id === productId);
      if (product && product.quantity > 1) {
        product.quantity -= 1;
        localStorage.setItem("cartProducts", JSON.stringify(state.products));
      }
    },
    clearCart(state) {
      state.products = [];
      localStorage.removeItem("cartProducts"); // Clear from localStorage
    },
  },
});
export const selectCartTotalCount = (state) =>
  state.cart.products.reduce((total, item) => total + item.quantity, 0);

export const { addOrUpdateProduct ,removeProduct,increaseQuantity,decreaseQuantity,clearCart} = cartslice.actions;

export default cartslice.reducer;
