import { createSelector } from 'reselect';
import * as questServices from '../../services/api/questsApi';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { checkAnswerExistCreateQuest } from '../../services/api/questsApi';

export const checkPicsDescription = createAsyncThunk('createQuest/checkPicsDescription', async (value) => {
  const result = await questServices.questionValidation({
    question: value,
    queryType: 'yes/no',
  });
  return result;
});

export const checkPictureUrl = createAsyncThunk('createQuest/checkPictureUrl', async ({ id, value, index }) => {
  const result = await questServices.pictureUrlCheck({ url: value });
  return { id, result, index };
});

const defaultStatus = {
  name: 'Ok',
  color: 'text-[#389CE3] dark:text-blue-700',
  tooltipName: 'Please write something...',
  tooltipStyle: 'tooltip-info',
  status: false,
  showToolTipMsg: true,
};

const initialState = {
  pictureMedia: {
    isPicMedia: false,
    picDesctiption: '',
    validatedPicDescription: '',
    picDescStatus: {
      ...defaultStatus,
    },
    chatgptPicDescStatus: {
      ...defaultStatus,
    },
    url: [],
  },
  optionsValue: Array.from({ length: 1 }, (_, index) => ({
    id: `index-${index}`,
    picUrl: '',
    validatedPicUrl: '',
    picUrlStatus: { ...defaultStatus },
    chatgptPicUrlStatus: { ...defaultStatus },
  })),
};

