import { useSelector } from 'react-redux';
import { Tooltip } from '../../../../../utils/Tooltip';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TextareaAutosize } from '@mui/material';

const Options = ({
  id,
  title,
  answer,
  options,
  label,
  trash,
  dragable,
  handleOptionChange,
  allowInput,
  handleChange,
  typedValue,
  isSelected,
  optionsCount,
  removeOption,
  number,
  answerVerification,
  optionStatus,
  handleTab,
  isTyping,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  const persistedTheme = useSelector((state) => state.utils.theme);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${label ? 'flex flex-col gap-[13px]' : 'flex flex-row items-center gap-[25px]'} cursor-grab`}
    >
      {!allowInput ? (
        <div className="flex w-full justify-between rounded-[10px] bg-white dark:bg-[#0D1012]">
          <div className="flex w-full items-center">
            <div className="flex h-full w-[38px] items-center justify-center rounded-l-[10px] bg-white-500 px-[7px] pb-[13px] pt-[14px] dark:bg-[#9E9E9E]">
              {dragable ? (
                persistedTheme === 'dark' ? (
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/six-dots-dark.svg`}
                    alt="six dots"
                    className="h-7"
                  />
                ) : (
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/six-dots.svg`}
                    alt="six dots"
                    className="h-7"
                  />
                )
              ) : null}
            </div>
            <div className="flex w-full items-center justify-between pr-[45px]">
              <h1 className="py-[18px] pl-[45px] text-[30px] font-normal leading-normal text-[#435059] dark:text-[#D3D3D3]">
                {answer}
              </h1>
              <div className="flex gap-[55px]">
                {options && (
                  <div id="green-checkbox">
                    <input
                      id="default-checkbox"
                      type="checkbox"
                      className="h-10 w-10 rounded"
                      onChange={handleOptionChange}
                      checked={isSelected}
                    />
                  </div>
                )}
                {trash && (
                  <img src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/trash2.svg`} alt="trash" />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="flex w-full items-center justify-center">
            <div className="flex w-full rounded-r-[0.33rem] bg-transparent tablet:w-full tablet:rounded-[10.3px] laptop:rounded-[10px]">
              <div
                className={`${
                  isDragging ? 'border-blue-300' : 'border-white-500 dark:border-gray-100'
                } dragIconWrapper border-y border-s tablet:border-y-[3px] tablet:border-s-[3px]`}
              >
                {persistedTheme === 'dark' ? (
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/six-dots-dark.svg`}
                    alt="six dots"
                    className="h-[8.8px] tablet:h-[18px]"
                  />
                ) : (
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/six-dots.svg`}
                    alt="six dots"
                    className="h-[8.8px] tablet:h-[18px]"
                  />
                )}
              </div>
              <div
                className={`${
                  isDragging
                    ? 'border-blue-300 bg-[#F2F6FF] dark:bg-accent-100'
                    : 'border-white-500 bg-white dark:border-gray-100 dark:bg-accent-100'
                } w-2 min-w-2 border-y tablet:w-5 tablet:min-w-5 tablet:border-y-[3px]`}
              ></div>
              <TextareaAutosize
                id={`input-${number}`}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={(e) => e.target.value.trim() !== '' && answerVerification(e.target.value)}
                value={typedValue}
                tabIndex={number + 2}
                autoFocus={number >= 5 ? true : false}
                onKeyDown={(e) =>
                  (e.key === 'Tab' && handleTab(number)) || (e.key === 'Enter' && handleTab(number, 'Enter'))
                }
                className={`${
                  isDragging
                    ? 'border-blue-300 bg-[#F2F6FF] dark:bg-accent-100'
                    : 'border-white-500 bg-white dark:border-gray-100 dark:bg-accent-100'
                } text-gray-1 box-border flex w-full resize-none items-center border-y py-[7px] pr-2 text-[0.625rem] font-normal leading-[0.625rem] focus-visible:outline-none dark:text-gray-300 tablet:h-[51px] tablet:border-y-[3px] tablet:py-[11px] tablet:text-[1.296rem] tablet:leading-[23px] laptop:h-[45px] laptop:text-[18px]`}
              />
              <div
                id={`test${number}`}
                className={`${
                  isDragging
                    ? 'border-blue-300 bg-[#F2F6FF] dark:bg-accent-100'
                    : 'border-white-500 bg-white dark:border-gray-100 dark:bg-accent-100'
                } relative flex items-center rounded-r-[0.33rem] border-y border-r text-[0.5rem] font-semibold leading-none tablet:rounded-r-[10.3px] tablet:border-y-[3px] tablet:border-r-[3px] tablet:text-[1rem] laptop:rounded-r-[10px] laptop:text-[1.25rem] ${
                  optionStatus.color
                }`}
              >
                <div className="flex h-[75%] w-[50px] items-center justify-center border-l border-white-500 dark:border-gray-100 tablet:w-[99.58px] tablet:border-l-[3px] laptop:w-[134px]">
                  <span> {isTyping ? `${typedValue.length}/200` : optionStatus.name} </span>
                </div>
                <Tooltip optionStatus={optionStatus} id={`input-${number}`} />
              </div>
              {(title === 'RankChoice' || title === 'MultipleChoice' || title === 'OpenChoice') && trash && (
                <div
                  id={`test${number}`}
                  className={`flex h-[24.8px] items-center text-[0.5rem] font-semibold dark:bg-gray-200 xl:text-[1.875rem] tablet:h-[50.19px] tablet:text-[17.54px] laptop:h-[45px] ${optionStatus?.color} py-[0.29rem]`}
                >
                  <div className="flex w-5 items-center justify-center tablet:w-[52.78px]">
                    <>
                      {optionsCount > 2 && (
                        <div
                          onClick={() => {
                            removeOption(id, number);
                          }}
                        >
                          <img
                            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/trash2.svg`}
                            alt="trash"
                            className="h-3 w-[9px] cursor-pointer tablet:h-[33px] tablet:w-[25px]"
                          />
                        </div>
                      )}
                    </>
                  </div>
                </div>
              )}
            </div>

            <div
              className={`${
                optionsCount > 2
                  ? 'absolute left-[208px] tablet:left-[42rem]'
                  : 'absolute left-[221px] tablet:left-[24rem] laptop:left-[44rem]'
              } -top-[22px] flex w-fit items-center tablet:-top-[46px] laptop:-top-[74px]`}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Options;
