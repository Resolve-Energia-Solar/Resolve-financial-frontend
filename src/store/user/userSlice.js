import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, 
  permissions: [], 
  last_login: null, 
  access_token: null, 
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user; 
      state.permissions = action.payload.user_permissions; 
      state.last_login = action.payload.last_login; 
      state.access_token = action.payload.access_token;
    },
    clearUser: (state) => {
      state.user = null;
      state.permissions = [];
      state.last_login = null;
      state.access_token = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