export const pictureMediaSlice = createSlice({
  name: 'pictureMedia',
  initialState,
  reducers: {
    updateIsPicMedia: (state, action) => {
      state.pictureMedia.isPicMedia = action.payload;
    },
    addPicsMediaDesc: (state, action) => {
      if (action.payload === state.media.validatedDescription) {
        state.pictureMedia.picDescStatus = state.pictureMedia.chatgptPicDescStatus;
        state.pictureMedia.picDesctiption = state.pictureMedia.validatedPicDescription;
        return;
      }
      state.pictureMedia.picDescStatus = { ...defaultStatus };
      state.pictureMedia.picDesctiption = action.payload;
    },
    addPicUrl: (state, action) => {
      if (action.payload === state.pictureMedia.validatedPicUrl) {
        // state.pictureMedia.picUrlStatus = state.pictureMedia.chatgptPicUrlStatus;
        // state.pictureMedia.picUrl = state.pictureMedia.validatedPicUrl;
        return;
      }
      state.pictureMedia.picUrlStatus = { ...defaultStatus };
      state.pictureMedia.picUrl = action.payload;
    },
    clearPicsMedia: (state = initialState, action) => {
      return {
        ...state,
        pictureMedia: initialState.pictureMedia,
      };
    },
    resetToInitialState: (state) => {
      Object.keys(state).forEach((key) => {
        state[key] = initialState[key];
      });
    },
    addOptionById: (state, action) => {
      const { id, option } = action.payload;
      const index = state.optionsValue.findIndex((option) => option.id === id);

      if (option === '') {
        state.optionsValue[index].picUrl = option;
        state.optionsValue[index].picUrlStatus = { ...defaultStatus };
        return;
      }

      if (index !== -1) {
        state.optionsValue[index].picUrl = option;
        if (option === state.optionsValue[index].validatedPicUrl) {
          state.optionsValue[index].picUrlStatus = state.optionsValue[index].chatgptPicUrlStatus;
          return;
        }
        state.optionsValue[index].picUrlStatus = { ...defaultStatus };
      } else {
        console.error(`Option with the provided id ${id} not found.`);
      }
    },
    addNewOption: (state, action) => {
      const newOption = {
        id: `index-${state.optionsValue.length}`,
        picUrl: '',
        validatedPicUrl: '',
        picUrlStatus: { ...defaultStatus },
        chatgptPicUrlStatus: { ...defaultStatus },
      };

      state.optionsValue.push(newOption);
    },
    delOption: (state, action) => {
      const idToRemove = action.payload.id;

      const indexToRemove = state.optionsValue.findIndex((value) => value.id === idToRemove);

      if (indexToRemove !== -1) {
        const tempOptions = state.optionsValue.filter((value) => value.id !== idToRemove);

        if (tempOptions.length === 0) {
          state.optionsValue = [
            {
              id: `index-0`,
              picUrl: '',
              validatedPicUrl: '',
              picUrlStatus: { ...defaultStatus },
              chatgptPicUrlStatus: { ...defaultStatus },
            },
          ];
        } else {
          const updatedTypedValues = tempOptions.map((item, index) => {
            return {
              ...item,
              id: `index-${index}`,
            };
          });

          state.optionsValue = updatedTypedValues;
        }
      } else {
        console.error(`Option with id ${idToRemove} not found.`);
      }
    },
    resetCreateQuest: (state) => {
      Object.assign(state, initialState);
    },
    // Questions
    addQuestion: (state, action) => {
      if (action.payload === state.questions.validatedQuestion) {
        state.questionReset = state.chatgptStatus;
        state.questions.question = state.questions.validatedQuestion;
        state.questions.questionTyping = false;
        return;
      }
      state.questions.questionTyping = true;
      state.questions.question = action.payload;
      state.questionReset = { ...defaultStatus };
    },
    updateQuestion: (state, action) => {
      const { question, changedOption, changeState } = action.payload;
      return {
        ...state,
        questions: { ...state.questions, question, changedOption, changeState },
      };
    },
    // Options
    updateMultipleChoice: (state, action) => {
      const { question, changedOption, changeState, multipleOption, addOption, optionsCount, options } = action.payload;
      return {
        ...state,
        questions: {
          ...state.questions,
          question,
          changedOption,
          changeState,
          multipleOption,
          addOption,
          optionsCount,
          options,
        },
      };
    },
    updateRankedChoice: (state, action) => {
      const { question, changedOption, changeState, addOption, optionsCount, options } = action.payload;
      return {
        ...state,
        questions: { ...state.questions, question, changedOption, changeState, addOption, optionsCount, options },
      };
    },
    drapAddDrop: (state, action) => {
      state.optionsValue = action.payload.newTypedValues;
    },
    handleChangeOption: (state, action) => {
      state.optionsValue = action.payload.newTypedValues;
    },
    handleQuestionReset: (state, action) => {
      return {
        ...state,
        questions: action.payload,
        questionReset: initialState.questionReset,
      };
    },
    hideToolTipMessage: (state, action) => {
      const { id, type } = action.payload;

      if (!type) {
        if (id) {
          const parts = id.split('-');
          const index = parseInt(parts[1]);

          state.optionsValue[index - 3].optionStatus.showToolTipMsg = false;
        } else {
          state.questionReset.showToolTipMsg = false;
        }
      } else if (type === 'media') {
        state.media.mediaDescStatus.showToolTipMsg = false;
      } else if (type === 'mediaURL') {
        state.media.urlStatus.showToolTipMsg = false;
      }
    },
    clearUrl: (state, action) => {
      state.media.url = '';
      state.media.validatedUrl = '';
      state.media.urlStatus = { ...defaultStatus };
      state.media.chatgptUrlStatus = { ...defaultStatus };
    },
    clearMedia: (state = initialState, action) => {
      return {
        ...state,
        media: initialState.media,
      };
    },
    clearPicsUrl: (state, action) => {
      state.pictureMedia.picUrl = '';
      state.pictureMedia.validatedPicUrl = '';
      state.pictureMedia.picUrlStatus = { ...defaultStatus };
      state.pictureMedia.chatgptPicUrlStatus = { ...defaultStatus };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkPictureUrl.pending, (state, action) => {
      const { id, value } = action.meta.arg;
      const updatedOptions = state.optionsValue.map((option) =>
        option.id === id
          ? {
              ...option,
              picUrl: value,
              validatedPicUrl: '',
              picUrlStatus: getCheckingStatus(),
              chatgptPicUrlStatus: getCheckingStatus(),
            }
          : option,
      );
      state.optionsValue = updatedOptions;
    });
    builder.addCase(checkPictureUrl.fulfilled, (state, action) => {
      const { id, result, index } = action.payload;
      const validatedAnswer = result.url;

      if (result.errorMessage === 'DUPLICATION') {
        const updatedOptions = state.optionsValue.map((option) => ({
          ...option,
          validatedPicUrl: '',
          picUrlStatus: getDuplicateStatus(),
          chatgptPicUrlStatus: getDuplicateStatus(),
        }));
        state.optionsValue = updatedOptions;
      } else {
        if (validatedAnswer) {
          // const duplicate = checkAnswerExistCreateQuest({
          //   answersArray: JSON.parse(JSON.stringify(state.optionsValue)),
          //   answer: validatedAnswer,
          //   index,
          // });

          // const optionStatus = duplicate ? getDuplicateStatus() : getVerifiedStatus();

          const updatedOptions = state.optionsValue.map((option) =>
            option.validatedPicUrl === validatedAnswer
              ? {
                  ...option,
                  validatedPicUrl: '',
                  picUrlStatus: getDuplicateStatus(),
                  chatgptPicUrlStatus: getDuplicateStatus(),
                }
              : option.id === id
                ? {
                    ...option,
                    picUrl: validatedAnswer,
                    validatedPicUrl: validatedAnswer,
                    picUrlStatus: getVerifiedStatus(),
                    chatgptPicUrlStatus: getVerifiedStatus(),
                    // duplication: duplicate,
                  }
                : option,
          );
          state.optionsValue = updatedOptions;
        } else {
          const updatedOptions = state.optionsValue.map((option) =>
            option.id === id
              ? {
                  ...option,
                  validatedPicUrl: '',
                  picUrlStatus: getRejectedStatus(),
                  chatgptPicUrlStatus: getRejectedStatus(),
                }
              : option,
          );
          state.optionsValue = updatedOptions;
        }
      }
    });
  },
});

