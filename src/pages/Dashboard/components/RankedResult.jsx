import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import DeleteOption from './DeleteOption';
import EditNewOption from './EditNewOption';
import BasicModal from '../../../components/BasicModal';
import ContentionIcon from '../../../assets/Quests/ContentionIcon';

const RankedResult = (props) => {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [checkState, setCheckState] = useState(props.contend);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const originalOrder = Object.values(props.originalOrder?.length >= 1 ? props?.originalOrder[0] : {});

  const handleEditOpen = () => setEditModal(true);
  const handleEditClose = () => setEditModal(false);
  const handleDeleteOpen = () => setDeleteModal(true);
  const handleDeleteClose = () => setDeleteModal(false);

  useEffect(() => {
    setCheckState(props.contend);
  }, [props.contend]);

  return (
    <div
      className={`${props.postProperties === 'Embed' && !props.isEmbedResults ? 'px-7 tablet:px-[69px]' : 'pl-7 pr-12 tablet:pl-[69px] tablet:pr-[6.3rem]'} flex items-center`}
    >
      <div className="relative flex w-full justify-between rounded-r-[4.73px] rounded-s-[5.387px] border-l-0 border-r border-white-500 bg-white dark:border-gray-100 dark:bg-accent-100 tablet:rounded-r-[10px] tablet:rounded-s-[10px] tablet:border-r-[3px]">
        {/* To Display Badges on Left of Option */}
        {props.addedAnswerUuid &&
          (props.addedAnswerUuid === persistedUserInfo?.uuid ||
          props.addedAnswerUuid === localStorage.getItem('uId') ? (
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/optionMeBadge.svg`}
              alt="yellow-badge"
              className="absolute -left-4 top-1/2 h-4 w-[12px] -translate-y-1/2 tablet:-left-8 tablet:h-[27px] tablet:w-[21px]"
            />
          ) : null)}
        {/* To Display Contention and Trash Right of Option */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 text-[9.238px] tablet:text-[16px] ${props.postProperties !== 'sharedlink-results' && props.btnText === 'Results' ? '-right-[37px] tablet:-right-[75px]' : '-right-9 tablet:-right-14'}`}
        >
          {((props.isEmbedResults && props.postProperties === 'Embed') || props.postProperties !== 'Embed') && (
            <>
              {props.btnText === 'Results' ? (
                <>
                  {props.contendPercentages &&
                  props.contendPercentages?.[props.answer.trim()] &&
                  props.contendPercentages?.[props.answer.trim()] !== '0%' ? (
                    <div className="flex items-center gap-1 tablet:gap-[10px]">
                      {props?.postProperties !== 'sharedlink-results' && (
                        <ContentionIcon
                          classNames="w-[2.578px] h-[10.313px] tablet:w-[5px] tablet:h-5"
                          checked={checkState}
                        />
                      )}
                      <span className="w-[4ch] whitespace-nowrap text-black dark:text-white">
                        {props.contendPercentages[props.answer.trim()]}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 tablet:gap-[10px]">
                      {props?.postProperties !== 'sharedlink-results' && (
                        <ContentionIcon
                          classNames="w-[2.578px] h-[10.313px] tablet:w-[5px] tablet:h-5"
                          checked={false}
                        />
                      )}
                      <span className="w-[4ch] whitespace-nowrap text-black dark:text-white">0%</span>
                    </div>
                  )}
                </>
              ) : null}
            </>
          )}
        </div>
        {/* Options */}
        <div className="flex w-full items-center">
          <div className="flex h-full min-h-[24px] w-3 min-w-[12.5px] items-center justify-center rounded-l-[5.387px] bg-white-500 dark:bg-gray-100 tablet:min-h-[43px] tablet:w-[27px] tablet:rounded-l-[10px] laptop:w-[25px] laptop:min-w-[25px]">
            &#x200B;
          </div>
          {props.btnText !== 'Results' && (
            <div className="h-full w-fit rounded-l-[10px] bg-white-500 px-[7px] pb-[13px] pt-[14px] dark:bg-accent-500">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/${persistedTheme === 'dark' ? 'six-dots-dark.svg' : 'six-dots.svg'}`}
                alt="six dots"
              />
            </div>
          )}
          <div className="relative flex w-full justify-between">
            {((props.isEmbedResults && props.postProperties === 'Embed') || props.postProperties !== 'Embed') && (
              <div
                className="absolute top-0 block h-[5px] bg-green-100 tablet:h-[10px]"
                style={{
                  width: props?.selectedPercentages && props?.selectedPercentages[props?.answer.trim()],
                }}
              />
            )}
            <h1 className="w-full border-y border-white-500 px-2 py-[6px] text-[8.5px] font-normal leading-[10px] text-accent-600 dark:border-gray-100 dark:text-white-600 tablet:border-y-[3px] tablet:py-3 tablet:pl-[18px] tablet:pr-5 tablet:text-[19px] tablet:leading-none laptop:pr-[34px]">
              {props.answer}
            </h1>
            <div className="flex items-center gap-[19px]">
              {props.editable ? (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/edit.svg`}
                  className="h-[19px] w-4 cursor-pointer"
                  onClick={handleEditOpen}
                />
              ) : null}
              {props.deleteable ? (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/trash.svg`}
                  className="h-[19px] w-4 cursor-pointer"
                  onClick={handleDeleteOpen}
                />
              ) : null}
            </div>
            <BasicModal open={editModal} handleClose={handleEditClose}>
              <EditNewOption
                answer={props.answer}
                answersSelection={props.answersSelection}
                setAnswerSelection={props.setAnswerSelection}
                handleEditClose={handleEditClose}
              />
            </BasicModal>
            <BasicModal open={deleteModal} handleClose={handleDeleteClose}>
              <DeleteOption
                answer={props.answer}
                answersSelection={props.answersSelection}
                setAnswerSelection={props.setAnswerSelection}
                handleDeleteClose={handleDeleteClose}
                handleEditClose={handleEditClose}
                setAddOptionLimit={props.setAddOptionLimit}
              />
            </BasicModal>

            {((props.isEmbedResults && props.postProperties === 'Embed') || props.postProperties !== 'Embed') && (
              <div
                className={`absolute bottom-0 block h-[5px] bg-[#FDD503B2] tablet:h-[10px]`}
                style={{
                  width:
                    props.contendPercentages &&
                    props.contendPercentages?.[props.answer.trim()] &&
                    props.contendPercentages?.[props.answer.trim()] !== '0%'
                      ? props.contendPercentages[props.answer.trim()]
                      : '0%',
                }}
              />
            )}
          </div>
        </div>
        {/* to show rank number */}
        <div className="flex items-center gap-[19px] rounded-e-[5.387px] border-y border-white-500 pr-[10.63px] text-[9.238px] dark:border-gray-100 tablet:border-y-[3px] tablet:pr-[11px] tablet:text-[16px]">
          {props.btnText === 'Results' ? (
            <>
              {props?.selectedPercentages && props.selectedPercentages[props.answer.trim()] ? (
                <div className="flex items-center gap-[10px]">
                  <h1 className="text-[8.52px] font-bold leading-[0px] text-[#22AA69] tablet:text-[19px]">
                    {originalOrder.indexOf(props?.selectedPercentages[props?.answer.trim()]) + 1}
                  </h1>
                  {((props.isEmbedResults && props.postProperties === 'Embed') || props.postProperties !== 'Embed') && (
                    <span className="w-[4ch] whitespace-nowrap text-black dark:text-white">
                      {props?.selectedPercentages[props?.answer.trim()]}
                    </span>
                  )}
                </div>
              ) : (
                <>
                  {((props.isEmbedResults && props.postProperties === 'Embed') || props.postProperties !== 'Embed') && (
                    <span className="w-[4ch] whitespace-nowrap text-black dark:text-white">0%</span>
                  )}
                </>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default RankedResult;
