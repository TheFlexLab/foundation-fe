import { createSlice } from '@reduxjs/toolkit';

interface NewsFeedState {
  filterStates: {
    filterBySort: string;
    searchData: string;
  };
}

const initialState: NewsFeedState = {
  filterStates: {
    filterBySort: 'Newest First',
    searchData: '',
  },
};

export const newsFeedSlice = createSlice({
  name: 'newsFeed',
  initialState,
  reducers: {
    updateNewsFeedSearch: (state, action) => {
      state.filterStates.searchData = action.payload;
    },
  },
});

export const { updateNewsFeedSearch } = newsFeedSlice.actions;

export default newsFeedSlice.reducer;

export const newsFeedFilters = (state: { newsFeed: NewsFeedState }) => state.newsFeed.filterStates;
