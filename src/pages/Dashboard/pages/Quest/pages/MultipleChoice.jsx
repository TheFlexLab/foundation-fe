// import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '../../../../../components/ui/Button';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addAdultFilterPopup,
  addPlayerId,
  resetPlayingIds,
  setIsShowPlayer,
  setPlayingPlayerId,
} from '../../../../../features/quest/utilsSlice';
// import { getConstantsValues } from '../../../../../features/constants/constantsSlice';
import { createInfoQuest, getTopicOfValidatedQuestion } from '../../../../../services/api/questsApi';
import { updateMultipleChoice } from '../../../../../features/createQuest/createQuestSlice';
import { POST_MAX_OPTION_LIMIT, POST_OPTIONS_CHAR_LIMIT } from '../../../../../constants/Values/constants';

import CustomSwitch from '../../../../../components/CustomSwitch';
import Options from '../components/Options';
import showToast from '../../../../../components/ui/Toast';
import CreateQuestWrapper from '../components/CreateQuestWrapper';

import * as createQuestAction from '../../../../../features/createQuest/createQuestSlice';
import * as pictureMediaAction from '../../../../../features/createQuest/pictureMediaSlice';
import * as questServices from '../../../../../services/api/questsApi';
// import * as filtersActions from '../../../../../features/sidebar/filtersSlice';
import { closestCorners, DndContext, MouseSensor, TouchSensor, useSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { setGuestSignUpDialogue } from '../../../../../features/extras/extrasSlice';
import Checkbox from '../../../../../components/ui/Checkbox';
import { toast } from 'sonner';

const MultipleChoice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  // const queryClient = useQueryClient();
  const createQuestSlice = useSelector(createQuestAction.getCreate);
  const questionStatus = useSelector(createQuestAction.questionStatus);
  const getMediaStates = useSelector(createQuestAction.getMedia);
  const getPicsMediaStates = useSelector(createQuestAction.getPicsMedia);
  const getPictureUrls = useSelector(pictureMediaAction.validatedPicUrls);
  const optionsValue = useSelector(createQuestAction.optionsValue);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  // const persistedConstants = useSelector(getConstantsValues);
  const getGifStates = useSelector(createQuestAction.getGif);
  // const filterStates = useSelector(filtersActions.getFilters);
  const [optionsArray, setOptionsArray] = useState(optionsValue || []);
  const [multipleOption, setMultipleOption] = useState(false);
  const [addOption, setAddOption] = useState(createQuestSlice.addOption);
  const [spotlight, setSpotlight] = useState(createQuestSlice.spotlight);
  const [sharePost, setSharePost] = useState(createQuestSlice.sharePost);
  const [changeState, setChangeState] = useState(createQuestSlice.changeState);
  const [changedOption, setChangedOption] = useState(createQuestSlice.changedOption);
  const [loading, setLoading] = useState(false);
  const [hollow, setHollow] = useState(true);
  const mouseSensor = useSensor(MouseSensor);
  const keyboardSensor = useSensor(MouseSensor, { activationConstraint: { distance: 5 } });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 500,
      tolerance: 0,
    },
  });
  const checkDomainBadge = () => {
    return persistedUserInfo?.badges?.some((badge) => !!badge?.domain) || false;
  };
  // const { mutateAsync: createQuest } = useMutation({
  //   mutationFn: createInfoQuest,
  //   onSuccess: (resp) => {
  //     if (resp.status === 201) {
  //       if (filterStates?.moderationRatingFilter?.initial === 0 && filterStates?.moderationRatingFilter?.final === 0) {
  //         dispatch(addAdultFilterPopup({ rating: resp.data.moderationRatingCount }));
  //         dispatch(addPlayerId(resp.data.questID));
  //       }
  //       navigate('/');
  //       queryClient.invalidateQueries(['userInfo']);

  //       dispatch(createQuestAction.resetCreateQuest());
  //       dispatch(pictureMediaAction.resetToInitialState());
  //     }

  //     setLoading(false);
  //     queryClient.invalidateQueries('FeedData');
  //     queryClient.invalidateQueries('treasury');
  //   },

  //   onError: (err) => {
  //     if (err.response) {
  //       showToast('error', 'error', {}, err.response.data.message.split(':')[1]);
  //     }

  //     setMultipleOption(false);
  //     setAddOption(false);
  //     setChangedOption('');
  //     setChangeState(false);
  //     setLoading(false);
  //   },
  // });
  const getArticleId = useSelector(createQuestAction.getArticleId);

  const handleSubmit = async () => {
    dispatch(setIsShowPlayer(false));
    dispatch(setPlayingPlayerId(''));
    dispatch(resetPlayingIds());
    if (persistedUserInfo?.role === 'guest' || persistedUserInfo?.role === 'visitor') {
      dispatch(setGuestSignUpDialogue(true));
      return;
    }

    if (!checkHollow()) {
      setLoading(true);
    }

    if (createQuestSlice.question === '') {
      return showToast('warning', 'emptyPost');
    }

    // getTopicOfValidatedQuestion
    const { questTopic, errorMessage } = await getTopicOfValidatedQuestion({
      validatedQuestion: getMediaStates.desctiption ? getMediaStates.desctiption : createQuestSlice.question,
    });
    // If any error captured
    if (errorMessage) {
      return showToast('error', 'somethingWrong');
    }
    // ModerationRatingCount
    const moderationRating = await questServices.moderationRating({
      validatedQuestion: createQuestSlice.question,
    });
    // If found null
    if (!moderationRating) {
      return showToast('error', 'somethingWrong');
    }
    // if (!getMediaStates.desctiption && getMediaStates.url !== '') {
    //   return showToast('warning', 'emptyPostDescription');
    // }

    const params = {
      Question: createQuestSlice.question,
      whichTypeQuestion: 'multiple choise',
      QuestionCorrect: 'Not Selected',
      QuestAnswers: optionsValue,
      usersAddTheirAns: addOption,
      usersChangeTheirAns: changedOption,
      userCanSelectMultiple: multipleOption,
      QuestAnswersSelected: [],
      uuid: persistedUserInfo?.uuid,
      QuestTopic: questTopic,
      moderationRatingCount: moderationRating.moderationRatingCount,
      url: getMediaStates?.isMedia.isMedia
        ? [getMediaStates.url]
        : getGifStates.gifUrl
          ? [getGifStates.gifUrl]
          : getPictureUrls,
      description: getMediaStates?.isMedia.isMedia && getMediaStates.desctiption,
      type: 'choice',
      spotlight: spotlight ? 'true' : 'false',
      sharePost: sharePost ? 'true' : 'false',
    };
    if (getArticleId !== '') {
      params.articleId = getArticleId;
      params.suggestionTitle = createQuestSlice.question;
    }

    const isEmptyAnswer = params.QuestAnswers.some((answer) => answer.question.trim() === '');

    if (isEmptyAnswer) {
      setLoading(false);
      return showToast('warning', 'emptyOption');
    }

    if (!checkHollow()) {
      navigate('/post-preview', { state: { state: params, path: location.pathname } });
      // createQuest(params);
    }
  };

  const handleChange = (index, value) => {
    if (value.length <= POST_OPTIONS_CHAR_LIMIT) {
      dispatch(createQuestAction.addOptionById({ id: index, option: value }));
    }
  };

  const answerVerification = async (id, index, value, extra) => {
    if (value === '') return;

    if (extra) {
      if (extra === value) return;
    }

    if (optionsValue[index].chatgptQuestion === value) return;

    dispatch(createQuestAction.checkAnswer({ id, value, index }));
  };

  const addNewOption = () => {
    dispatch(createQuestAction.addNewOption());
  };

  const removeOption = (id) => {
    dispatch(createQuestAction.delOption({ id }));

    if (optionsValue.length - 1 === parseInt(id.split('-')[1])) return;

    answerVerification(
      `index-${optionsValue.length - 2}`,
      optionsValue.length - 2,
      optionsValue[optionsValue.length - 1].question
    );
  };

  useEffect(() => {
    let tempOptions = optionsValue.map((item) => {
      return item.question;
    });
    dispatch(
      updateMultipleChoice({
        question: createQuestSlice.question,
        changedOption,
        changeState,
        optionsCount: optionsValue.length,
        addOption,
        options: tempOptions,
        multipleOption,
        sharePost,
        spotlight,
      })
    );
  }, [
    createQuestSlice.question,
    changedOption,
    changeState,
    addOption,
    optionsValue.length,
    optionsValue,
    multipleOption,
    sharePost,
    spotlight,
  ]);

  const handleTab = (index, key) => {
    if (index === optionsValue.length + 2) {
      document.getElementById(`input-${index}`).blur();
    } else {
      if (key === 'Enter') {
        event.preventDefault();
        document.getElementById(`input-${index + 1}`).focus();
      } else {
        document.getElementById(`input-${index}`).focus();
      }
    }
  };

  const checkGifHollow = () => {
    const AllVerified = optionsValue.every((value) => value.optionStatus.tooltipName === 'Answer is Verified');
    if (
      questionStatus.tooltipName === 'Question is Verified' &&
      // getMediaStates.mediaDescStatus.tooltipName === 'Question is Verified' &&
      getGifStates.gifUrlStatus.tooltipName === 'Question is Verified' &&
      getGifStates.gifUrl !== '' &&
      AllVerified
    ) {
      return false;
    } else {
      setLoading(false);
      return true;
    }
  };

  const checkHollow = () => {
    const AllVerified = optionsValue.every((value) => value.optionStatus.tooltipName === 'Answer is Verified');
    if (questionStatus.tooltipName === 'Question is Verified' && AllVerified) {
      return false;
    } else {
      setLoading(false);
      return true;
    }
  };

  const checkMediaHollow = () => {
    const AllVerified = optionsValue.every((value) => value.optionStatus.tooltipName === 'Answer is Verified');
    if (
      questionStatus.tooltipName === 'Question is Verified' &&
      // getMediaStates.mediaDescStatus.tooltipName === 'Question is Verified' &&
      getMediaStates.urlStatus.tooltipName === 'Question is Verified' &&
      AllVerified
    ) {
      return false;
    } else {
      setLoading(false);
      return true;
    }
  };

  const checkPicMediaHollow = () => {
    if (
      questionStatus.tooltipName === 'Question is Verified' &&
      getPicsMediaStates.picUrlStatus.tooltipName === 'Question is Verified' &&
      getPicsMediaStates.picUrl !== ''
    ) {
      return false;
    } else {
      setLoading(false);
      return true;
    }
  };

  useEffect(() => {
    setOptionsArray(optionsValue);

    if (getMediaStates.isMedia.isMedia) {
      if (
        !checkMediaHollow() &&
        optionsValue.every(
          (value) =>
            value.question !== '' &&
            createQuestSlice.question !== '' &&
            // getMediaStates.desctiption !== '' &&
            getMediaStates.url !== ''
        )
      ) {
        setHollow(false);
      } else {
        setHollow(true);
      }
    } else if (getPicsMediaStates.isPicMedia) {
      if (!checkPicMediaHollow()) {
        setHollow(false);
      } else {
        setHollow(true);
      }
    } else if (getGifStates?.isGifMedia) {
      if (!checkGifHollow()) {
        setHollow(false);
      } else {
        setHollow(true);
      }
    } else {
      if (!checkHollow() && optionsValue.every((value) => value.question !== '' && createQuestSlice.question !== '')) {
        setHollow(false);
      } else {
        setHollow(true);
      }
    }
  }, [
    questionStatus,
    optionsValue,
    createQuestSlice.question,
    getMediaStates.isMedia,
    // getMediaStates.desctiption,
    getMediaStates.url,
    getMediaStates.urlStatus,
    getPicsMediaStates.isPicMedia,
    getPicsMediaStates.picUrlStatus,
    getPicsMediaStates.picUrl,
    getGifStates.gifUrl,
    getGifStates.gifUrlStatus,
    getGifStates?.isGifMedia,
  ]);

  const handleOnDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = optionsValue.findIndex((item) => item.id === active.id);
      const newIndex = optionsValue.findIndex((item) => item.id === over.id);
      const newData = arrayMove(optionsValue, oldIndex, newIndex);
      setOptionsArray(newData);
      dispatch(createQuestAction.drapAddDrop({ newTypedValues: newData }));
    }
  };

  useEffect(() => {
    if (location.state?.postData.options) {
      optionsArray.forEach((element, index) => {
        answerVerification(element.id, index, element.question);
      });
    }
    if (location.state?.postData.userCanAddOption) {
      setAddOption(true);
    } else {
      setAddOption(false);
    }
  }, [location.state?.postData.options]);

  useEffect(() => {
    document.getElementById(`input-${optionsValue.length + 2}`).blur();
  }, []);

  const handleSharePostChange = (e) => {
    const isChecked = e.target.checked;
    setSharePost(isChecked);

    if (!isChecked) {
      setSpotlight(false);
    }
  };

  const handleSpotlightChange = (e) => {
    if (!checkDomainBadge()) {
      toast.warning('Please add the Domain Badge to enable this feature');
      return;
    }
    const isChecked = e.target.checked;
    if (isChecked && !sharePost) {
      setSharePost(true);
    }
    setSpotlight(isChecked);
  };

  return (
    <CreateQuestWrapper
      quest="M/R"
      handleTab={handleTab}
      type={'Post'}
      msg={'Participants can select only one option from a list of choices'}
    >
      <DndContext
        sensors={[touchSensor, mouseSensor, keyboardSensor]}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        collisionDetection={closestCorners}
        onDragEnd={handleOnDragEnd}
      >
        <div className="flex flex-col gap-[5px] tablet:gap-[15px]">
          <SortableContext items={optionsArray}>
            {optionsValue.map((item, index) => (
              <Options
                key={item.id}
                id={item.id}
                title="MultipleChoice"
                allowInput={true}
                label={`Option ${index + 1} #`}
                trash={true}
                options={false}
                dragable={true}
                handleChange={(value) => handleChange(item.id, value, optionsValue)}
                typedValue={item.question}
                isTyping={item?.isTyping}
                isSelected={item.selected}
                optionsCount={optionsValue.length}
                removeOption={removeOption}
                number={index + 3}
                optionStatus={optionsValue[index].optionStatus}
                answerVerification={(value) => answerVerification(item.id, index, value)}
                handleTab={handleTab}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>
      <Button
        variant="addOption"
        className="my-2 tablet:mb-6 tablet:mt-5"
        onClick={() => {
          if (optionsValue.length < POST_MAX_OPTION_LIMIT) {
            addNewOption();
          } else {
            return showToast('warning', 'optionLimit');
          }
        }}
      >
        + New Option
      </Button>
      {/* settings */}
      {/* <p className="my-1 text-center text-[8px] font-normal leading-normal text-gray-1 tablet:mb-[10px] tablet:mt-5 tablet:text-[16px] dark:text-[#D8D8D8]">
        &#x200B;
      </p> */}
      <div className="mb-[10px] mt-4 tablet:mb-7 tablet:mt-12" id="focusOut">
        <h5 className="text-gray-1 mt-4 text-[10px] font-semibold leading-[10px] dark:text-white-400 tablet:block tablet:text-[22.81px] tablet:leading-[22.81px] laptop:text-[25px] laptop:leading-[25px]">
          Post Settings
        </h5>
        <div className="mt-1 flex flex-col gap-[5px] rounded-[0.30925rem] border border-white-500 bg-[#FCFCFC] py-[10px] dark:border-gray-100 dark:bg-accent-100 tablet:mt-2 tablet:gap-[15px] tablet:rounded-[16px] tablet:border-[3px] tablet:py-[20px]">
          {/* <div className="mx-[15px] flex items-center justify-between rounded-[0.30925rem] border border-white-500 px-[8.62px] pb-[10.25px] pt-[6px] tablet:rounded-[16px] tablet:border-[3px] tablet:px-[20.26px] tablet:pb-[13.72px] tablet:pt-[14.83px] laptop:mx-[28px] laptop:px-7 laptop:py-[20px]">
            <h5 className="w-[150px] text-[9px] font-normal leading-normal text-gray-1 tablet:w-[300px] tablet:text-[18.662px] laptop:w-full laptop:text-[20px]">
              Participants can select multiple options.
            </h5>
            <CustomSwitch enabled={multipleOption} setEnabled={setMultipleOption} />
          </div> */}
          <div className="mx-[15px] flex items-center justify-between rounded-[0.30925rem] border border-white-500 px-[8.62px] py-[6px] dark:border-gray-100 dark:bg-gray-200 tablet:rounded-[16px] tablet:border-[3px] tablet:px-[20.26px] tablet:pb-[13.72px] tablet:pt-[14.83px] laptop:mx-[28px] laptop:px-7 laptop:py-[20px]">
            <h5 className="text-gray-1 text-[9px] font-normal leading-normal dark:text-white-600 tablet:w-[300px] tablet:text-[18.662px] laptop:w-full laptop:text-[20px]">
              Participants can add their own options.
            </h5>
            <CustomSwitch enabled={addOption} setEnabled={setAddOption} />
          </div>
          <label
            className="mx-[15px] flex cursor-pointer items-center gap-2 rounded-[0.30925rem] border border-white-500 px-[8.62px] py-[6px] dark:border-gray-100 dark:bg-gray-200 tablet:gap-3 tablet:rounded-[16px] tablet:border-[3px] tablet:px-[20.26px] tablet:pb-[13.72px] tablet:pt-[14.83px] laptop:mx-[28px] laptop:px-7 laptop:py-[20px]"
            htmlFor="share-post-checkbox"
          >
            <Checkbox checked={sharePost} onChange={handleSharePostChange} id="share-post-checkbox" />
            <h5 className="text-gray-1 text-[9px] font-normal leading-normal dark:text-white-600 tablet:w-[300px] tablet:text-[18.662px] laptop:w-full laptop:text-[20px]">
              Automatically share this post.
            </h5>
          </label>
          <label
            className="mx-[15px] flex cursor-pointer items-center gap-2 rounded-[0.30925rem] border border-white-500 px-[8.62px] py-[6px] dark:border-gray-100 dark:bg-gray-200 tablet:gap-3 tablet:rounded-[16px] tablet:border-[3px] tablet:px-[20.26px] tablet:pb-[13.72px] tablet:pt-[14.83px] laptop:mx-[28px] laptop:px-7 laptop:py-[20px]"
            htmlFor="spotlight-checkbox"
          >
            <Checkbox checked={spotlight} onChange={handleSpotlightChange} id="spotlight-checkbox" />
            <h5 className="text-gray-1 text-[9px] font-normal leading-normal dark:text-white-600 tablet:w-[300px] tablet:text-[18.662px] laptop:w-full laptop:text-[20px]">
              Automatically pin this post to spotlight.
            </h5>
          </label>
          {/* <ChangeChoiceOption
            changedOption={changedOption}
            changeState={changeState}
            setChangeState={setChangeState}
            setChangedOption={setChangedOption}
          /> */}
        </div>
      </div>
      <div className="flex w-full justify-end">
        <Button
          id={hollow ? 'submitButton' : 'submitButton2'}
          variant={hollow ? 'hollow-submit' : 'submit'}
          onClick={hollow ? null : handleSubmit}
          className="w-[152.09px] tablet:w-[273.44px]"
          disabled={hollow ? true : loading}
        >
          {loading && !hollow ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Preview'}
        </Button>
      </div>
    </CreateQuestWrapper>
  );
};

export default MultipleChoice;
