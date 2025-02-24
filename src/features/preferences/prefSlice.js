import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  topicSearch: '',
};

export const prefSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setTopicSearch: (state, action) => {
      state.topicSearch = action.payload;
    },
    resetFilters: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setTopicSearch, resetFilters } = prefSlice.actions;

export default prefSlice.reducer;

export const getPrefs = (state) => state.preferences;
