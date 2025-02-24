import { Button } from '../ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { setOptionState } from '../../features/quest/seeMoreOptionsSlice';
import { getConstantsValues } from '../../features/constants/constantsSlice';
import { getQuestionTitle } from '../../utils/questionCard/SingleQuestCard';
import { resetaddOptionLimit, updateaddOptionLimit } from '../../features/quest/utilsSlice';
import { resetQuests } from '../../features/quest/questsSlice';
import { setGuestSignUpDialogue } from '../../features/extras/extrasSlice';

export default function AddOptions({
  questStartData,
  addOptionField,
  handleOpen,
  setHowManyTimesAnsChanged,
  handleToggleCheck,
  setAnswerSelection,
  setAddOptionField,
  setRankedAnswers,
  handleStartTest,
  handleViewResults,
  answersSelection,
}) {
  const dispatch = useDispatch();
  const persistedContants = useSelector(getConstantsValues);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const plusImg = `${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/plus.svg' : 'assets/svgs/dashboard/add.svg'}`;

  const uuidExists = questStartData.QuestAnswers
    ? questStartData.QuestAnswers?.some(
      (item) => item.uuid === persistedUserInfo?.uuid || item.uuid === localStorage.getItem('uId')
    )
    : false;

  const showGuestSignUpToastWarning = () => {
    dispatch(setGuestSignUpDialogue(true));
  };

  function updateAnswerSelection(apiResponse, answerSelectionArray, type) {
    const data = apiResponse?.startQuestData.data[apiResponse?.startQuestData.data.length - 1];

    answerSelectionArray.forEach((item, index) => {
      if (data?.selected?.some((selectedItem) => selectedItem.question === item.label)) {
        answerSelectionArray[index].check = true;
      } else {
        answerSelectionArray[index].check = false;
      }

      if (data?.contended?.some((contendedItem) => contendedItem.question === item.label)) {
        answerSelectionArray[index].contend = true;
      } else {
        answerSelectionArray[index].contend = false;
      }
    });

    const newOption = {
      label: '',
      check: false,
      contend: false,
      addedOptionByUser: true,
      edit: true,
      delete: true,
      uuid: persistedUserInfo.uuid,
    };

    if (type === 'addOption') {
      setAnswerSelection([...answerSelectionArray, newOption]);

      setAddOptionField(1);
      dispatch(updateaddOptionLimit());
    } else {
      setAnswerSelection(answerSelectionArray);
    }
  }

  function updateRankSelection(apiResponse, answerSelectionArray, type) {
    const data = apiResponse?.startQuestData.data[apiResponse?.startQuestData.data.length - 1];

    answerSelectionArray.forEach((item, index) => {
      if (data.contended && data.contended?.some((contendedItem) => contendedItem.question === item.label)) {
        answerSelectionArray[index].contend = true;
      }
    });

    const sortedAnswers = answerSelectionArray.sort((a, b) => {
      if (a.label === '') return 1;
      if (b.label === '') return -1;

      const indexA = data.selected.findIndex((item) => item.question === a.label);
      const indexB = data.selected.findIndex((item) => item.question === b.label);

      return indexA - indexB;
    });

    const newOption = {
      label: '',
      check: false,
      contend: false,
      addedOptionByUser: true,
      edit: true,
      delete: true,
      uuid: persistedUserInfo.uuid,
    };

    if (type === 'addOption') {
      setAnswerSelection([...sortedAnswers, newOption]);
      setRankedAnswers([...sortedAnswers, newOption]);
      setAddOptionField(1);
      dispatch(updateaddOptionLimit());
    } else {
      setAnswerSelection(sortedAnswers);
      setRankedAnswers(sortedAnswers);
    }
  }

  const handleStartChange = (type) => {
    dispatch(resetaddOptionLimit());
    if (questStartData.startStatus === '') {
      dispatch(resetQuests());
      handleStartTest(questStartData._id);
    }
    if (questStartData.startStatus === 'change answer') {
      setHowManyTimesAnsChanged(questStartData?.startQuestData.data.length);
      const data = questStartData?.startQuestData.data[questStartData?.startQuestData.data.length - 1];

      if (
        questStartData.whichTypeQuestion === 'agree/disagree' ||
        questStartData.whichTypeQuestion === 'yes/no' ||
        questStartData.whichTypeQuestion === 'like/dislike'
      ) {
        if (data.selected === 'Agree' || data.selected === 'Yes' || data.selected === 'Like') {
          handleToggleCheck(data.selected, true, false);
        }
        if (data.contended === 'Agree' || data.contended === 'Yes' || data.contended === 'Like') {
          handleToggleCheck(data.contended, false, true);
        }
        if (data.contended === 'Disagree' || data.contended === 'No' || data.contended === 'Dislike') {
          handleToggleCheck(data.contended, false, true);
        }
        if (data.selected === 'Disagree' || data.selected === 'No' || data.selected === 'Dislike') {
          handleToggleCheck(data.selected, true, false);
        }
      }
      if (
        questStartData.whichTypeQuestion === 'multiple choise' ||
        questStartData.whichTypeQuestion === 'open choice'
      ) {
        updateAnswerSelection(questStartData, answersSelection, type);
      }
      if (questStartData.whichTypeQuestion === 'ranked choise') {
        updateRankSelection(questStartData, answersSelection, type);
      }
      handleStartTest(questStartData._id);
    }
    if (questStartData.startStatus === 'completed') {
      handleViewResults(questStartData._id);
    }
  };

  const handleAddOption = () => {
    dispatch(setOptionState({ id: questStartData._id, isShow: true }));

    if (persistedUserInfo?.role === 'guest' || persistedUserInfo?.role === 'visitor') {
      showGuestSignUpToastWarning();
      return;
    }

    if (questStartData.startStatus === 'change answer') {
      handleStartChange('addOption');
    } else {
      handleOpen();
    }
  };

  return (
    <>
      {questStartData.usersAddTheirAns &&
        addOptionField === 0 &&
        !uuidExists &&
        questStartData.startStatus !== 'completed' &&
        location.pathname !== '/shared-links/result' &&
        location.pathname !== '/shared-collection-link/result' &&
        location.pathname !== '/post/isfullscreen' ? (
        <div className="pl-7 pt-[5.7px] tablet:pl-[66px] tablet:pt-[9px]">
          {getQuestionTitle(questStartData.whichTypeQuestion) === 'Yes/No' ||
            getQuestionTitle(questStartData.whichTypeQuestion) === 'Agree/Disagree' ||
            getQuestionTitle(questStartData.whichTypeQuestion) === 'Like/Dislike' ? null : (
            <Button
              variant={'addOption'}
              onClick={() => {
                handleAddOption(questStartData.startStatus);
              }}
            >
              <img src={plusImg} alt="add" className="size-[7.398px] tablet:size-[15.6px]" />
              Add Option
              <span className="text-[7px] font-semibold leading-[1px] tablet:text-[13px]">
                (+{persistedContants?.QUEST_OPTION_ADDED_AMOUNT} FDX)
              </span>
            </Button>
          )}
        </div>
      ) : null}
    </>
  );
}
