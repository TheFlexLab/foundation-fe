import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '../../../../../components/ui/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateQuestion } from '../../../../../features/createQuest/createQuestSlice';
import * as filtersActions from '../../../../../features/sidebar/filtersSlice';

import YesNoOptions from '../components/YesNoOptions';
import CreateQuestWrapper from '../components/CreateQuestWrapper';

import * as questServices from '../../../../../services/api/questsApi';
import * as createQuestAction from '../../../../../features/createQuest/createQuestSlice';
import * as pictureMediaAction from '../../../../../features/createQuest/pictureMediaSlice';
import { getConstantsValues } from '../../../../../features/constants/constantsSlice';
import showToast from '../../../../../components/ui/Toast';
import {
  addAdultFilterPopup,
  addPlayerId,
  resetPlayingIds,
  setIsShowPlayer,
  setPlayingPlayerId,
} from '../../../../../features/quest/utilsSlice';
import { setGuestSignUpDialogue } from '../../../../../features/extras/extrasSlice';
import Checkbox from '../../../../../components/ui/Checkbox';

const YesNo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const filterStates = useSelector(filtersActions.getFilters);

  const persistedUserInfo = useSelector((state) => state.auth.user);
  const createQuestSlice = useSelector(createQuestAction.getCreate);
  const questionStatus = useSelector(createQuestAction.questionStatus);
  const getMediaStates = useSelector(createQuestAction.getMedia);
  const getPicsMediaStates = useSelector(createQuestAction.getPicsMedia);
  const getGifStates = useSelector(createQuestAction.getGif);
  const getPictureUrls = useSelector(pictureMediaAction.validatedPicUrls);
  const [changedOption, setChangedOption] = useState(createQuestSlice.changedOption);
  const [changeState, setChangeState] = useState(createQuestSlice.changeState);
  const [loading, setLoading] = useState(false);
  const [hollow, setHollow] = useState(true);
  const [spotlight, setSpotlight] = useState(createQuestSlice.spotlight);
  const [sharePost, setSharePost] = useState(createQuestSlice.sharePost);
  const persistedContants = useSelector(getConstantsValues);
  const location = useLocation();
  const getArticleId = useSelector(createQuestAction.getArticleId);

  const checkDomainBadge = () => {
    return persistedUserInfo?.badges?.some((badge) => !!badge?.domain) || false;
  };

  // const { mutateAsync: createQuest } = useMutation({
  //   mutationFn: questServices.createInfoQuest,
  //   onSuccess: (resp) => {
  //     if (resp.status === 201) {
  //       // setTimeout(() => {
  //       if (filterStates?.moderationRatingFilter?.initial === 0 && filterStates?.moderationRatingFilter?.final === 0) {
  //         dispatch(addAdultFilterPopup({ rating: resp.data.moderationRatingCount }));
  //       }
  //       navigate('/');

  //       setChangedOption('');
  //       setChangeState(false);
  //       dispatch(createQuestAction.resetCreateQuest());
  //       dispatch(pictureMediaAction.resetToInitialState());
  //       dispatch(addPlayerId(resp.data.questID));
  //       // }, 500);
  //     }
  //     setLoading(false);
  //     queryClient.invalidateQueries(['userInfo', 'FeedData', 'treasury']);
  //   },
  //   onError: (err) => {
  //     if (err.response) {
  //       showToast('error', 'error', {}, err.response.data.message.split(':')[1]);
  //       setChangedOption('');
  //       setChangeState(false);
  //     }
  //     setLoading(false);
  //   },
  // });

  const handleTab = (index, key) => {
    if (index === 2) {
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

    const { questTopic, errorMessage } = await questServices.getTopicOfValidatedQuestion({
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
      whichTypeQuestion: 'yes/no',
      usersChangeTheirAns: changedOption,
      QuestionCorrect: 'Not Selected',
      uuid: persistedUserInfo?.uuid,
      QuestTopic: questTopic,
      moderationRatingCount: moderationRating.moderationRatingCount,
      url: getMediaStates?.isMedia.isMedia
        ? [getMediaStates.url]
        : getGifStates.gifUrl
          ? [getGifStates.gifUrl]
          : getPictureUrls,
      description: getMediaStates?.isMedia.isMedia && getMediaStates.desctiption,
      type: 'binary',
      spotlight: spotlight ? 'true' : 'false',
      sharePost: sharePost ? 'true' : 'false',
      // description: getMediaStates?.isMedia.isMedia ? getMediaStates.desctiption : getPicsMediaStates.picDesctiption,
    };
    if (getArticleId !== '') {
      params.articleId = getArticleId;
      params.suggestionTitle = createQuestSlice.question;
    }

    if (!checkHollow()) {
      // createQuest(params);
      navigate('/post-preview', { state: { state: params, path: location.pathname } });
    }
  };

  const checkHollow = () => {
    if (questionStatus.tooltipName === 'Question is Verified') {
      return false;
    } else {
      setLoading(false);
      return true;
    }
  };

  const checkMediaHollow = () => {
    if (
      questionStatus.tooltipName === 'Question is Verified' &&
      // getMediaStates.mediaDescStatus.tooltipName === 'Question is Verified' &&
      getMediaStates.urlStatus.tooltipName === 'Question is Verified'
    ) {
      return false;
    } else {
      setLoading(false);
      return true;
    }
  };

  const checkGifHollow = () => {
    if (
      questionStatus.tooltipName === 'Question is Verified' &&
      // getMediaStates.mediaDescStatus.tooltipName === 'Question is Verified' &&
      getGifStates.gifUrlStatus.tooltipName === 'Question is Verified' &&
      getGifStates.gifUrl !== ''
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
    if (getMediaStates.isMedia.isMedia) {
      if (
        !checkMediaHollow() &&
        createQuestSlice.question !== '' &&
        // getMediaStates.desctiption !== '' &&
        getMediaStates.url !== ''
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
      if (!checkHollow() && createQuestSlice.question !== '') {
        setHollow(false);
      } else {
        setHollow(true);
      }
    }
  }, [
    questionStatus,
    createQuestSlice.question,
    questionStatus.tooltipName,
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

  useEffect(() => {
    dispatch(updateQuestion({ question: createQuestSlice.question, changedOption, changeState, sharePost, spotlight }));
  }, [createQuestSlice.question, changedOption, changeState, sharePost, spotlight]);

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
      handleTab={handleTab}
      type={'Post'}
      msg={'Participants can give a straightforward "Yes" or "No" response'}
    >
      <div className="flex flex-col gap-[5px] tablet:gap-[15px]">
        <YesNoOptions answer={'Yes'} />
        <YesNoOptions answer={'No'} />
      </div>
      <div className="mb-[10px] mt-4 tablet:mb-7 tablet:mt-12">
        <h5 className="mt-4 text-[10px] font-semibold leading-[10px] text-gray-1 dark:text-white-400 tablet:block tablet:text-[22.81px] tablet:leading-[22.81px] laptop:text-[25px] laptop:leading-[25px]">
          Post Settings
        </h5>
        <div className="mt-1 flex flex-col gap-[5px] rounded-[0.30925rem] border border-white-500 bg-[#FCFCFC] py-[10px] dark:border-gray-100 dark:bg-accent-100 tablet:mt-2 tablet:gap-[15px] tablet:rounded-[16px] tablet:border-[3px] tablet:py-[20px]">
          <label
            className="mx-[15px] flex cursor-pointer items-center gap-2 rounded-[0.30925rem] border border-white-500 px-[8.62px] py-[6px] dark:border-gray-100 dark:bg-gray-200 tablet:gap-3 tablet:rounded-[16px] tablet:border-[3px] tablet:px-[20.26px] tablet:pb-[13.72px] tablet:pt-[14.83px] laptop:mx-[28px] laptop:px-7 laptop:py-[20px]"
            htmlFor="share-post-checkbox"
          >
            <Checkbox checked={sharePost} onChange={handleSharePostChange} id="share-post-checkbox" />
            <h5 className="text-[9px] font-normal leading-normal text-gray-1 dark:text-white-600 tablet:w-[300px] tablet:text-[18.662px] laptop:w-full laptop:text-[20px]">
              Automatically share this post.
            </h5>
          </label>
          <label
            className="mx-[15px] flex cursor-pointer items-center gap-2 rounded-[0.30925rem] border border-white-500 px-[8.62px] py-[6px] dark:border-gray-100 dark:bg-gray-200 tablet:gap-3 tablet:rounded-[16px] tablet:border-[3px] tablet:px-[20.26px] tablet:pb-[13.72px] tablet:pt-[14.83px] laptop:mx-[28px] laptop:px-7 laptop:py-[20px]"
            htmlFor="spotlight-checkbox"
          >
            <Checkbox checked={spotlight} onChange={handleSpotlightChange} id="spotlight-checkbox" />
            <h5 className="text-[9px] font-normal leading-normal text-gray-1 dark:text-white-600 tablet:w-[300px] tablet:text-[18.662px] laptop:w-full laptop:text-[20px]">
              Automatically pin this post to spotlight.
            </h5>
          </label>
        </div>
      </div>
      <div className="mt-[10px] flex w-full justify-end tablet:mt-[25px]">
        <Button
          variant={hollow ? 'hollow-submit' : 'submit'}
          id={hollow ? 'submitButton' : 'submitButton2'}
          disabled={hollow || loading}
          onClick={hollow ? null : handleSubmit}
          className={`w-[152.09px] tablet:w-[273.44px]`}
        >
          {loading && !hollow ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Preview'}
        </Button>
      </div>
    </CreateQuestWrapper>
  );
};

export default YesNo;