const getCheckingStatus = () => ({
  name: 'Checking',
  color: 'text-[#0FB063]',
  tooltipName: 'Verifying your answer. Please wait...',
  tooltipStyle: 'tooltip-success',
});

const getVerifiedStatus = () => ({
  name: 'Ok',
  color: 'text-[#0FB063]',
  tooltipName: 'Answer is Verified',
  tooltipStyle: 'tooltip-success',
});

const getDuplicateStatus = () => ({
  name: 'Duplicate',
  color: 'text-[#EFD700]',
  tooltipName: 'Found Duplication!',
  tooltipStyle: 'tooltip-error',
  duplication: true,
  showToolTipMsg: true,
});

const getRejectedStatus = () => ({
  name: 'Rejected',
  color: 'text-[#b00f0f]',
  tooltipName: 'Invalid Url!',
  tooltipStyle: 'tooltip-error',
  showToolTipMsg: true,
});

export const {
  updateIsMedia,
  updateIsAudio,
  updateIsPicMedia,
  addMediaDesc,
  addAudioDesc,
  addPicsMediaDesc,
  addMediaUrl,
  addAudioUrl,
  addPicUrl,
  addQuestion,
  updateQuestion,
  updateMultipleChoice,
  updateRankedChoice,
  addOptionById,
  resetCreateQuest,
  hideToolTipMessage,
  handleQuestionReset,
  addNewOption,
  delOption,
  drapAddDrop,
  handleChangeOption,
  clearUrl,
  clearMedia,
  clearPicsUrl,
  clearPicsMedia,
  resetToInitialState,
} = pictureMediaSlice.actions;

export default pictureMediaSlice.reducer;

export const getPicsMedia = (state) => state.pictureMedia.pictureMedia;
export const pictureUrlValues = (state) => state.pictureMedia.optionsValue;
// export const validatedPicUrls = (state) => state.pictureMedia.optionsValue.map((item) => item.validatedPicUrl);
// export const validatedPicUrls = (state) => {
//   return state.pictureMedia.optionsValue
//     .filter((item) => item.validatedPicUrl.trim() !== '') // Filter out empty strings
//     .map((item) => item.validatedPicUrl);
// };
const getPictureMediaOptions = (state) => state.pictureMedia.optionsValue;
export const validatedPicUrls = createSelector([getPictureMediaOptions], (optionsValue) => {
  return optionsValue
    .filter((item) => item.validatedPicUrl.trim() !== '') // Filter out empty strings
    .map((item) => item.validatedPicUrl);
});
