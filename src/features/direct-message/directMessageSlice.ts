import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  from: '',
  to: '',
  subject: '',
  message: '',
  platform: '',
  id: '',
  uuid: '',
  readReward: 0.01,
  draftId: '',
  questStartData: null,
  questForeignKey: '',
  options: [],
  // ... SendMessageFormDomain
  sendFdxAmount: 0,
  messageContext: '',
  domain: '',
};

export const directMessageSlice = createSlice({
  name: 'directMessage',
  initialState,
  reducers: {
    setDirectMessageForm: (state, action) => {
      const { to, options, ...rest } = action.payload;

      if (to !== undefined) {
        state.to = to ? formatRecipient(to) : '';
      }

      if (options) {
        state.options = sortOptionsBySelected(options);
      }

      Object.assign(state, rest);
    },
    resetDirectMessageForm: () => initialState,
  },
});

const formatRecipient = (to: string) => {
  const trimmedTo = to?.trim().toLowerCase();

  if (trimmedTo === 'all') {
    return 'All';
  } else if (trimmedTo === 'list') {
    return 'List';
  } else if (trimmedTo === 'participants') {
    return 'Participants';
  } else {
    return trimmedTo;
  }
};

const sortOptionsBySelected = (options: []) => {
  return [...options].sort((a: any, b: any) => {
    return a.selected === b.selected ? 0 : a.selected ? -1 : 1;
  });
};

export const { setDirectMessageForm, resetDirectMessageForm } = directMessageSlice.actions;

export default directMessageSlice.reducer;
