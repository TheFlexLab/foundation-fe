import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  askPassword: false,
};

export const userSettingsSlice = createSlice({
  name: 'userSettings',
  initialState,
  reducers: {
    setAskPassword: (state, action) => {
      state.askPassword = action.payload;
    },
  },
});

export const { setAskPassword } = userSettingsSlice.actions;

export default userSettingsSlice.reducer;

export const getAskPassword = (state) => state.userSettings.askPassword;
