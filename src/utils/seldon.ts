import { Suggestions } from '../types/seldon';

export function transformPromptSuggestions(suggestions: Suggestions[]) {
  return suggestions.map((suggestion) => {
    const { statement, options, _id } = suggestion;

    const userCanAddOption = options.some((option) => ['Other', 'others', 'Other', 'Others'].includes(option));

    const filteredOptions = options.filter((option) => !['Other', 'others', 'Other', 'Others'].includes(option));

    const postType =
      filteredOptions.length === 2 && filteredOptions.includes('Yes') && filteredOptions.includes('No')
        ? 'yes/no'
        : 'multipleChoice';

    return {
      id: _id,
      question: statement,
      options: filteredOptions,
      postType: postType,
      userCanAddOption: userCanAddOption,
    };
  });
}
