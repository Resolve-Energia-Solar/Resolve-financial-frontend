import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  selectedProduct: null,
};

const customProductsSlice = createSlice({
  name: 'customProducts',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex(
        (product) => product.id === action.payload.id
      );
      if (index !== -1) {
        state.products[index] = { ...state.products[index], ...action.payload };
      }
    },
    removeProduct: (state, action) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
    },
    removeProductsByIds: (state, action) => {
      const idsToRemove = action.payload;
      state.products = state.products.filter(
        (product) => !idsToRemove.includes(product.id)
      );
    },
    selectProduct: (state, action) => {
      state.selectedProduct = state.products.find(
        (product) => product.id === action.payload
      );
    },
    clearSelection: (state) => {
      state.selectedProduct = null;
    },
  },
});

export const selectProducts = (state) => state.customProducts.products;

export const {
  addProduct,
  updateProduct,
  removeProduct,
  removeProductsByIds,
  selectProduct,
  clearSelection,
} = customProductsSlice.actions;

export default customProductsSlice.reducer;
