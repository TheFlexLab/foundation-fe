import { calculateRemainingTime } from '../../utils';

export function getQuestionTitle(whichTypeQuestion) {
  switch (whichTypeQuestion) {
    case 'agree/disagree':
      return 'Agree/Disagree';
    case 'like/dislike':
      return 'Like/Dislike';
    case 'multiple choise':
      return 'Multiple Choice';
    case 'ranked choise':
      return 'Ranked Choice';
    case 'yes/no':
      return 'Yes/No';
    case 'open choice':
      return 'Open Choice'
    default:
      return null;
  }
}

export const getButtonColor = (startStatus) => {
  switch (startStatus) {
    case 'completed':
      return 'bg-[#4ABD71]';
    case 'change answer':
      return 'bg-[#FDD503]';
    default:
      return 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]';
  }
};

export function getButtonText(btnText) {
  switch (btnText) {
    case 'completed':
      return 'Completed';
    case 'change answer':
      return 'Change';
    default:
      return 'Start';
  }
}

export function getButtonVariants(btnText) {
  switch (btnText) {
    case 'completed':
      return 'result';
    case 'change answer':
      return 'change';
    default:
      return 'submit';
  }
}

export function getButtonClassName(persistedTheme, btnText, btnColor) {
  if (persistedTheme === 'dark') {
    switch (btnText) {
      case 'completed':
        return 'bg-[#148339]';
      case 'change answer':
        if (calculateRemainingTime() === ', you are good to go!') {
          return 'dark:bg-[#BB9D02] text-white';
        } else {
          return 'bg-[#7E6C01] text-[#CCCCCC]';
        }
      default:
        return 'inset-0 rounded-[15px] border-[1px] border-[#333B46] bg-[#333B46] shadow-inner';
    }
  } else {
    if (calculateRemainingTime() === ', you are good to go!') {
      return btnColor;
    } else {
      return 'bg-[#7E6C01] text-[#CCCCCC]';
    }
  }
}
