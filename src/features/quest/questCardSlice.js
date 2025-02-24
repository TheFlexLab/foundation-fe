import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  answersSelection: [],
};

export const questCardSlice = createSlice({
  name: 'questCard',
  initialState,
  reducers: {
    setTopicSearch: (state, action) => {
      state.answersSelection = action.payload;
    },
    resetFilters: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setTopicSearch, resetFilters } = questCardSlice.actions;

export default questCardSlice.reducer;

export const getQuestCardData = (state) => state.questCard;
