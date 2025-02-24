import PopUp from '../ui/PopUp';
import { toast } from 'sonner';
import { Button } from '../ui/Button';
import { FaSpinner } from 'react-icons/fa';
import { deleteList, updateCategoryName } from '../../services/api/listsApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TextareaAutosize } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import showToast from '../ui/Toast';

export default function EditListNameDialogue({ handleClose, modalVisible, title, image, categoryId, listData }) {
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    setCategoryName(listData);
  }, [listData]);

  const { mutateAsync: handleChangeCategoryName, isPending } = useMutation({
    mutationFn: updateCategoryName,
    onSuccess: () => {
      showToast('success', 'listNameUpdate');
      queryClient.invalidateQueries(['collection']);
      handleClose();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <PopUp logo={image} title={title} open={modalVisible} handleClose={handleClose}>
      <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
        <div className="mb-2 flex tablet:mb-5">
          <div className="w-full rounded-[5.387px] border border-white-500 tablet:rounded-[15px] tablet:border-[3px]">
            {' '}
            <TextareaAutosize
              onChange={(e) => setCategoryName(e.target.value)}
              value={categoryName}
              // className="w-full resize-none rounded-[5.128px] border border-white-500 bg-white px-[9.24px] py-[4px] text-[0.625rem] font-medium leading-[13px] text-gray-1 focus-visible:outline-none tablet:rounded-l-[10.3px] tablet:border-[3px] tablet:px-[18px] tablet:py-[10px] tablet:text-[18px] tablet:leading-[18px] laptop:rounded-[0.625rem] dark:border-[#0D1012] dark:bg-[#0D1012] dark:text-gray-1"
              className="text-gray-1 dark:text-gray-1 flex w-full resize-none items-center bg-white px-[9.24px] py-[6.84px] pr-2 text-[0.625rem] font-normal leading-[0.625rem] focus-visible:outline-none tablet:rounded-[10px] tablet:px-[11px] tablet:py-3 tablet:text-[18px] tablet:leading-[18px]"
            />
            {/* <button
            className={`relative rounded-r-[5.128px] border-y border-r border-white-500 bg-white text-[0.5rem] font-semibold leading-none tablet:rounded-r-[10.3px] tablet:border-y-[3px] tablet:border-r-[3px] tablet:text-[1rem] laptop:rounded-r-[0.625rem] laptop:text-[1.25rem] dark:border-[#0D1012] dark:bg-[#0D1012]`}
          >
            <div className="flex h-[75%] w-[50px] items-center justify-center border-l-[0.7px] border-white-500 text-[#0FB063] tablet:w-[100px] tablet:border-l-[3px] laptop:w-[60px]">
              OK
            </div>
          </button> */}
          </div>
        </div>
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
          <Button
            variant={'submit'}
            disabled={isPending}
            onClick={() => {
              handleChangeCategoryName({
                userUuid: persistedUserInfo.uuid,
                categoryId,
                category: categoryName,
              });
            }}
          >
            {isPending === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : ' Save'}
          </Button>
          <Button variant={'cancel'} onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
