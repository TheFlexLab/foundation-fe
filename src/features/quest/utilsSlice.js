import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sharedQuestStatus: {
    type: null,
    isDialogueBox: false,
    link: null,
    id: null,
  },
  isDialogueBox: false,
  addOptionLimit: 0,
  hiddenPosts: [],
  sharedLinkPost: null,
  hiddenPostId: null,
  DisabledPostId: null,
  enablePostId: null,
  playingIds: [],
  isMediaPlaying: false,
  playerPlayingId: '',
  isShowPlayer: false,
  loop: true,
  hasNextPage: true,
  adultFilterPopup: {
    rating: 0,
  },
  areHiddenPosts: false,
  areShareLinks: false,
  areFeedBackPosts: false,
};

export const utilsSlice = createSlice({
  name: 'questUtils',
  initialState,
  reducers: {
    updateDialogueBox: (state, action) => {
      const { type, status, link, id } = action.payload;
      state.sharedQuestStatus.type = type;
      state.sharedQuestStatus.isDialogueBox = status;
      state.sharedQuestStatus.link = link;
      state.sharedQuestStatus.id = id;
    },
    updateaddOptionLimit: (state) => {
      state.addOptionLimit = state.addOptionLimit + 1;
    },
    resetaddOptionLimit: (state) => {
      state.addOptionLimit = initialState.addOptionLimit;
    },
    addHiddenPosts: (state, action) => {
      state.hiddenPosts.push(action.payload);
    },
    removeHiddenPosts: (state, action) => {
      state.hiddenPosts = state.hiddenPosts.filter((item) => item !== action.payload);
    },
    addSharedLinkPost: (state, action) => {
      state.sharedLinkPost = action.payload;
    },
    addHiddenPostId: (state, action) => {
      state.hiddenPostId = action.payload;
    },
    addDisabledPostId: (state, action) => {
      state.DisabledPostId = action.payload;
    },
    addEnablePostId: (state, action) => {
      state.enablePostId = action.payload;
    },
    toggleMedia: (state, action) => {
      state.isMediaPlaying = action.payload;
    },
    setNextPage: (state, action) => {
      state.hasNextPage = action.payload;
    },
    toggleLoop: (state, action) => {
      state.loop = action.payload;
    },
    setPlayingPlayerId: (state, action) => {
      state.playerPlayingId = action.payload;
    },
    resetPlayingIds: (state) => {
      state.playingIds = initialState.playingIds;
    },
    setIsShowPlayer: (state, action) => {
      state.isShowPlayer = action.payload;
    },
    addPlayerId: (state, action) => {
      if (!state.playingIds?.includes(action.payload)) {
        state.playingIds.push(action.payload);
      }
    },
    addAdultFilterPopup: (state, action) => {
      state.adultFilterPopup.rating = action.payload.rating;
    },
    setAreHiddenPosts: (state, action) => {
      state.areHiddenPosts = action.payload;
    },
    setAreShareLinks: (state, action) => {
      state.areShareLinks = action.payload;
    },
    setAreFeedbackPosts: (state, action) => {
      state.areFeedBackPosts = action.payload;
    },
  },
});

export const {
  updateDialogueBox,
  updateaddOptionLimit,
  resetaddOptionLimit,
  addHiddenPosts,
  removeHiddenPosts,
  addSharedLinkPost,
  addHiddenPostId,
  addDisabledPostId,
  addEnablePostId,
  addBookmarkResponse,
  removeBookmarkResponse,
  toggleMedia,
  setNextPage,
  setPlayingPlayerId,
  setIsShowPlayer,
  addPlayerId,
  toggleLoop,
  resetPlayingIds,
  addAdultFilterPopup,
  setAreHiddenPosts,
  setAreShareLinks,
  setAreFeedbackPosts,
} = utilsSlice.actions;

export default utilsSlice.reducer;

export const getQuestUtils = (state) => state.questUtils;
