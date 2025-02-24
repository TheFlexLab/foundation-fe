import PopUp from '../ui/PopUp';
import showToast from '../ui/Toast';
import { Button } from '../ui/Button';
import { FaSpinner } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeHiddenPosts } from '../../features/quest/utilsSlice';
import { hideQuest, updateHiddenQuest } from '../../services/api/questsApi';

export default function UnHidePostPopup({ handleClose, modalVisible, questStartData }) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const { mutateAsync: unHidePost, isPending: unHidePostLoading } = useMutation({
    mutationFn: updateHiddenQuest,
    onSuccess: (resp) => {
      showToast('success', 'postUnhidden');
      queryClient.invalidateQueries(['userInfo']);
      queryClient.setQueriesData(['hiddenPosts'], (oldData) => {
        return {
          ...oldData,
          pages: oldData?.pages?.map((page) => page.filter((item) => item._id !== resp.data.data.questForeignKey)),
        };
      });

      handleClose();
    },
    onError: (err) => {
      console.log(err);
      showToast('error', 'error', {}, err.response.data.message.split(':')[1]);
    },
  });

  const { mutateAsync: hidePost, isPending: hidePostLoading } = useMutation({
    mutationFn: hideQuest,
    onSuccess: (resp) => {
      showToast('success', 'postHidden');
      queryClient.invalidateQueries(['userInfo']);
      queryClient.setQueriesData(['posts'], (oldData) => {
        return {
          ...oldData,
          pages: oldData?.pages?.map((page) => page.filter((item) => item._id !== resp.data.data.questForeignKey)),
        };
      });

      handleClose();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <PopUp
      logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/dialoguebox/unhide.svg`}
      title={'Unhide Post'}
      open={modalVisible.state}
      handleClose={handleClose}
    >
      <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
        <h1 className="text-gray-1 text-[10px] font-medium leading-[12px] dark:text-gray-300 tablet:text-[20px] tablet:leading-[24.2px]">
          Are you sure you want to unhide this post? It will appear on your home feed.
        </h1>
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
          <Button
            variant={'submit'}
            onClick={() => {
              if (modalVisible.type === 'hidden') {
                unHidePost({
                  uuid: persistedUserInfo?.uuid,
                  questForeignKey: questStartData._id,
                  hidden: false,
                  hiddenMessage: '',
                });
                dispatch(removeHiddenPosts(questStartData._id));
              } else {
                hidePost({
                  uuid: persistedUserInfo?.uuid,
                  questForeignKey: questStartData._id,
                  hidden: true,
                  hiddenMessage: questStartData.userQuestSetting.feedbackMessage,
                  Question: questStartData.Question,
                });
              }
            }}
            disabled={hidePostLoading || unHidePostLoading}
          >
            {(hidePostLoading || unHidePostLoading) === true ? (
              <FaSpinner className="animate-spin text-[#EAEAEA]" />
            ) : (
              'Yes'
            )}
          </Button>
          <Button variant={'cancel'} onClick={handleClose}>
            No
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
