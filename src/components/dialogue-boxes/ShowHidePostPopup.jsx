import { toast } from 'sonner';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFeedback, hideQuest } from '../../services/api/questsApi';
import PopUp from '../ui/PopUp';
import showToast from '../ui/Toast';
import { setGuestSignUpDialogue } from '../../features/extras/extrasSlice';

export default function ShowHidePostPopup({
  handleClose,
  modalVisible,
  questStartData,
  checkboxStates,
  setCheckboxStates,
  data,
  feature,
}) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [selectedTitle, setSelectedTitle] = useState('');

  const handleCheckboxChange = (index) => {
    const newCheckboxStates = new Array(data.length).fill(false);
    newCheckboxStates[index] = true;
    setCheckboxStates(newCheckboxStates);

    setSelectedTitle(data[index].title);
  };

  const { mutateAsync: handleCreateFeedback, isPending } = useMutation({
    mutationFn: createFeedback,
    onSuccess: (resp) => {
      if (resp.status === 201) {
        queryClient.setQueriesData(['posts'], (oldData) => ({
          ...oldData,
          pages: oldData?.pages?.map((page) =>
            page.map((item) => (item._id === resp.data.data._id ? resp.data.data : item))
          ),
        }));
        queryClient.invalidateQueries(['userInfo', { exact: true }]);
        toast.success(resp.data.message);
      }
      handleClose();
    },
    onError: (err) => {
      toast.error(err.response.data.message);
    },
  });

  const { mutateAsync: hidePost, isPending: hidePostLoading } = useMutation({
    mutationFn: hideQuest,
    onSuccess: (resp) => {
      queryClient.invalidateQueries(['userInfo', { exact: true }]);
      queryClient.setQueriesData(['posts'], (oldData) => {
        return {
          ...oldData,
          pages: oldData?.pages?.map((page) => page.filter((item) => item._id !== resp.data.data.questForeignKey)),
        };
      });

      showToast('success', 'postHidden');
      handleClose();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleHiddenPostApiCall = () => {
    if (persistedUserInfo?.role === 'guest' || persistedUserInfo?.role === 'visitor') {
      dispatch(setGuestSignUpDialogue(true));
      return;
    } else {
      if (selectedTitle === '') {
        showToast('warning', 'hiddenReason');
        return;
      } else {
        if (feature === 'Hide') {
          handleCreateFeedback({
            uuid: persistedUserInfo?.uuid,
            questForeignKey: questStartData._id,
            hiddenMessage: selectedTitle,
            Question: questStartData.Question,
          });
          setTimeout(() => {
            hidePost({
              uuid: persistedUserInfo?.uuid,
              questForeignKey: questStartData._id,
              hidden: true,
              hiddenMessage: selectedTitle,
              Question: questStartData.Question,
            });
          }, 1000);
        } else {
          handleCreateFeedback({
            uuid: persistedUserInfo?.uuid,
            questForeignKey: questStartData._id,
            hiddenMessage: selectedTitle,
            Question: questStartData.Question,
          });
        }
      }
    }
  };

  return (
    <PopUp
      logo={
        feature === 'Hide'
          ? `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/hidePost.svg`
          : `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/feedback-given.svg`
      }
      title={feature === 'Hide' ? 'Hide' : 'Give Feedback'}
      open={modalVisible}
      handleClose={handleClose}
      customStyle={{
        width:
          (questStartData?.userQuestSetting && questStartData.userQuestSetting.feedbackMessage !== '') ||
          questStartData?.startQuestData?.feedbackReverted ||
          questStartData?.startStatus === 'continue'
            ? '100%'
            : 'fit-content',
        minWidth: 'auto',
      }}
    >
      {(feature === 'Hide' &&
        questStartData?.userQuestSetting &&
        questStartData.userQuestSetting.feedbackMessage !== '') ||
      (feature === 'Hide' &&
        (questStartData?.startQuestData?.feedbackReverted || questStartData?.startStatus === 'continue')) ? (
        <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
          <h1 className="text-gray-1 text-[10px] font-medium leading-[12px] dark:text-gray-300 tablet:text-[20px] tablet:leading-[24.2px]">
            Are you sure you want to hide this post?
          </h1>
          <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
            <Button
              variant={'submit'}
              disabled={hidePostLoading}
              onClick={() => {
                hidePost({
                  uuid: persistedUserInfo?.uuid,
                  questForeignKey: questStartData._id,
                  hidden: true,
                  hiddenMessage: selectedTitle,
                  Question: questStartData.Question,
                });
              }}
            >
              {hidePostLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Yes'}
            </Button>
            <Button
              variant={'cancel'}
              onClick={() => {
                handleClose();
              }}
            >
              No
            </Button>
          </div>
        </div>
      ) : (
        <div className="px-[25px] py-[13px] tablet:px-[50px] tablet:py-[27px]">
          <div className="flex flex-col gap-[5px] tablet:gap-3">
            {data
              .filter((filterItem) =>
                questStartData.usersAddTheirAns ||
                questStartData.whichTypeQuestion === 'like/dislike' ||
                questStartData.whichTypeQuestion === 'agree/disagree' ||
                questStartData.whichTypeQuestion === 'yes/no'
                  ? ![3].includes(filterItem.id)
                  : true
              )
              .map((item, index) => (
                <div
                  key={index + 1}
                  id={item.id}
                  className="flex w-full min-w-[183px] cursor-pointer items-center gap-2 rounded-[5.05px] border-[1.52px] border-white-500 px-[10px] py-[5px] dark:border-gray-100 dark:bg-accent-100 tablet:min-w-[364px] tablet:rounded-[10px] tablet:border-[3px] tablet:py-3"
                  onClick={() => handleCheckboxChange(item.id)}
                >
                  <div id="custom-checkbox-popup" className="flex h-full items-center">
                    <input
                      type="checkbox"
                      className="checkbox h-[12.63px] w-[12.63px] rounded-full after:mt-[-2px] tablet:h-[25px] tablet:w-[25px] tablet:after:mt-[1px]"
                      checked={checkboxStates[item.id]}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                  </div>
                  <p className="text-nowrap text-[10px] font-normal leading-[12px] text-[#435059] dark:text-gray-300 tablet:text-[19px] tablet:leading-[23px]">
                    {item.title}
                  </p>
                </div>
              ))}
          </div>
          <div className="mt-[10px] flex justify-center gap-4 tablet:mt-[27px]">
            <Button
              variant={'danger'}
              className={'min-w-[68.2px] max-w-[68.2px] rounded-[7.58px] tablet:min-w-[139px] tablet:max-w-[139px]'}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant={'submit'}
              className={'min-w-[68.2px] max-w-[68.2px] rounded-[7.58px] tablet:min-w-[139px] tablet:max-w-[139px]'}
              disabled={isPending || hidePostLoading}
              onClick={() => {
                handleHiddenPostApiCall();
              }}
            >
              {isPending === true || hidePostLoading === true ? (
                <FaSpinner className="animate-spin text-[#EAEAEA]" />
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        </div>
      )}
    </PopUp>
  );
}
