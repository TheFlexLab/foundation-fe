import { toast } from 'sonner';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PopUp from '../ui/PopUp';
import api from '../../services/api/Axios';
import { deleteListSettings } from '../../services/api/listsApi';

export default function DisabledListPopup({ handleClose, modalVisible, type, categoryId }) {
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: updateStatus } = useMutation({
    mutationFn: () =>
      api.post(`/userlists/listEnableDisable`, {
        uuid: persistedUserInfo.uuid,
        categoryId,
        enable: type === 'disable' ? 'false' : 'true',
      }),
    onSuccess: (resp) => {
      queryClient.setQueryData(['collection'], (oldData) => {
        const updatedList = resp.data.userList.userList.map((item) =>
          item._id === categoryId ? { ...item, ...resp.data.userList.userList } : item
        );
        return updatedList;
      });

      setIsLoading(false);
      handleClose();
    },
    onError: (err) => {
      setIsLoading(false);
      console.log(err);
    },
  });

  const { mutateAsync: deleteSharedData } = useMutation({
    mutationFn: deleteListSettings,
    onSuccess: (resp) => {
      if (location.pathname === '/profile') {
        queryClient.invalidateQueries({ queryKey: ['collection'] }, { exact: true });
      } else {
        queryClient.setQueryData(['collection'], () => {
          const updatedList = resp.data.updatedSharedList.map((item) =>
            item._id === categoryId ? { ...item, ...resp.data.updatedSharedList } : item
          );
          return updatedList;
        });
      }

      setIsLoading(false);
      handleClose();
    },
    onError: (err) => {
      setIsLoading(false);
    },
  });

  const handleLinkStatusApi = () => {
    setIsLoading(true);
    if (type === 'delete-shared-data') {
      deleteSharedData({ userUuid: persistedUserInfo.uuid, categoryId });
    } else {
      updateStatus();
    }
  };

  return (
    <PopUp
      logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/link.svg`}
      title={type === 'disable' ? 'Disable Sharing' : type === 'enable' ? 'Enable Sharing' : 'Delete Share Data'}
      open={modalVisible}
      handleClose={handleClose}
    >
      <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
        <h1 className="text-gray-1 text-[10px] font-medium leading-[12px] dark:text-gray-300 tablet:text-[20px] tablet:leading-[24.2px]">
          {type === 'disable' ? (
            <span>
              Are you sure you want to disable sharing? This content will no longer be public on your Home Page, and all
              associated shared links will be disabled. You can re-enable it anytime.
            </span>
          ) : type === 'enable' ? (
            <span>
              Are you sure you want to enable sharing? This content will be public on your Home Page, and all associated
              shared links will be re-enabled. You can disable it again at anytime.
            </span>
          ) : (
            <span>
              Are you sure you want to delete this share data? You will no longer be managing this content for your
              audience, and all associated links and insights data will be removed. You can share this content again
              later if you’d like to start over.
            </span>
          )}
        </h1>
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
          <Button variant={'submit'} disabled={isLoading} onClick={handleLinkStatusApi}>
            {isLoading ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Yes'}
          </Button>
          <Button variant={'cancel'} onClick={handleClose}>
            No
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
