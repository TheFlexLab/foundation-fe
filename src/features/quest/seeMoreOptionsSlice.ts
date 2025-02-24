import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ShowOptionState {
  id: string;
  isShow: boolean;
}

const initialState: ShowOptionState = {
  id: '',
  isShow: false,
};

export const utilsSlice = createSlice({
  name: 'seeMoreOptionsUtils',
  initialState,
  reducers: {
    setOptionState: (state, action: PayloadAction<ShowOptionState>) => {
      state.id = action.payload.id;
      state.isShow = action.payload.isShow;
    },
    resetSeeMoreOptions: (state, action) => {
      state.id = '';
      state.isShow = false;
    },
  },
});

export const { setOptionState, resetSeeMoreOptions } = utilsSlice.actions;

export default utilsSlice.reducer;

export const getSeeMoreOptions = (state: { seeMoreOptionsUtils: ShowOptionState }) => state.seeMoreOptionsUtils;
