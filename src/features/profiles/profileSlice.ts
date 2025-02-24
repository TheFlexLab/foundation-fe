import { createSlice } from '@reduxjs/toolkit';

interface ProfileState {
  filterStates: {
    filterBySort: string;
    searchData: string;
  };
}

const initialState: ProfileState = {
  filterStates: {
    filterBySort: 'Newest First',
    searchData: '',
  },
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfileSearch: (state, action) => {
      state.filterStates.searchData = action.payload;
    },
  },
});

export const { updateProfileSearch } = profileSlice.actions;

export default profileSlice.reducer;

export const profileFilters = (state: { profile: ProfileState }) => state.profile.filterStates;
