import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { validateInterval } from '../../../../../utils';
import { questSelectionInitial } from '../../../../../constants/quests';
import { resetQuests } from '../../../../../features/quest/questsSlice';
import Result from './Result';
import StartTest from './StartTest';
import ButtonGroup from '../../../../../components/question-card/ButtonGroup';
import QuestInfoText from '../../../../../components/question-card/QuestInfoText';
import Spacing from '../../../../../components/question-card/Spacing.jsx';
import QuestCardLayout from '../../../../../components/question-card/QuestCardLayout';
import * as questUtilsActions from '../../../../../features/quest/utilsSlice';
import showToast from '../../../../../components/ui/Toast';
import AddOptions from '../../../../../components/question-card/AddOptions';
import { setGuestSignUpDialogue } from '../../../../../features/extras/extrasSlice';
import { tooltipDefaultStatus } from '../../../../../utils/extras';
import {
  useChangeGuestListPost,
  useChangePost,
  useStartGuestListPost,
  useStartPost,
} from '../../../../../services/mutations/post';
import { sortAnswers } from '../../../../../utils/utils';

const QuestionCardWithToggle = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const getQuestUtilsState = useSelector(questUtilsActions.getQuestUtils);
  const queryParams = new URLSearchParams(window.location.search);
  const preSelectOption = queryParams.get('option');
  const [uniqueLink, setUniqueLink] = useState(null);

  const { innerRef, questStartData, postProperties, SharedLinkButton } = props;
  const { isSingleQuest, postLink, categoryId, isEmbedResults, profilePicture } = props;

  let questData;

  if (location.pathname.startsWith('/p/')) {
    questData = 0;
  } else {
    questData = questStartData?.QuestAnswers?.some((answer) => {
      return answer.uuid && answer.uuid === persistedUserInfo?.uuid;
    })
      ? 1
      : 0;
  }

  const [howManyTimesAnsChanged, setHowManyTimesAnsChanged] = useState(0);
  const [addOptionField, setAddOptionField] = useState(questData);
  const [openResults, setOpenResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startTest, setStartTest] = useState('');
  const [viewResult, setViewResult] = useState('');
  const [questSelection, setQuestSelection] = useState(questSelectionInitial);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [checkOptionStatus, setCheckOptionStatus] = useState(tooltipDefaultStatus);
  const [selectedOption, setSelectedOption] = useState(1);
  const [contendedOption, setContendedOption] = useState(1);
  const [sortedAnswers, setSortedAnswers] = useState(() => {
    if (persistedUserInfo?.userSettings?.defaultSort) {
      return sortAnswers(questStartData, 'desc', true);
    }
    return questStartData;
  });

  // ==========================SORT FUNCTION STARTS =============================

  useEffect(() => {
    if (questStartData?.QuestAnswers) {
      setSortedAnswers(questStartData?.QuestAnswers);
    }
  }, [questStartData?.QuestAnswers]);

  const handleSortIconClick = (isSelection) => {
    const setOption = isSelection ? setSelectedOption : setContendedOption;
    setOption((prevOption) => {
      const nextOption = prevOption === 3 ? 1 : prevOption + 1;

      const order = nextOption === 1 ? 'normal' : nextOption === 2 ? 'desc' : 'asc';
      const sortedData = sortAnswers(questStartData, order, isSelection);
      setSortedAnswers(sortedData);
      return nextOption;
    });
  };

  useEffect(() => {
    if (persistedUserInfo?.userSettings?.defaultSort) {
      const sortedData = sortAnswers(questStartData, 'desc', true);
      setSortedAnswers(sortedData);
      setSelectedOption(2);
    }
  }, [persistedUserInfo?.userSettings?.defaultSort, questStartData]);

  useEffect(() => {
    if (!isEmbedResults && postProperties === 'Embed') {
      const sortedData = sortAnswers(questStartData, 'desc', true);
      setSortedAnswers(sortedData);
    }
  }, [isEmbedResults, postProperties]);

  // ==========================SORT FUNCTION ENDED ==============================

  const handleQuestSelection = (actionPayload) => {
    setQuestSelection((prevState) => {
      const newState = { ...prevState, id: actionPayload.id };

      if (actionPayload.label === 'yes/no') {
        newState['yes/no'] = {
          ...prevState['yes/no'],
          yes: { check: actionPayload.option === 'Yes' ? true : false },
          no: { check: actionPayload.option === 'No' ? true : false },
        };
      }

      if (actionPayload.label === 'agree/disagree') {
        newState['agree/disagree'] = {
          ...prevState['agree/disagree'],
          agree: { check: actionPayload.option === 'Agree' ? true : false },
          disagree: {
            check: actionPayload.option === 'Disagree' ? true : false,
          },
        };
      }

      if (actionPayload.label === 'like/dislike') {
        newState['like/dislike'] = {
          ...prevState['like/dislike'],
          like: { check: actionPayload.option === 'Like' ? true : false },
          dislike: {
            check: actionPayload.option === 'Dislike' ? true : false,
          },
        };
      }

      return newState;
    });
  };

  const [answersSelection, setAnswerSelection] = useState([]);
  const [rankedAnswers, setRankedAnswers] = useState([]);

  useEffect(() => {
    setAnswerSelection((prevSelections) => {
      const initialSelections =
        prevSelections.length === 0
          ? questStartData.QuestAnswers.map((answer) => ({
              label: answer.question,
              check: false,
              contend: false,
              uuid: answer.uuid,
            }))
          : prevSelections;

      if (preSelectOption !== undefined) {
        return initialSelections.map((answer, index) =>
          index === preSelectOption - 1 ? { ...answer, check: true } : answer
        );
      }

      return initialSelections;
    });

    if (questData === 0) {
      setAddOptionField(0);
    }
  }, [questStartData, preSelectOption]);

  const cardSize = useMemo(() => {
    const limit = windowWidth >= 600 ? true : false;
    if (
      questStartData.whichTypeQuestion === 'agree/disagree' ||
      questStartData.whichTypeQuestion === 'like/dislike' ||
      questStartData.whichTypeQuestion === 'yes/no'
    ) {
      return limit ? 108 : 49.3;
    } else {
      let tempSize = 0;
      const maxElements = 10;

      questStartData.QuestAnswers.forEach((item, index) => {
        tempSize += index === 0 ? (limit ? 49 : 24) : limit ? 59 : 29.7;
      });

      if (questStartData.QuestAnswers.length > maxElements) {
        tempSize = (limit ? 49 : 24) + (maxElements - 1) * (limit ? 59 : 29.7);
      }

      return limit ? tempSize : tempSize - 5.7;
    }
  }, [questStartData.QuestAnswers, windowWidth]);

  useEffect(() => {
    const path = window.location.pathname;
    setUniqueLink(path.split('/')[2]);
    if (
      questStartData.url?.length > 0 &&
      !questStartData.url[0]?.includes('flickr') &&
      !questStartData.url[0]?.includes('giphy') &&
      questStartData.url[0] !== ''
    ) {
      dispatch(questUtilsActions.addPlayerId(questStartData._id));
    }

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setRankedAnswers(
      answersSelection?.map((item, index) => ({
        id: `unique-${index}`,
        ...item,
      }))
    );
  }, [answersSelection]);

  const handleStartTest = (testId) => {
    setViewResult('');
    setStartTest(testId);
  };

  const handleViewResults = (testId) => {
    setStartTest('');
    setViewResult(testId);
  };

  const handleAddOption = () => {
    const newOption = {
      label: '',
      check: false,
      contend: false,
      addedOptionByUser: true,
      edit: true,
      delete: true,
      uuid: persistedUserInfo.uuid,
    };

    setAnswerSelection([...answersSelection, newOption]);

    setAddOptionField(1);
    dispatch(questUtilsActions.updateaddOptionLimit());
  };

  const handleToggleCheck = (label, option, check, id) => {
    const actionPayload = {
      label,
      option,
      check,
      id,
    };

    handleQuestSelection(actionPayload);
  };

  useEffect(() => {
    if (questStartData.whichTypeQuestion === 'yes/no') {
      handleToggleCheck(
        questStartData.whichTypeQuestion,
        questStartData?.startQuestData
          ? questStartData?.startQuestData?.data[questStartData?.startQuestData?.data?.length - 1]?.selected === 'Yes'
            ? 'Yes'
            : questStartData?.startQuestData?.data[questStartData?.startQuestData?.data?.length - 1]?.selected === 'No'
              ? 'No'
              : ''
          : null,
        questStartData?.startQuestData
          ? questStartData?.startQuestData?.data[questStartData?.startQuestData?.data?.length - 1]?.selected === 'Yes'
            ? true
            : false
          : null,
        questStartData._id
      );
    }
    if (questStartData.whichTypeQuestion === 'agree/disagree') {
      handleToggleCheck(
        questStartData.whichTypeQuestion,
        questStartData?.startQuestData
          ? questStartData?.startQuestData?.data[questStartData?.startQuestData?.data?.length - 1]?.selected === 'Agree'
            ? 'Agree'
            : questStartData?.startQuestData?.data[questStartData?.startQuestData?.data?.length - 1]?.selected ===
                'Disagree'
              ? 'Disagree'
              : ''
          : null,
        questStartData?.startQuestData
          ? questStartData?.startQuestData?.data[questStartData?.startQuestData?.data?.length - 1]?.selected === 'Agree'
            ? true
            : true
          : null,
        questStartData._id
      );
    }
    if (questStartData.whichTypeQuestion === 'like/dislike') {
      handleToggleCheck(
        questStartData.whichTypeQuestion,

        questStartData?.startQuestData
          ? questStartData?.startQuestData?.data[questStartData?.startQuestData?.data?.length - 1]?.selected === 'Like'
            ? 'Like'
            : questStartData?.startQuestData?.data[questStartData?.startQuestData?.data?.length - 1]?.selected ===
                'Dislike'
              ? 'Dislike'
              : ''
          : null,

        questStartData?.startQuestData
          ? questStartData?.startQuestData?.data[questStartData?.startQuestData?.data?.length - 1]?.selected === 'Like'
            ? true
            : false
          : null,
        questStartData._id
      );
    }
  }, [questStartData]);

  const { startGuestListPost } = useStartGuestListPost(setLoading);
  const { changeGuestListPost } = useChangeGuestListPost(setLoading);
  const { startPost } = useStartPost(setLoading, props.setSubmitResponse, handleViewResults, questStartData);
  const { changePost } = useChangePost(setLoading, props.setSubmitResponse, handleViewResults, questStartData);

  const handleSubmit = () => {
    if (persistedUserInfo?.role === 'visitor') {
      dispatch(setGuestSignUpDialogue(true));
      return;
    }
    if (
      persistedUserInfo.role === 'guest' &&
      !location.pathname.startsWith('/p') &&
      !location.pathname.startsWith('/l') &&
      !location.pathname.startsWith('/r') &&
      !location.pathname.startsWith('/h')
    ) {
      dispatch(setGuestSignUpDialogue(true));
      return;
    }

    setLoading(true);
    if (
      questStartData.whichTypeQuestion === 'agree/disagree' ||
      questStartData.whichTypeQuestion === 'yes/no' ||
      questStartData.whichTypeQuestion === 'like/dislike'
    ) {
      let ans = {
        created: new Date(),
      };
      if (questStartData.whichTypeQuestion === 'yes/no') {
        ans.selected =
          questSelection['yes/no'].yes.check === true
            ? 'Yes'
            : (ans.selected = questSelection['yes/no'].no.check === true ? 'No' : '');
      }

      if (questStartData.whichTypeQuestion === 'agree/disagree') {
        ans.selected =
          questSelection['agree/disagree'].agree.check === true
            ? 'Agree'
            : (ans.selected = questSelection['agree/disagree'].disagree.check === true ? 'Disagree' : '');
      }

      if (questStartData.whichTypeQuestion === 'like/dislike') {
        ans.selected =
          questSelection['like/dislike'].like.check === true
            ? 'Like'
            : (ans.selected = questSelection['like/dislike'].dislike.check === true ? 'Dislike' : '');
      }

      const params = {
        questId: questStartData._id,
        answer: ans,
        addedAnswer: '',
        uuid: persistedUserInfo?.uuid || localStorage.getItem('uuid'),
        ...(isSingleQuest && { isSharedLinkAns: true, postLink }),
        ...(location.pathname !== '/' && { page: location.pathname }),
      };

      if (props.articleId) {
        params.articleRef = props.articleId;
      }

      if (!params.answer.selected) {
        showToast('warning', 'emptySelection');
        setLoading(false);
        return;
      }

      if (questStartData.startStatus === 'change answer') {
        const currentDate = new Date();

        const timeInterval = validateInterval(questStartData.usersChangeTheirAns);
        if (howManyTimesAnsChanged > 1 && currentDate - new Date(questStartData.lastInteractedAt) < timeInterval) {
          toast.error(`You can change your selection again in ${questStartData.usersChangeTheirAns}`);
          setLoading(false);
        } else {
          if (location.pathname.startsWith('/l/')) {
            changeGuestListPost({ params, categoryId, categoryLink: location.pathname.split('/')[2] });
          } else {
            changePost(params);
          }
        }
      } else {
        if (location.pathname.startsWith('/l/')) {
          startGuestListPost({ params, categoryId, categoryLink: location.pathname.split('/')[2] });
        } else {
          startPost(params);
        }
      }
    } else if (
      questStartData.whichTypeQuestion === 'multiple choise' ||
      questStartData.whichTypeQuestion === 'open choice'
    ) {
      let answerSelected = [];
      let answerContended = [];
      let addedAnswerValue = '';
      let addedAnswerUuidValue = '';
      let isAddedAnsSelected = '';

      for (let i = 0; i < answersSelection.length; i++) {
        if (answersSelection[i].check) {
          if (answersSelection[i].addedOptionByUser && getQuestUtilsState.addOptionLimit === 1) {
            answerSelected.push({
              question: answersSelection[i].label,
              addedAnswerByUser: true,
              uuid: answersSelection[i].uuid,
            });
            addedAnswerValue = answersSelection[i].label;
            addedAnswerUuidValue = answersSelection[i].uuid;
            isAddedAnsSelected = true;
          } else {
            answerSelected.push({ question: answersSelection[i].label });
          }
        } else if (
          answersSelection[i].check === false &&
          answersSelection[i].addedOptionByUser === true &&
          getQuestUtilsState.addOptionLimit === 1
        ) {
          answerSelected.push({
            question: answersSelection[i].label,
            addedAnswerByUser: true,
            uuid: answersSelection[i].uuid,
          });
          addedAnswerValue = answersSelection[i].label;
          addedAnswerUuidValue = answersSelection[i].uuid;
          isAddedAnsSelected = false;
        }

        if (answersSelection[i].contend) {
          answerContended.push({ question: answersSelection[i].label });
        }
      }

      let dataToSend = {
        selected: answerSelected,
        contended: answerContended,
        created: new Date(),
      };
      const currentDate = new Date();

      if (questStartData.startStatus === 'change answer') {
        const timeInterval = validateInterval(questStartData.usersChangeTheirAns);
        if (howManyTimesAnsChanged > 1 && currentDate - new Date(questStartData.lastInteractedAt) < timeInterval) {
          toast.error(`You can change your selection again in ${questStartData.usersChangeTheirAns}`);
          setLoading(false);
        } else {
          const params = {
            questId: questStartData._id,
            answer: dataToSend,
            addedAnswer: addedAnswerValue,
            addedAnswerUuid: addedAnswerUuidValue,
            uuid: persistedUserInfo?.uuid || localStorage.getItem('uuid'),
            isAddedAnsSelected: isAddedAnsSelected,
            userQuestSettingRef: uniqueLink && uniqueLink.length === 8 ? uniqueLink : '',
            ...(location.pathname !== '/' && { page: location.pathname }),
          };
          if (props.articleId) {
            params.articleRef = props.articleId;
          }

          const isEmptyQuestion = params.answer.selected.some((item) => item.question.trim() === '');

          if (isEmptyQuestion) {
            showToast('warning', 'optionBlank');
            setLoading(false);
            return;
          }

          let length;
          if (isAddedAnsSelected === true || isAddedAnsSelected === '') {
            length = params.answer.selected.length;
          } else {
            length = params.answer.selected.length - 1;
          }

          if (length !== 0) {
            if (location.pathname.startsWith('/l/')) {
              changeGuestListPost({ params, categoryId, categoryLink: location.pathname.split('/')[2] });
            } else {
              changePost(params);
            }

            const updatedArray = answersSelection.map((item, index) => {
              if (index === answersSelection.length - 1) {
                return {
                  ...item,
                  edit: false,
                  delete: false,
                };
              }
              return item;
            });

            setAnswerSelection(updatedArray);
          } else {
            showToast('warning', 'emptySelection');
            setLoading(false);
          }
        }
      } else {
        const params = {
          questId: questStartData._id,
          answer: dataToSend,
          addedAnswer: addedAnswerValue,
          addedAnswerUuid: addedAnswerUuidValue,
          uuid: persistedUserInfo?.uuid || localStorage.getItem('uuid'),
          ...(isSingleQuest && { isSharedLinkAns: true, postLink }),
          isAddedAnsSelected: isAddedAnsSelected,
          userQuestSettingRef: uniqueLink && uniqueLink.length === 8 ? uniqueLink : '',
          ...(location.pathname !== '/' && { page: location.pathname }),
        };
        if (props.articleId) {
          params.articleRef = props.articleId;
        }

        const isEmptyQuestion = params.answer.selected.some((item) => item.question.trim() === '');

        if (isEmptyQuestion) {
          showToast('warning', 'optionBlank');
          setLoading(false);
          return;
        }

        let length;
        if (isAddedAnsSelected === true || isAddedAnsSelected === '') {
          length = params.answer.selected.length;
        } else {
          length = params.answer.selected.length - 1;
        }

        if (length !== 0) {
          if (location.pathname.startsWith('/l/')) {
            startGuestListPost({ params, categoryId, categoryLink: location.pathname.split('/')[2] });
          } else {
            startPost(params);
          } // Start Quest API CALL

          const updatedArray = answersSelection.map((item, index) => {
            if (index === answersSelection.length - 1) {
              return {
                ...item,
                edit: false,
                delete: false,
              };
            }
            return item;
          });

          setAnswerSelection(updatedArray);
        } else {
          showToast('warning', 'emptySelection');
          setLoading(false);
        }
      }
    } else if (questStartData.whichTypeQuestion === 'ranked choise') {
      let addedAnswerValue = '';
      let addedAnswerUuidValue = '';
      let answerSelected = [];
      let answerContended = [];
      let isAddedAnsSelected = '';

      for (let i = 0; i < rankedAnswers.length; i++) {
        if (rankedAnswers[i].addedOptionByUser && getQuestUtilsState.addOptionLimit === 1) {
          // If user Add his own option
          answerSelected.push({
            question: rankedAnswers[i].label,
            addedAnswerByUser: true,
            uuid: rankedAnswers[i].uuid,
          });
          addedAnswerValue = rankedAnswers[i].label;
          addedAnswerUuidValue = rankedAnswers[i].uuid;
          isAddedAnsSelected = true;
        } else {
          answerSelected.push({ question: rankedAnswers[i].label });
        }

        if (rankedAnswers[i].contend) {
          answerContended.push({ question: rankedAnswers[i].label });
        }
      }

      let dataToSend = {
        selected: answerSelected,
        contended: answerContended,
        created: new Date(),
      };
      const currentDate = new Date();

      if (questStartData.startStatus === 'change answer') {
        const timeInterval = validateInterval(questStartData.usersChangeTheirAns);
        // Check if enough time has passed
        if (howManyTimesAnsChanged > 1 && currentDate - new Date(questStartData.lastInteractedAt) < timeInterval) {
          // Alert the user if the time condition is not met
          toast.error(`You can change your selection again in ${questStartData.usersChangeTheirAns}`);
          setLoading(false);
        } else {
          const params = {
            questId: questStartData._id,
            answer: dataToSend,
            addedAnswer: addedAnswerValue,
            addedAnswerUuid: addedAnswerUuidValue,
            uuid: persistedUserInfo?.uuid || localStorage.getItem('uuid'),
            isAddedAnsSelected: isAddedAnsSelected,
            userQuestSettingRef: uniqueLink && uniqueLink.length === 8 ? uniqueLink : '',
            ...(location.pathname !== '/' && { page: location.pathname }),
          };
          if (props.articleId) {
            params.articleRef = props.articleId;
          }
          const isEmptyQuestion = params.answer.selected.some((item) => item.question.trim() === '');

          if (isEmptyQuestion) {
            showToast('warning', 'optionBlank');
            setLoading(false);
            return;
          }
          if (location.pathname.startsWith('/l/')) {
            changeGuestListPost({ params, categoryId, categoryLink: location.pathname.split('/')[2] });
          } else {
            changePost(params);
          }

          const updatedArray = rankedAnswers.map((item, index) => {
            if (item?.addedOptionByUser === true) {
              return {
                ...item,
                edit: false,
                delete: false,
              };
            }
            return item;
          });

          setRankedAnswers(updatedArray);
        }
      } else {
        const params = {
          questId: questStartData._id,
          answer: dataToSend,
          addedAnswer: addedAnswerValue,
          addedAnswerUuid: addedAnswerUuidValue,
          uuid: persistedUserInfo?.uuid || localStorage.getItem('uuid'),
          ...(isSingleQuest && { isSharedLinkAns: true, postLink }),
          isAddedAnsSelected: isAddedAnsSelected,
          userQuestSettingRef: uniqueLink && uniqueLink.length === 8 ? uniqueLink : '',
          ...(location.pathname !== '/' && { page: location.pathname }),
        };
        if (props.articleId) {
          params.articleRef = props.articleId;
        }

        const isEmptyQuestion = params.answer.selected.some((item) => item.question.trim() === '');

        if (isEmptyQuestion) {
          showToast('warning', 'optionBlank');
          setLoading(false);
          return;
        }
        if (location.pathname.startsWith('/l/')) {
          startGuestListPost({ params, categoryId, categoryLink: location.pathname.split('/')[2] });
        } else {
          startPost(params);
        }

        const updatedArray = rankedAnswers.map((item, index) => {
          if (item?.addedOptionByUser === true) {
            return {
              ...item,
              edit: false,
              delete: false,
            };
          }
          return item;
        });

        setRankedAnswers(updatedArray);
      }
    }
  };

  useEffect(() => {
    if (SharedLinkButton === 'shared-links-results-button') {
      setOpenResults(true);
      handleViewResults(questStartData._id);
    } else {
      if (questStartData.startStatus === '') {
        dispatch(resetQuests());
        setOpenResults(false);
        handleStartTest(questStartData._id);
      }
      if (questStartData.startStatus === 'change answer') {
        setOpenResults(false);
        handleViewResults(questStartData._id);
      }
      if (questStartData.startStatus === 'completed') {
        setOpenResults(true);
        handleViewResults(questStartData._id);
      }
    }
  }, [questStartData]);

  const renderQuestContent = () => {
    if (viewResult !== questStartData._id && openResults !== true) {
      return (
        <>
          <QuestInfoText questStartData={questStartData} show={true} />
          <StartTest
            questStartData={questStartData}
            handleToggleCheck={handleToggleCheck}
            answersSelection={answersSelection}
            setAnswerSelection={setAnswerSelection}
            rankedAnswers={rankedAnswers}
            setRankedAnswers={setRankedAnswers}
            setAddOptionField={setAddOptionField}
            questSelection={questSelection}
            cardSize={cardSize}
            checkOptionStatus={checkOptionStatus}
            setCheckOptionStatus={setCheckOptionStatus}
            postProperties={postProperties}
          />
          <AddOptions
            questStartData={questStartData}
            addOptionField={addOptionField}
            handleOpen={handleAddOption}
            setHowManyTimesAnsChanged={setHowManyTimesAnsChanged}
            handleToggleCheck={handleToggleCheck}
            setAnswerSelection={setAnswerSelection}
            setAddOptionField={setAddOptionField}
            setRankedAnswers={setRankedAnswers}
            handleStartTest={handleStartTest}
            handleViewResults={handleViewResults}
            answersSelection={answersSelection}
          />
          <Spacing questStartData={questStartData} show={true} postProperties={postProperties} />
        </>
      );
    } else {
      return (
        <>
          <QuestInfoText questStartData={questStartData} show={true} />
          <Result
            questStartData={questStartData}
            handleToggleCheck={handleToggleCheck}
            setHowManyTimesAnsChanged={setHowManyTimesAnsChanged}
            answersSelection={answersSelection}
            addOptionField={addOptionField}
            setAnswerSelection={setAnswerSelection}
            rankedAnswers={rankedAnswers}
            setRankedAnswers={setRankedAnswers}
            questSelection={questSelection}
            cardSize={cardSize}
            postProperties={postProperties}
            isEmbedResults={isEmbedResults}
            sortedAnswers={sortedAnswers}
            selectedOption={selectedOption}
            contendedOption={contendedOption}
            handleSortIconClick={handleSortIconClick}
            profilePicture={profilePicture}
          />
          <AddOptions
            questStartData={questStartData}
            addOptionField={addOptionField}
            handleOpen={handleAddOption}
            setHowManyTimesAnsChanged={setHowManyTimesAnsChanged}
            handleToggleCheck={handleToggleCheck}
            setAnswerSelection={setAnswerSelection}
            setAddOptionField={setAddOptionField}
            setRankedAnswers={setRankedAnswers}
            handleStartTest={handleStartTest}
            handleViewResults={handleViewResults}
            answersSelection={answersSelection}
          />
          <Spacing questStartData={questStartData} show={true} postProperties={postProperties} />
        </>
      );
    }
  };

  return (
    <div
      ref={innerRef}
      id={questStartData._id === getQuestUtilsState.playerPlayingId ? 'playing-card' : ''}
      className={`${questStartData.type === 'embed' && 'h-full'}`}
    >
      <QuestCardLayout
        questStartData={questStartData}
        playing={props.playing}
        postProperties={postProperties}
        questType={props.questType}
      >
        {renderQuestContent()}
        <ButtonGroup
          questStartData={questStartData}
          handleStartTest={handleStartTest}
          viewResult={viewResult}
          handleViewResults={handleViewResults}
          setHowManyTimesAnsChanged={setHowManyTimesAnsChanged}
          handleToggleCheck={handleToggleCheck}
          setRankedAnswers={setRankedAnswers}
          answersSelection={answersSelection}
          setAnswerSelection={setAnswerSelection}
          handleSubmit={handleSubmit}
          loading={loading}
          startTest={startTest}
          setAddOptionField={setAddOptionField}
          checkOptionStatus={checkOptionStatus}
          postProperties={postProperties}
          SharedLinkButton={SharedLinkButton}
          questType={props.questType}
        />
      </QuestCardLayout>
    </div>
  );
};

export default QuestionCardWithToggle;
