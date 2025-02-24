import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  index: 0,
  popup: false,
};

export const onBoardingPopupSlice = createSlice({
  name: 'onBoardingPopup',
  initialState,
  reducers: {
    incIndex: (state) => {
      state.index = state.index + 1;
    },
    setIndex: (state, action) => {
      state.index = action.payload;
    },
    setPopup: (state, action) => {
      state.popup = action.payload;
    },
  },
});

export const { incIndex, setIndex, setPopup } = onBoardingPopupSlice.actions;

export default onBoardingPopupSlice.reducer;
