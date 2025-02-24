import { useState } from 'react';
import { useSelector } from 'react-redux';
import { comparisonOperators } from '../../../constants/advanceAnalytics';
import AnalyzeDialogueBox from '../../../components/dialogue-boxes/AnalyzeDialogueBox';
import DeleteAnalyzeHiddenOption from '../../../components/dialogue-boxes/DeleteAnalyzeHiddenOption';
import { camelCaseToReadable } from '../../../utils/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function AnalyticResults({ item, questStartData }: any) {
  const persistedTheme = useSelector((state: any) => state.utils.theme);
  const [analyzePopup, setAnalyzePopup] = useState(false);
  const [deleteConfirmPopup, setDeleteConfirmPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleAnalyzeClose = () => setAnalyzePopup(false);
  const handleDeleteConfirmClose = () => setDeleteConfirmPopup(false);

  const findOperatorName = (id: number) => {
    return comparisonOperators.find((operator) => operator.id === id)?.name || 'Unknown Operator';
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="flex tablet:mx-[36px]">
      <div
        className={`${isDragging ? 'border-blue-300' : 'border-white-500 dark:border-gray-100'} flex min-h-full w-[12.3px] min-w-[12.3px] items-center justify-center rounded-l-[4.734px] border-y border-l bg-white-500 dark:bg-gray-100 tablet:w-[25px] tablet:min-w-[25px] tablet:rounded-l-[10px] tablet:border-y-[3px] tablet:border-l-[3px]`}
      >
        <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/${persistedTheme === 'dark' ? 'six-dots-dark.svg' : 'six-dots.svg'}`}
          alt="six-dots"
          className="w-[5.2px] tablet:w-[11.2px]"
        />
      </div>
      <div
        className={`${isDragging ? 'border-blue-300' : 'border-white-500 dark:border-gray-100'} tablet:rounded-y-[16.068px] rounded-y-[6.683px] flex w-full items-center gap-[6.24px] rounded-r-[6.683px] border-y-[1.248px] border-r-[1.248px] p-[6.24px] text-accent-600 dark:text-gray-300 tablet:gap-[15px] tablet:rounded-r-[16.068px] tablet:border-y-[3px] tablet:border-r-[3px] tablet:px-3 tablet:py-3`}
      >
        <div className="w-fit min-w-[76px] max-w-[76px] rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] dark:border-gray-100 tablet:min-w-[150px] tablet:max-w-[150px] tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-3 tablet:py-3">
          <h1 className="whitespace-nowrap text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">
            {item.type === 'target'
              ? 'Target Option'
              : item.type === 'badgeCount'
                ? 'Badge Count'
                : item.type === 'activity'
                  ? 'Activity'
                  : 'Hide Option'}
          </h1>
        </div>

        {item.type === 'hide' && (
          <div className="w-full rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] dark:border-gray-100 tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-3 tablet:py-3">
            <h1 className="text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">
              {item.hiddenOptionsArray[0]}
            </h1>
          </div>
        )}

        {item.type === 'badgeCount' && (
          <>
            <div className="w-full rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] dark:border-gray-100 tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-3 tablet:py-3">
              <h1 className="text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">
                {findOperatorName(item.oprend)}
              </h1>
            </div>
            <div className="w-fit rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] dark:border-gray-100 tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-3 tablet:py-3">
              <h1 className="text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">
                {item.range}
              </h1>
            </div>
          </>
        )}

        {item.type === 'target' && (
          <div className="w-full rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] dark:border-gray-100 tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-3 tablet:py-3">
            <h1 className="text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">
              {item?.targetedOptionsArray[0]}
            </h1>
          </div>
        )}

        {item.type === 'activity' && (
          <>
            {item?.allParams.subtype === 'twitter' ? (
              <>
                <div className="w-fit rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] dark:border-gray-100 tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-3 tablet:py-3">
                  <h1 className="text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">
                    Twitter
                  </h1>
                </div>
                <div className="w-full rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] dark:border-gray-100 tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-3 tablet:py-3">
                  <h1 className="text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">
                    {item.allParams.name}
                  </h1>
                </div>
                <div className="w-fit rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] dark:border-gray-100 tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-3 tablet:py-3">
                  <h1 className="text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">
                    {item.allParams.followers}
                  </h1>
                </div>
              </>
            ) : item?.allParams.subtype === 'dateOfBirth' ? (
              <>
                <div className="w-fit rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] dark:border-gray-100 tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-3 tablet:py-3">
                  <h1 className="text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">
                    DOB
                  </h1>
                </div>
                <div className="w-fit rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] dark:border-gray-100 tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-3 tablet:py-3">
                  <h1 className="whitespace-nowrap text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">
                    {item.allParams.from}
                  </h1>
                </div>
                <div className="w-full rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] dark:border-gray-100 tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-3 tablet:py-3">
                  <h1 className="text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">
                    {item.allParams.to}
                  </h1>
                </div>
              </>
            ) : item?.allParams.subtype === 'currentCity' ? (
              <>
                <div className="w-fit rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] dark:border-gray-100 tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-3 tablet:py-3">
                  <h1 className="whitespace-nowrap text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">
                    Current City
                  </h1>
                </div>
                <div className="w-full rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] dark:border-gray-100 tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-3 tablet:py-3">
                  <h1 className="text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">
                    {item.allParams.currentCity}
                  </h1>
                </div>
              </>
            ) : item?.allParams.subtype === 'homeTown' ? (
              <>
                <div className="w-fit rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] dark:border-gray-100 tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-3 tablet:py-3">
                  <h1 className="text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">
                    Hometown
                  </h1>
                </div>
                <div className="w-full rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] dark:border-gray-100 tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-3 tablet:py-3">
                  <h1 className="text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">
                    {item.allParams.homeTown}
                  </h1>
                </div>
              </>
            ) : item?.allParams.subtype === 'relationship' ? (
              <>
                <div className="w-fit rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] dark:border-gray-100 tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-3 tablet:py-3">
                  <h1 className="text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">
                    Relationship
                  </h1>
                </div>
                <div className="w-full rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] dark:border-gray-100 tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-3 tablet:py-3">
                  <h1 className="text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">
                    {item.allParams.relationshipStatus}
                  </h1>
                </div>
              </>
            ) : item?.allParams.subtype === 'work' ? (
              <>
                <div className="w-fit rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] dark:border-gray-100 tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-3 tablet:py-3">
                  <h1 className="text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">
                    Work
                  </h1>
                </div>
                <div className="w-full rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] dark:border-gray-100 tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-3 tablet:py-3">
                  <h1 className="text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">
                    {camelCaseToReadable(item.allParams.fieldName)}
                  </h1>
                </div>
                <div className="w-full rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] dark:border-gray-100 tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-3 tablet:py-3">
                  <h1 className="text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">
                    {item.allParams.fieldValue}
                  </h1>
                </div>
              </>
            ) : item?.allParams.subtype === 'education' ? (
              <>
                <div className="w-fit rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] dark:border-gray-100 tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-3 tablet:py-3">
                  <h1 className="text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">
                    Education
                  </h1>
                </div>
                <div className="w-full rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] dark:border-gray-100 tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-3 tablet:py-3">
                  <h1 className="text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">
                    {camelCaseToReadable(item.allParams.fieldName)}
                  </h1>
                </div>
                <div className="w-full rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] dark:border-gray-100 tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-3 tablet:py-3">
                  <h1 className="break-words text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">
                    {item.allParams.fieldValue}
                  </h1>
                </div>
              </>
            ) : item?.allParams.subtype === 'sex' ? (
              <>
                <div className="w-fit rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] dark:border-gray-100 tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-3 tablet:py-3">
                  <h1 className="text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">
                    Sex
                  </h1>
                </div>
                <div className="w-full rounded-[6.683px] border-[1.248px] border-white-500 p-[6px] dark:border-gray-100 tablet:rounded-[9.23px] tablet:border-[3px] tablet:px-3 tablet:py-3">
                  <h1 className="text-[10px] font-medium leading-[10px] tablet:text-[18px] tablet:leading-[18px]">
                    {item.allParams.sex}
                  </h1>
                </div>
              </>
            ) : null}
          </>
        )}

        <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/edit.svg' : 'assets/svgs/edit.svg'}`}
          alt="trash"
          className="size-[12.47px] cursor-pointer tablet:h-[30px] tablet:w-[25px]"
          onClick={() => {
            setAnalyzePopup(true);
            setSelectedItem(item);
          }}
        />
        <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/trash.svg' : 'assets/svgs/dashboard/trash2.svg'}`}
          alt="trash"
          className="h-[12.47px] w-[9px] cursor-pointer tablet:h-[30px] tablet:w-[25px]"
          onClick={() => {
            setDeleteConfirmPopup(true);
            setSelectedItem(item);
          }}
        />
      </div>

      {analyzePopup && (
        <AnalyzeDialogueBox
          handleClose={handleAnalyzeClose}
          modalVisible={analyzePopup}
          title={'Analyze'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/analyze-dialogbox.svg`}
          questStartData={questStartData}
          update={true}
          selectedItem={selectedItem}
        />
      )}
      {deleteConfirmPopup && (
        <DeleteAnalyzeHiddenOption
          handleClose={handleDeleteConfirmClose}
          modalVisible={deleteConfirmPopup}
          title={'Delete Option'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/hiddenposts/unhide/delIcon.svg`}
          questStartData={questStartData}
          type="hideOption"
          selectedItem={selectedItem}
        />
      )}
    </div>
  );
}
