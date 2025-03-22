import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  selectedProduct: null,
  leads: {},
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
      const productId = action.payload;

      state.products = state.products.filter(product => product.id !== productId);

      Object.keys(state.leads).forEach((leadId) => {
        state.leads[leadId] = state.leads[leadId].filter(id => id !== productId);
        if (state.leads[leadId].length === 0) {
          delete state.leads[leadId];
        }
      });
    },
    removeProductsByIds: (state, action) => {
      const idsToRemove = action.payload;

      state.products = state.products.filter(
        (product) => Array.isArray(idsToRemove) && !idsToRemove.includes(product.id)
      );

      Object.keys(state.leads).forEach((leadId) => {
        state.leads[leadId] = state.leads[leadId].filter(
          (productId) => !idsToRemove.includes(productId)
        );
        if (state.leads[leadId].length === 0) {
          delete state.leads[leadId];
        }
      });
    },
    selectProduct: (state, action) => {
      state.selectedProduct = state.products.find(
        (product) => product.id === action.payload
      );
    },
    clearSelection: (state) => {
      state.selectedProduct = null;
    },
    associateProductWithLead: (state, action) => {
      const { leadId, productId } = action.payload;

      const productExists = state.products.some(product => product.id === productId);
      if (!productExists) return;

      if (!state.leads[leadId]) {
        state.leads[leadId] = [];
      }
      if (!state.leads[leadId].includes(productId)) {
        state.leads[leadId].push(productId);
      }
    },
    removeProductFromLead: (state, action) => {
      const { leadId, productIds } = action.payload;

      if (state.leads[leadId]) {
        state.leads[leadId] = state.leads[leadId].filter(
          (id) => !productIds.includes(id)
        );

        if (state.leads[leadId].length === 0) {
          delete state.leads[leadId];
        }
      }
    },
  },
});

export const selectProducts = (state) => state.customProducts.products;

export const selectProductsByLead = (leadId) => (state) =>
  state.customProducts.leads[leadId]?.map((productId) =>
    state.customProducts.products.find((product) => product.id === productId)
  ) || [];

export const {
  addProduct,
  updateProduct,
  removeProduct,
  removeProductsByIds,
  selectProduct,
  clearSelection,
  associateProductWithLead,
  removeProductFromLead,
} = customProductsSlice.actions;

export default customProductsSlice.reducer;
