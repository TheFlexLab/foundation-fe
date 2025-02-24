import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { Button } from '../../../components/ui/Button';
import { HideOptionProps, PostAnswer } from '../../../types/advanceAnalytics';
import { useAnalyzePostMutation } from '../../../services/mutations/advance-analytics';
import { dualOptionsMap } from '../../../constants/advanceAnalytics';
import showToast from '../../../components/ui/Toast';

export default function HideOption({ handleClose, questStartData, update, selectedItem }: HideOptionProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const { mutateAsync: handleAnalyzePost, isPending } = useAnalyzePostMutation({ handleClose });

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="flex flex-col">
      <h1 className="summary-text my-2 text-center tablet:my-4">You can Hide an option</h1>
      <div className="relative inline-block w-full">
        <button
          onClick={toggleDropdown}
          className="flex w-full items-center justify-between rounded border border-white-500 px-2 py-1 text-start text-[10px] text-accent-600 focus:outline-none dark:border-gray-100 dark:text-gray-300 tablet:rounded-[10px] tablet:border-[3px] tablet:px-4 tablet:py-2 tablet:text-[20px]"
        >
          {selectedOptions.length > 0 ? selectedOptions[selectedOptions.length - 1] : 'Select an option'}
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/arrow-right.svg`}
            alt="arrow-right.svg"
            className={`size-[10px] transition-all duration-500 tablet:size-6 ${isOpen ? '-rotate-90' : 'rotate-90'}`}
          />
        </button>
        {isOpen && (
          <ul className="absolute z-10 mt-2 max-h-32 w-full min-w-[160px] overflow-y-scroll rounded border border-white-500 bg-white text-[10px] dark:border-gray-100 dark:bg-gray-200 tablet:max-h-48 tablet:border-[2px] tablet:text-[20px]">
            {questStartData?.whichTypeQuestion === 'yes/no' ||
            questStartData?.whichTypeQuestion === 'agree/disagree' ||
            questStartData?.whichTypeQuestion === 'like/dislike'
              ? dualOptionsMap[questStartData?.whichTypeQuestion as 'yes/no' | 'agree/disagree' | 'like/dislike'].map(
                  (item) => (
                    <li
                      key={item.id}
                      className="block cursor-pointer px-2 py-1 text-accent-600 hover:bg-blue-300 hover:text-white dark:text-gray-300 tablet:px-4 tablet:py-2"
                      onClick={() => {
                        showToast('warning', 'cantHideLastTwoOptions');
                        toggleDropdown();
                      }}
                    >
                      {item.name}
                    </li>
                  )
                )
              : questStartData?.QuestAnswers.map((post: PostAnswer) => (
                  <li
                    key={post.id}
                    className="block cursor-pointer px-2 py-1 text-accent-600 hover:bg-blue-300 hover:text-white dark:text-gray-300 tablet:px-4 tablet:py-2"
                    onClick={() => {
                      if (questStartData?.QuestAnswers.length <= 2 && !update) {
                        showToast('warning', 'cantHideLastTwoOptions');
                      } else {
                        setSelectedOptions([post.question]);
                      }
                      toggleDropdown();
                    }}
                  >
                    {post.question}
                  </li>
                ))}
          </ul>
        )}
      </div>
      <div className="mt-2 flex w-full justify-end tablet:mt-4">
        <Button
          className=""
          variant={
            (questStartData?.QuestAnswers.length <= 2 && !update) || selectedOptions.length <= 0
              ? 'submit-hollow'
              : 'submit'
          }
          disabled={(questStartData?.QuestAnswers.length <= 2 && !update) || selectedOptions.length <= 0 || isPending}
          rounded={false}
          onClick={() => {
            handleAnalyzePost({
              userUuid: persistedUserInfo.uuid,
              questForeignKey: questStartData._id,
              hiddenOptionsArray: selectedOptions,
              id: update ? selectedItem?._id : null,
              order: update ? selectedItem?.order : null,
              actionType: 'create',
            } as any);
          }}
        >
          {isPending === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Hide'}
        </Button>
      </div>
    </div>
  );
}
