import PopUp from '../ui/PopUp';
import { Button } from '../ui/Button';
import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteQuest } from '../../services/api/questsApi';
import showToast from '../ui/Toast';

export default function DeletePostPopup({ handleClose, modalVisible, title, image, id }) {
  const queryClient = useQueryClient();
  const [loading, setIsLoading] = useState(false);

  const { mutateAsync: handleDeletePost } = useMutation({
    mutationFn: deleteQuest,
    onSuccess: () => {
      console.log('Post deleted Successfully');
      setIsLoading(false);

      queryClient.setQueriesData(['posts'], (oldData) => {
        return {
          ...oldData,
          pages: oldData?.pages?.map((page) => page.filter((item) => item._id !== id)),
        };
      });

      queryClient.invalidateQueries('treasury');
    },
    onError: (error) => {
      console.log(error.response.data.message);
      if (error.response.data.message === "Quest is involved in Discussion, Quest can't be deleted.") {
        showToast('error', 'error', {}, error.response.data.message);

        setIsLoading(false);
        return;
      }

      setIsLoading(false);
    },
  });

  return (
    <PopUp logo={image} title={title} open={modalVisible} handleClose={handleClose}>
      <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
        <h1 className="text-gray-1 text-[10px] font-medium leading-[12px] dark:text-gray-300 tablet:text-[20px] tablet:leading-[24.2px]">
          Are you sure you want to delete Post?
        </h1>
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
          <Button
            variant={'submit'}
            onClick={() => {
              setIsLoading(true);
              handleDeletePost(id);
            }}
          >
            {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Yes'}
          </Button>
          <Button variant={'cancel'} onClick={handleClose}>
            No
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
