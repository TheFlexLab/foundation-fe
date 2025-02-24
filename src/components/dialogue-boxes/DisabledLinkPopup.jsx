import { useState } from 'react';
import { Button } from '../ui/Button';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSharedLinkStatus } from '../../services/api/questsApi';
import * as questUtilsActions from '../../features/quest/utilsSlice';
import PopUp from '../ui/PopUp';
import { useLocation } from 'react-router-dom';

export default function DisabledLinkPopup({ handleClose, modalVisible }) {
  const queryClient = useQueryClient();
  const location = useLocation();

  const questUtils = useSelector(questUtilsActions.getQuestUtils);
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: updateStatus } = useMutation({
    mutationFn: updateSharedLinkStatus,
    onSuccess: (resp) => {
      queryClient.invalidateQueries({ queryKey: ['userInfo', localStorage.getItem('uuid')] }, { exact: true });

      if (questUtils.sharedQuestStatus.type === 'Delete') {
        // queryClient.setQueriesData(['sharedLink'], (oldData) => {
        //   return {
        //     ...oldData,
        //     pages: oldData?.pages?.map((page) => page.filter((item) => item._id !== resp.data.data.questForeignKey)),
        //   };
        // });
        queryClient.setQueriesData(['sharedLink'], (oldData) => {
          if (!oldData || !oldData.pages) return oldData;

          const updatedPages = oldData.pages.map((page, index) => {
            if (!Array.isArray(page)) {
              return page;
            }
            return page.filter((item) => item._id !== resp.data.data.questForeignKey);
          });

          return {
            ...oldData,
            pages: updatedPages,
          };
        });
      }
      if (questUtils.sharedQuestStatus.type === 'Disable') {
        // if (location.pathname === '/profile') {
        //   queryClient.setQueryData(['sharedLink', ''], (oldData) => {
        //     return {
        //       ...oldData,
        //       pages: oldData?.pages?.map((page) => page.filter((item) => item._id !== resp.data.data.questForeignKey)),
        //     };
        //   });
        // } else {
        queryClient.setQueryData(['sharedLink', ''], (oldData) => ({
          ...oldData,
          pages: oldData?.pages?.map((page) =>
            page.map((item) =>
              item._id === resp.data.data.questForeignKey
                ? { ...item, userQuestSetting: { ...item.userQuestSetting, linkStatus: 'Disable' } }
                : item
            )
          ),
        }));
        // }
      }
      if (questUtils.sharedQuestStatus.type === 'Enable') {
        queryClient.setQueriesData(['sharedLink'], (oldData) => ({
          ...oldData,
          pages: oldData?.pages?.map((page) =>
            page.map((item) =>
              item._id === resp.data.data.questForeignKey
                ? { ...item, userQuestSetting: { ...item.userQuestSetting, linkStatus: 'Enable' } }
                : item
            )
          ),
        }));
      }
      setIsLoading(false);
      handleClose();
    },
    onError: (err) => {
      setIsLoading(false);
      handleClose();
      console.log(err);
    },
    onSettled: () => {
      const updatedLinks = queryClient.getQueryData(['sharedLink', '']);

      // Invalidate if no pages or all pages are empty
      if (!updatedLinks || updatedLinks.pages?.every((page) => page.length === 0)) {
        queryClient.invalidateQueries(['sharedLink']);
      }
    },
  });

  const handleLinkStatusApi = () => {
    setIsLoading(true);
    updateStatus({ link: questUtils.sharedQuestStatus.link, data: questUtils.sharedQuestStatus.type });
  };

  return (
    <PopUp
      logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/link.svg`}
      title={
        questUtils.sharedQuestStatus.type === 'Delete'
          ? 'Delete Share Data'
          : questUtils.sharedQuestStatus.type === 'Enable'
            ? 'Enable Sharing'
            : 'Disable Sharing'
      }
      open={modalVisible}
      handleClose={handleClose}
    >
      <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
        <h1 className="text-gray-1 text-[10px] font-medium leading-[12px] dark:text-gray-300 tablet:text-[20px] tablet:leading-[24.2px]">
          {questUtils.sharedQuestStatus.type === 'Delete' ? (
            <span>
              Are you sure you want to delete this share data? You will no longer be managing this content for your
              audience, and all associated links and insights data will be removed. You can share this content again
              later if you’d like to start over.
            </span>
          ) : questUtils.sharedQuestStatus.type === 'Enable' ? (
            <span>
              Are you sure you want to enable sharing? This content will be public on your Home Page, and all associated
              shared links will be re-enabled. You can disable it again at anytime.
            </span>
          ) : (
            <span>
              Are you sure you want to disable sharing? This content will no longer be public on your Home Page, and all
              associated shared links will be disabled. You can re-enable it anytime.
            </span>
          )}
        </h1>
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
          <Button variant={'submit'} disabled={isLoading} onClick={handleLinkStatusApi}>
            {isLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Yes'}
          </Button>{' '}
          <Button variant={'cancel'} onClick={handleClose}>
            No
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
