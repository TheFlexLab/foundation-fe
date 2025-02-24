import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
};

export const utilsSlice = createSlice({
  name: 'utils',
  initialState,
  reducers: {
    changeTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    changeThemeTo: (state, payload) => {
      state.theme = payload.payload;
    },
  },
});

export const { changeTheme, changeThemeTo } = utilsSlice.actions;

export default utilsSlice.reducer;
