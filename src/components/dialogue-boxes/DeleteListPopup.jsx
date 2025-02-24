import PopUp from '../ui/PopUp';
import { Button } from '../ui/Button';
import { FaSpinner } from 'react-icons/fa';
import { deleteList } from '../../services/api/listsApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import showToast from '../ui/Toast';

export default function DeleteListPopup({ handleClose, modalVisible, title, image, categoryId }) {
  const queryClient = useQueryClient();

  const { mutateAsync: handleDeleteList, isPending } = useMutation({
    mutationFn: deleteList,
    onSuccess: (resp) => {
      showToast('success', 'deleteList');
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
        <h1 className="text-gray-1 text-[10px] font-medium leading-[12px] dark:text-gray-300 tablet:text-[20px] tablet:leading-[24.2px]">
          Are you sure you want to delete this Collection?
        </h1>
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
          <Button
            variant={'submit'}
            onClick={() => {
              handleDeleteList(categoryId);
            }}
          >
            {isPending === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Yes'}
          </Button>
          <Button variant={'cancel'} onClick={handleClose}>
            No
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
