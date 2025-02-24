import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  guestSignUpDialogue: false,
  guestSignInDialogue: false,
  credentialLogin: false,
  credentialRegister: false,
  text: '',
};

export const extrasSlice = createSlice({
  name: 'extras',
  initialState,
  reducers: {
    setGuestSignUpDialogue: (state, action) => {
      state.guestSignInDialogue = false;
      state.credentialLogin = false;

      if (typeof action.payload === 'string') {
        state.guestSignUpDialogue = true;
        state.text = action.payload;
      } else if (action.payload === true) {
        state.guestSignUpDialogue = true;
        state.text = 'Please create and account to unlock this feature.';
      } else {
        state.guestSignUpDialogue = false;
        state.text = '';
      }
    },
    setGuestSignInDialogue: (state, action) => {
      state.guestSignUpDialogue = false;
      state.credentialLogin = false;
      state.guestSignInDialogue = action.payload;
    },
    setCredentialLogin: (state, action) => {
      state.guestSignUpDialogue = false;
      state.credentialLogin = action.payload;
    },
    setCredentialRegister: (state, action) => {
      state.guestSignInDialogue = false;
      state.credentialRegister = action.payload;
    },
    resetAuthModalState: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setGuestSignUpDialogue,
  setGuestSignInDialogue,
  setCredentialLogin,
  setCredentialRegister,
  resetAuthModalState,
} = extrasSlice.actions;

export default extrasSlice.reducer;
