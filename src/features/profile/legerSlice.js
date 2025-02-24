import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

export const ledgerSlice = createSlice({
  name: 'ledger',
  initialState,
  reducers: {
    updateColumnSize: (state, action) => {
      const { columnId, size } = action.payload;
      state[columnId] = size;
    },
    resetCreateQuest: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { updateColumnSize, resetCreateQuest } = ledgerSlice.actions;

export default ledgerSlice.reducer;

export const getLedger = (state) => state.ledger;
