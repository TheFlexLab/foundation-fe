import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';

import storage from 'redux-persist/lib/storage';

// reducers
import utilsReducer from '../features/utils/utilsSlice';
import authReducer from '../features/auth/authSlice';
import filterReducer from '../features/sidebar/filtersSlice';
import bookmarkFilterReducer from '../features/sidebar/bookmarkFilterSlice';
import questsReducer from '../features/quest/questsSlice';
import questUtilsReducer from '../features/quest/utilsSlice';
import prefReducer from '../features/preferences/prefSlice';
import questCardReducer from '../features/quest/questCardSlice';
import createQuestReducer from '../features/createQuest/createQuestSlice';
import pictureMediaReducer from '../features/createQuest/pictureMediaSlice';
import ledgerReducer from '../features/profile/legerSlice';
import hiddenPostReducer from '../features/profile/hiddenPosts';
import sharedLinksReducer from '../features/profile/sharedLinks';
import feedbackReducer from '../features/profile/feedbackSlice';
import systemConstantsReducer from '../features/constants/constantsSlice';
import userSettingsReducer from '../features/profile/userSettingSlice';
import seeMoreOptionsReducer from '../features/quest/seeMoreOptionsSlice';
import extrasReducer from '../features/extras/extrasSlice';
import seldonReducer from '../features/seldon-ai/seldonSlice';
import newsFeedReducer from '../features/news-feed/newsFeedSlice';
import seldonDataReducer from '../features/seldon-ai/seldonDataSlice';
import directMessageReducer from '../features/direct-message/directMessageSlice';
import profileReducer from '../features/profiles/profileSlice';
import progressReducer from '../features/progress/progressSlice';
import onBoardingPopupReducer  from '../features/OnBoardingPopup/onBoardingPopupSlice';

const persistConfig = {
  key: 'persist-store',
  version: 1,
  storage,
  whitelist: [
    'utils',
    'auth',
    'filters',
    'bookmarkFilters',
    'systemConstants',
    'userSettings',
    'ledger',
    'seldon',
    'seldonData',
    'onBoardingPopup'
  ],
};

const reducer = combineReducers({
  utils: utilsReducer,
  systemConstants: systemConstantsReducer,
  auth: authReducer,
  filters: filterReducer,
  bookmarkFilters: bookmarkFilterReducer,
  quests: questsReducer,
  questUtils: questUtilsReducer,
  preferences: prefReducer,
  questCard: questCardReducer,
  createQuest: createQuestReducer,
  pictureMedia: pictureMediaReducer,
  ledger: ledgerReducer,
  hiddenPosts: hiddenPostReducer,
  sharedLinks: sharedLinksReducer,
  feedback: feedbackReducer,
  userSettings: userSettingsReducer,
  seeMoreOptionsUtils: seeMoreOptionsReducer,
  extras: extrasReducer,
  seldon: seldonReducer,
  newsFeed: newsFeedReducer,
  profile: profileReducer,
  seldonData: seldonDataReducer,
  directMessage: directMessageReducer,
  progress:progressReducer,
  onBoardingPopup:onBoardingPopupReducer

});

const persistedReducers = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});
