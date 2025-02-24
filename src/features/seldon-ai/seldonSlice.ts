import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SeldonState {
  system: string;
  question: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  fetchK: number;
  lambda: number;
  knowledgebase: string[];
  debug: boolean;
  finding: number;
  suggestion: number;
  isTitle: boolean;
}

const initialState: SeldonState = {
  system:
    'Only use Foundation post data. Find strong correlations across post data. Make ground breaking conclusions and discoveries from post data. Find and solve problems based on post data. NEVER cite vote counts, respondents, selections, or individuals. Always respond with a title, abstract, SEO summary, and as many ground breaking findings as you can, a discussion and a conclusion. At the end, give as many new poll and survey suggestions, only multiple choice, open-ended and yes/no, with options separated by slashes in one parentheses that you can that do not already exist in foundation data.',
  question: '',
  temperature: 0,
  max_tokens: 2048,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  fetchK: 5,
  lambda: 0.5,
  knowledgebase: ['user', 'about', 'knowladgebaseone'],
  debug: false,
  finding: 1,
  suggestion: 1,
  isTitle: false,
};

export const seldonSlice = createSlice({
  name: 'seldon',
  initialState,
  reducers: {
    handleSeldonInput: (
      state,
      action: PayloadAction<{ name: keyof SeldonState; value: string | number | boolean | string[] }>,
    ) => {
      const { name, value } = action.payload;
      (state[name] as string | number | boolean | string[]) = value;
    },
    handleKnowledgebase: (state, action: PayloadAction<string>) => {
      const itemIndex = state.knowledgebase.indexOf(action.payload);

      if (itemIndex === -1) {
        // Item not found, add it
        state.knowledgebase.push(action.payload);
      } else {
        // Item found, remove it only if there's more than 1 item selected
        if (state.knowledgebase.length > 1) {
          state.knowledgebase.splice(itemIndex, 1);
        }
      }
    },
    handleDebubMode: (state) => {
      state.debug = !state.debug;
    },
    resetSeldonState: (state) => {
      return {
        ...initialState,
        question: state.question,
        isTitle: state.isTitle,
      };
    },
    setInputState: (state, action: PayloadAction<Partial<SeldonState>>) => {
      const { isTitle, ...otherPayload } = action.payload;
      return {
        ...state,
        ...otherPayload,
      };
    },
    resetSeldonProperty: (state, action: PayloadAction<keyof SeldonState>) => {
      const propertyToReset = action.payload;
      if (propertyToReset === 'knowledgebase') {
        state[propertyToReset] = [];
      } else {
        (state[propertyToReset] as string | number | boolean) = initialState[propertyToReset]; // Reset the specific property to its initial value
      }
    },
  },
});

export const {
  handleSeldonInput,
  setInputState,
  handleKnowledgebase,
  resetSeldonState,
  resetSeldonProperty,
  handleDebubMode,
} = seldonSlice.actions;

export default seldonSlice.reducer;

export const getSeldonState = (state: any) => state.seldon;
