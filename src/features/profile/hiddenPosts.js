import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filterStates: {
    filterBySort: 'Newest First',
    filterByType: '',
    searchData: '',
  },
};

export const hiddenPostsSlice = createSlice({
  name: 'hiddenPosts',
  initialState,
  reducers: {
    updateSearch: (state, action) => {
      state.filterStates.searchData = action.payload;
    },
  },
});

export const { updateSearch } = hiddenPostsSlice.actions;

export default hiddenPostsSlice.reducer;

export const hiddenPostFilters = (state) => state.hiddenPosts.filterStates;
