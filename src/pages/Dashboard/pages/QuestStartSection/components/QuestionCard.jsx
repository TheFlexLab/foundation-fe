import { toast } from 'sonner';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { validateInterval } from '../../../../../utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateChangeAnsStartQuest } from '../../../../../services/api/questsApi';
import { getQuestionTitle } from '../../../../../utils/questionCard/SingleQuestCard';

import Result from './Result';
import StartTest from './StartTest';
import ButtonGroup from '../../../../../components/question-card/ButtonGroup';
import QuestInfoText from '../../../../../components/question-card/QuestInfoText';
import QuestCardLayout from '../../../../../components/question-card/QuestCardLayout';
import ConditionalTextFullScreen from '../../../../../components/question-card/ConditionalTextFullScreen';

import * as questAction from '../../../../../features/quest/questsSlice';
import * as questUtilsActions from '../../../../../features/quest/utilsSlice';
import * as questServices from '../../../../../services/api/questsApi';
import { questSelectionInitial } from '../../../../../constants/quests';
import Spacing from '../../../../../components/question-card/Spacing';
import showToast from '../../../../../components/ui/Toast';
import { tooltipDefaultStatus } from '../../../../../utils/extras';

const QuestionCard = (props) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const quests = useSelector(questAction.getQuests);
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const { innerRef, questStartData, handleStartTest, startTest, setStartTest } = props;
  const { isBookmarked, viewResult, handleViewResults } = props;
  const { setSubmitResponse, postProperties } = props;

  const [open, setOpen] = useState(false);
  const [howManyTimesAnsChanged, setHowManyTimesAnsChanged] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [questSelection, setQuestSelection] = useState(questSelectionInitial);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [checkOptionStatus, setCheckOptionStatus] = useState(tooltipDefaultStatus);

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

  const [answersSelection, setAnswerSelection] = useState(
    questStartData.QuestAnswers?.map((answer) => ({
      label: answer.question,
      check: false,
      contend: false,
      uuid: answer.uuid,
    }))
  );

  const [rankedAnswers, setRankedAnswers] = useState(
    answersSelection?.map((item, index) => ({
      id: `unique-${index}`,
      ...item,
    }))
  );

  const cardSize = useMemo(() => {
    const limit = windowWidth >= 744 ? true : false;
    if (
      questStartData.whichTypeQuestion === 'agree/disagree' ||
      questStartData.whichTypeQuestion === 'like/dislike' ||
      questStartData.whichTypeQuestion === 'yes/no'
    ) {
      return limit ? 108 : 49;
    } else {
      let tempSize = 0;
      questStartData.QuestAnswers.forEach((item, index) => {
        tempSize += index === 0 ? (limit ? 49 : 24) : limit ? 59 : 29.7;
      });

      // Adjust tempSize if the number of elements is greater than 6
      const maxElements = 6;
      if (questStartData.QuestAnswers.length > maxElements) {
        tempSize = maxElements * (limit ? 59 : 29.7);
      }

      if (limit) {
        return tempSize > 336 ? 336 : tempSize;
      } else {
        return tempSize > 187 ? 187 : tempSize;
      }
    }
  }, [questStartData.QuestAnswers, windowWidth]);

  useEffect(() => {
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

  const handleClose = () => setOpen(false);

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
            : 'No'
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
            : 'Disagree'
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
            : 'Dislike'
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

  const updateAnswersSelectionForRanked = (prevAnswers, actionPayload) => {
    const { option, label } = actionPayload;

    const updatedAnswers = prevAnswers.map((answer) => {
      // Check if the label matches the question
      if (label.some((item) => item.question === answer.label)) {
        return { ...answer, check: true }; // Set check to true for matching question
      } else {
        return answer;
      }
    });

    return updatedAnswers;
  };

  const handleRankedChoice = (option, label) => {
    const actionPayload = {
      option,
      label,
    };

    setAnswerSelection((prevAnswers) => updateAnswersSelectionForRanked(prevAnswers, actionPayload));
  };

  const { mutateAsync: startQuest } = useMutation({
    mutationFn: questServices.createStartQuest,
    onSuccess: (resp) => {
      if (resp.data.message === 'Start Quest Created Successfully') {
        setSubmitResponse(resp.data.data);
        setLoading(false);

        queryClient.invalidateQueries(['userInfo']);
      }
      handleViewResults(questStartData._id);

      setLoading(false);
    },
    onError: (err) => {
      showToast('error', 'error', {}, err.response.data.message.split(':')[1]);
      setLoading(false);
    },
  });

  const { mutateAsync: changeAnswer } = useMutation({
    mutationFn: updateChangeAnsStartQuest,
    onSuccess: (resp) => {
      queryClient.invalidateQueries(['userInfo']);
      if (resp.data.message === 'Answer has not changed') {
        setLoading(false);
        showToast('warning', 'selectedSameOptions');
      }
      if (resp.data.message === 'You can change your answer once every 1 hour') {
        setLoading(false);
        showToast('warning', 'changeOptionTimePeriod');
      }
      if (resp.data.message === 'Start Quest Updated Successfully') {
        setLoading(false);
        setSubmitResponse(resp.data.data);
        handleViewResults(questStartData._id);
      }

      dispatch(questUtilsActions.resetaddOptionLimit());
    },
    onError: (err) => {
      showToast('error', 'error', {}, err.response.data.message.split(':')[1]);
      setLoading(false);

      dispatch(questUtilsActions.resetaddOptionLimit());
    },
  });

  const handleSubmit = () => {
    setLoading(true);
    if (
      questStartData.whichTypeQuestion === 'agree/disagree' ||
      questStartData.whichTypeQuestion === 'yes/no' ||
      questStartData.whichTypeQuestion === 'like/dislike'
    ) {
      let ans = {
        created: new Date(),
      };

      // if (questStartData.whichTypeQuestion === 'yes/no') {
      //   ans.selected = questSelection['yes/no'].yes.check === true ? 'Yes' : 'No';
      // }

      // if (questStartData.whichTypeQuestion === 'agree/disagree') {
      //   ans.selected = questSelection['agree/disagree'].agree.check === true ? 'Agree' : 'Disagree';
      // }

      // if (questStartData.whichTypeQuestion === 'like/dislike') {
      //   ans.selected = questSelection['like/dislike'].like.check === true ? 'Like' : 'Dislike';
      // }

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
        uuid: persistedUserInfo?.uuid,
      };

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
          changeAnswer(params);
        }
      } else {
        startQuest(params);
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
          if (answersSelection[i].addedOptionByUser) {
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
        } else if (answersSelection[i].check === false && answersSelection[i].addedOptionByUser === true) {
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
            uuid: persistedUserInfo?.uuid,
            isAddedAnsSelected: isAddedAnsSelected,
          };

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
            changeAnswer(params);
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
          uuid: persistedUserInfo?.uuid,
          isAddedAnsSelected: isAddedAnsSelected,
        };

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
          startQuest(params);
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
        if (rankedAnswers[i].addedOptionByUser) {
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
            uuid: persistedUserInfo?.uuid,
            isAddedAnsSelected: isAddedAnsSelected,
          };
          const isEmptyQuestion = params.answer.selected.some((item) => item.question.trim() === '');

          if (isEmptyQuestion) {
            showToast('warning', 'optionBlank');
            setLoading(false);
            return;
          }
          changeAnswer(params);
        }
      } else {
        const params = {
          questId: questStartData._id,
          answer: dataToSend,
          addedAnswer: addedAnswerValue,
          addedAnswerUuid: addedAnswerUuidValue,
          uuid: persistedUserInfo?.uuid,
          isAddedAnsSelected: isAddedAnsSelected,
        };

        const isEmptyQuestion = params.answer.selected.some((item) => item.question.trim() === '');

        if (isEmptyQuestion) {
          showToast('warning', 'optionBlank');
          setLoading(false);
          return;
        }
        startQuest(params);
      }
    }
  };

  const renderQuestContent = () => {
    if (viewResult === questStartData._id) {
      return (
        <>
          <Spacing questStartData={questStartData} show={true} questType={questStartData.whichTypeQuestion} />
          <Result
            questStartData={questStartData}
            id={questStartData._id}
            title={getQuestionTitle(questStartData.whichTypeQuestion)}
            handleToggleCheck={handleToggleCheck}
            answers={questStartData.QuestAnswers}
            btnText={questStartData.startStatus}
            whichTypeQuestion={questStartData.whichTypeQuestion}
            setHowManyTimesAnsChanged={setHowManyTimesAnsChanged}
            answersSelection={answersSelection}
            setAnswerSelection={setAnswerSelection}
            rankedAnswers={rankedAnswers}
            setRankedAnswers={setRankedAnswers}
            handleViewResults={handleViewResults}
            usersChangeTheirAns={questStartData.usersChangeTheirAns}
            lastInteractedAt={questStartData.lastInteractedAt}
            howManyTimesAnsChanged={howManyTimesAnsChanged}
            questSelection={questSelection}
            cardSize={cardSize}
          />
          <QuestInfoText questStartData={questStartData} show={false} questType={questStartData.whichTypeQuestion} />
          {/* <ConditionalTextFullScreen questStartData={questStartData} show={false} /> */}
        </>
      );
    }

    if (startTest === questStartData._id) {
      return (
        <>
          <Spacing questStartData={questStartData} show={true} questType={questStartData.whichTypeQuestion} />
          <StartTest
            questStartData={questStartData}
            handleToggleCheck={handleToggleCheck}
            id={questStartData._id}
            title={getQuestionTitle(questStartData.whichTypeQuestion)}
            answers={questStartData.QuestAnswers}
            multipleOption={questStartData.userCanSelectMultiple}
            quests={quests}
            whichTypeQuestion={questStartData.whichTypeQuestion}
            handleSubmit={handleSubmit}
            handleClose={handleClose}
            open={open}
            btnText={questStartData.startStatus}
            usersAddTheirAns={questStartData.usersAddTheirAns}
            answersSelection={answersSelection}
            setAnswerSelection={setAnswerSelection}
            rankedAnswers={rankedAnswers}
            setRankedAnswers={setRankedAnswers}
            setStartTest={setStartTest}
            loading={loading}
            usersChangeTheirAns={questStartData.usersChangeTheirAns}
            howManyTimesAnsChanged={howManyTimesAnsChanged}
            loadingDetail={loadingDetail}
            questSelection={questSelection}
            cardSize={cardSize}
            checkOptionStatus={checkOptionStatus}
            setCheckOptionStatus={setCheckOptionStatus}
            postProperties={postProperties}
          />
          {/* <ConditionalTextFullScreen questStartData={questStartData} show={true} /> */}
          <QuestInfoText questStartData={questStartData} show={true} questType={questStartData.whichTypeQuestion} />
        </>
      );
    } else {
      return (
        <QuestInfoText
          questStartData={questStartData}
          show={false}
          questType={questStartData.whichTypeQuestion}
          postProperties={postProperties}
        />
      );
    }
  };

  return (
    <div ref={innerRef}>
      <QuestCardLayout
        questStartData={questStartData}
        isBookmarked={isBookmarked}
        handleStartTest={handleStartTest}
        postProperties={postProperties}
        handleViewResults={handleViewResults}
        startTest={startTest}
      >
        {renderQuestContent()}

        <ButtonGroup
          postProperties={postProperties}
          questStartData={questStartData}
          handleToggleCheck={handleToggleCheck}
          id={questStartData._id}
          btnText={questStartData.startStatus}
          handleStartTest={handleStartTest}
          handleViewResults={handleViewResults}
          setHowManyTimesAnsChanged={setHowManyTimesAnsChanged}
          whichTypeQuestion={questStartData.whichTypeQuestion}
          handleRankedChoice={handleRankedChoice}
          rankedAnswers={rankedAnswers}
          setRankedAnswers={setRankedAnswers}
          answersSelection={answersSelection}
          setAnswerSelection={setAnswerSelection}
          startStatus={questStartData.startStatus}
          setLoadingDetail={setLoadingDetail}
          handleOpen={handleAddOption}
          usersAddTheirAns={questStartData.usersAddTheirAns}
          answers={questStartData.QuestAnswers}
          title={getQuestionTitle(questStartData.whichTypeQuestion)}
          setStartTest={setStartTest}
          viewResult={viewResult}
          handleSubmit={handleSubmit}
          loading={loading}
          startTest={startTest}
          checkOptionStatus={checkOptionStatus}
        />
      </QuestCardLayout>
    </div>
  );
};

export default QuestionCard;
