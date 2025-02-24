import { useState } from 'react';
import { Button } from '../ui/Button';
import { FaSpinner } from 'react-icons/fa';
import { useCopyCollection } from '../../services/api/listsApi';
import PopUp from '../ui/PopUp';

export default function CopyCollection({ handleClose, modalVisible, categoryItem }) {
  const [listName, setListName] = useState(categoryItem?.category || '');

  const { mutateAsync: handleCopyCollection, isPending } = useCopyCollection(handleClose);

  return (
    <PopUp
      logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/addToListWhite.svg`}
      title={'Copy Collection'}
      open={modalVisible}
      handleClose={handleClose}
      isBackground={false}
    >
      <div className="px-[27px] py-3 tablet:px-[74px] tablet:py-[37px]">
        <p className="summary-text mb-2 tablet:mb-[25px]">Copy these posts to a collection</p>
        <div className="flex flex-col gap-2 tablet:gap-[10px]">
          <input
            type="text"
            className="peer block h-[23px] w-full min-w-[280px] appearance-none rounded-[4.161px] border-[1.248px] border-white-500 bg-transparent py-[5px] pl-[6px] pr-8 text-[10px] font-normal leading-[10px] text-[#707175] focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-100 dark:bg-accent-100 dark:text-gray-300 tablet:h-full tablet:min-w-full tablet:rounded-[10px] tablet:border-2 tablet:py-2 tablet:pl-5 tablet:text-[18.23px]"
            value={listName}
            placeholder="Collection name"
            onChange={(e) => setListName(e.target.value)}
          />
        </div>
        <div className="mt-2 flex justify-end tablet:mt-[25px]">
          <Button
            variant={'submit'}
            disable={isPending || listName === ''}
            className={'bg-[#7C7C7C]'}
            onClick={() => {
              handleCopyCollection({ collectionId: categoryItem._id, collectionName: listName });
            }}
          >
            {isPending ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Create'}
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
