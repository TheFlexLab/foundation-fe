import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  progressValue: 0,
};

export const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    setProgress: (state, action) => {
      state.progressValue = action.payload;
    },
    updateProgress: (state, action) => {
      state.progressValue += 4.67;
    },
  },
});

export const { setProgress, updateProgress } = progressSlice.actions;

export default progressSlice.reducer;

// export const getProgress = (state) => state.progress.progressValue;
