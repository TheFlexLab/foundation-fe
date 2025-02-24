import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import GuestTopbar from './GuestTopbar';
import StartTest from '../../Dashboard/pages/QuestStartSection/components/StartTest';
import Result from '../../Dashboard/pages/QuestStartSection/components/Result';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createStartQuest } from '../../../services/api/questsApi';
import { useNavigate } from 'react-router-dom';
import { getQuests, toggleCheck } from '../../../features/quest/questsSlice';
import SingleAnswer from '../../../components/question-card/options/SingleAnswer';
import { validateInterval } from '../../../utils';
import showToast from '../../../components/ui/Toast';

const QuestionCard = ({
  tab,
  id,
  img,
  alt,
  badgeCount,
  time,
  question,
  answers,
  title,
  usersAddTheirAns,
  whichTypeQuestion,
  btnText,
  startStatus,
  viewResult,
  handleViewResults,
  multipleOption,
  QuestTopic,
  createdBy,
  usersChangeTheirAns,
  lastInteractedAt,
  questStartData,
}) => {
  const dispatch = useDispatch();
  const quests = useSelector(getQuests);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);
  const [addOptionField, setAddOptionField] = useState(0);
  const [addOptionLimit, setAddOptionLimit] = useState(0);
  const [bookmarkStatus, setbookmarkStatus] = useState(false);
  const queryClient = useQueryClient();
  const [howManyTimesAnsChanged, setHowManyTimesAnsChanged] = useState(0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [answersSelection, setAnswerSelection] = useState(
    answers?.map((answer) => ({
      label: answer.question,
      check: false,
      contend: false,
    }))
  );

  useEffect(() => {
    setAnswerSelection(
      answers?.map((answer) => ({
        label: answer.question,
        check: false,
        contend: false,
      }))
    );
  }, [answers]);

  const [rankedAnswers, setRankedAnswers] = useState(
    answersSelection?.map((item, index) => ({
      id: `unique-${index}`,
      ...item,
    }))
  );

  useEffect(() => {
    setRankedAnswers(
      answersSelection?.map((item, index) => ({
        id: `unique-${index}`,
        ...item,
      }))
    );
  }, [answersSelection]);

  const handleOpen = () => {
    setAddOptionField(1);
    handleAddOption();
  };

  const handleAddOption = () => {
    const newOption = {
      label: '',
      check: false,
      contend: false,
      addedOptionByUser: true,
      edit: true,
      delete: true,
    };

    setAnswerSelection([newOption, ...answersSelection]);

    setAddOptionField(0);
    setAddOptionLimit(1);
  };

  const { mutateAsync: startQuest } = useMutation({
    mutationFn: createStartQuest,
    onSuccess: (resp) => {
      if (resp.data.message === 'Start Quest Created Successfully') {
        queryClient.invalidateQueries('FeedData');
        navigate('/');
      }
      setLoading(false);
    },
    onError: (err) => {
      setLoading(false);
      showToast('error', err);
    },
  });

  const extractSelectedAndContended = (quests) => {
    let selected = null;
    let contended = null;

    for (const key in quests) {
      const option = quests[key];

      if (option.check) {
        selected = key;
      }

      if (option.contend) {
        contended = key;
      }
    }

    return { selected, contended };
  };

  const handleSubmit = () => {
    setLoading(true);
    if (
      whichTypeQuestion === 'agree/disagree' ||
      whichTypeQuestion === 'yes/no' ||
      whichTypeQuestion === 'like/dislike'
    ) {
      const { selected, contended } = extractSelectedAndContended(
        whichTypeQuestion === 'agree/disagree'
          ? quests.agreeDisagree
          : whichTypeQuestion === 'yes/no'
            ? quests.yesNo
            : quests.likeDislike
      );

      let ans = {
        created: new Date(),
      };
      if (selected) {
        ans.selected = selected.charAt(0).toUpperCase() + selected.slice(1);
      }
      if (contended) {
        ans.contended = contended.charAt(0).toUpperCase() + contended.slice(1);
      }

      const params = {
        questId: id,
        answer: ans,
        addedAnswer: '',
        uuid: persistedUserInfo?.uuid,
      };

      // if (!(params.answer.selected && params.answer.contended)) {
      if (!params.answer.selected) {
        showToast('warning', 'emptySelection');
        return;
      }

      if (btnText === 'change answer') {
        console.log(howManyTimesAnsChanged);
        const currentDate = new Date();

        const timeInterval = validateInterval(usersChangeTheirAns);
        // Check if enough time has passed
        if (howManyTimesAnsChanged > 1 && currentDate - new Date(lastInteractedAt) < timeInterval) {
          // Alert the user if the time condition is not met
          toast.error(`You can change your selection again in ${usersChangeTheirAns}`);
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

  const capitalizeFirstLetter = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const handleToggleCheck = (option, check, contend) => {
    const capitalizedOption = capitalizeFirstLetter(option);

    const actionPayload = {
      option: capitalizedOption,
      check,
      contend,
    };

    dispatch(toggleCheck(actionPayload));
  };

  const handleClose = () => setOpen(false);

  // useEffect(() => {
  //   localStorage.setItem("lastInteractedAt", lastInteractedAt);
  //   localStorage.setItem("howManyTimesAnsChanged", howManyTimesAnsChanged);
  // }, [lastInteractedAt, howManyTimesAnsChanged]);

  return (
    <div className="flex justify-center">
      <div className="mx-[15px] w-full rounded-[12.3px] bg-[#F3F3F3] dark:bg-[#141618] tablet:mx-[30px] tablet:rounded-[1.625rem] laptop:mx-[5.25rem]">
        <GuestTopbar
          title={title}
          badgeCount={badgeCount}
          QuestTopic={QuestTopic}
          img={img}
          alt={alt}
          createdBy={createdBy}
        />
        <div className="ml-6 mr-[1.38rem] mt-[2.25rem] flex items-center justify-between tablet:ml-[4.5rem]">
          <h1 className="text-gray-1 text-[11.83px] font-semibold leading-normal dark:text-[#B8B8B8] tablet:text-[28px]">
            {question?.endsWith('?') ? 'Q.' : 'S.'} {question}
          </h1>
          <div>
            {bookmarkStatus ? (
              persistedTheme !== 'dark' ? (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/bookmark/bookmark.png`}
                  alt="save icon"
                  className="h-[17px] w-[12.7px] cursor-pointer tablet:h-[39px] tablet:w-[28px]"
                />
              ) : (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/bookmark/darkbookmark.png`}
                  alt="save icon"
                  className="h-[17px] w-[12.7px] cursor-pointer tablet:h-[39px] tablet:w-[28px]"
                />
              )
            ) : (
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/bookmark/disablebookmark.png`}
                alt="save icon"
                className="h-[17px] w-[12.7px] cursor-pointer tablet:h-[39px] tablet:w-[28px]"
              />
            )}
          </div>
        </div>
        {tab === 'Participate' ? (
          rankedAnswers && (
            <StartTest
              title={title}
              answers={answers}
              multipleOption={multipleOption}
              SingleAnswer={SingleAnswer}
              quests={quests}
              whichTypeQuestion={whichTypeQuestion}
              handleToggleCheck={handleToggleCheck}
              handleSubmit={handleSubmit}
              handleOpen={handleOpen}
              handleClose={handleClose}
              open={open}
              // btnText={btnText}
              usersAddTheirAns={usersAddTheirAns}
              setAnswerSelection={setAnswerSelection}
              answersSelection={answersSelection}
              rankedAnswers={rankedAnswers}
              setRankedAnswers={setRankedAnswers}
              addOptionField={addOptionField}
              setAddOptionField={setAddOptionField}
              addOptionLimit={addOptionLimit}
              setAddOptionLimit={setAddOptionLimit}
              time={time}
              loading={loading}
              setLoading={setLoading}
              usersChangeTheirAns={usersChangeTheirAns}
              lastInteractedAt={lastInteractedAt}
              howManyTimesAnsChanged={howManyTimesAnsChanged}
            />
          )
        ) : (
          <Result
            id={id}
            title={title}
            handleToggleCheck={handleToggleCheck}
            handleClose={handleClose}
            answers={answers}
            btnText={btnText}
            whichTypeQuestion={whichTypeQuestion}
            setHowManyTimesAnsChanged={setHowManyTimesAnsChanged}
            answersSelection={answersSelection}
            setAnswerSelection={setAnswerSelection}
            rankedAnswers={rankedAnswers}
            setRankedAnswers={setRankedAnswers}
            viewResult={viewResult}
            handleViewResults={handleViewResults}
            startStatus={startStatus}
            time={time}
          />
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
