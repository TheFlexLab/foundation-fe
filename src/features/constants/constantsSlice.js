import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  constants: null,
};

export const constantsSlice = createSlice({
  name: 'systemConstants',
  initialState,
  reducers: {
    saveConstants: (state, action) => {
      state.constants = action.payload;
    },
  },
});

export const { saveConstants } = constantsSlice.actions;

export default constantsSlice.reducer;

export const getConstantsValues = (state) => state.systemConstants.constants;
