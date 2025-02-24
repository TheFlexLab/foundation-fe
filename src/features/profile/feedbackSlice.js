import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filterStates: {
    // filterBySort: 'Newest First',
    // filterByType: '',
    searchData: '',
  },
};

export const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    updateFeedbackSearch: (state, action) => {
      state.filterStates.searchData = action.payload;
    },
  },
});

export const { updateFeedbackSearch } = feedbackSlice.actions;

export default feedbackSlice.reducer;

export const feedbackFilters = (state) => state.feedback.filterStates;
