import { useSelector } from 'react-redux';
import { Tooltip } from '../../../../../utils/Tooltip';

const MultipleChoiceOptions = ({
  title,
  answer,
  options,
  label,
  trash,
  dragable,
  handleOptionChange,
  handleOptionSelect,
  allowInput,
  handleChange,
  typedValue,
  isSelected,
  optionsCount,
  removeOption,
  number,
  answerVerification,
  optionStatus,
}) => {
  const persistedTheme = useSelector((state) => state.utils.theme);

  return (
    <div
      className={`${
        label ? 'flex flex-col gap-[13px]' : 'flex flex-row items-center gap-[25px]'
      } ml-[21px] mr-[22.4px] tablet:ml-[51px] tablet:mr-[71px]`}
    >
      {!allowInput ? (
        <div className="flex w-full justify-between rounded-[10px] bg-white dark:bg-[#0D1012]">
          <div className="flex w-full items-center">
            <div className="flex h-full w-[14.7px] items-center justify-center rounded-l-[5.387px] bg-white-500 px-[7px] py-[6px] dark:bg-[#9E9E9E] tablet:w-[38px] tablet:rounded-l-[10px] tablet:pb-[13px] tablet:pt-[14px]">
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
            <div className="flex h-[22.5px] w-full items-center justify-between rounded-r-[4.89px] border-b-[1px] border-r-[1px] border-t-[1px] border-[#ACACAC] tablet:h-[46.4px] tablet:rounded-r-[11.284px] laptop:h-[75px] laptop:rounded-r-2xl">
              <h1 className="w-full pl-[15.44px] text-[10px] font-normal leading-normal text-[#435059] dark:text-[#D3D3D3] tablet:pl-[45px] tablet:text-[20.7px] laptop:text-[30px]">
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
        <div className="flex items-center">
          <div className="flex h-[24.8px] w-[13.46px] items-center justify-center rounded-l-[5.387px] bg-white-500 px-[7px] dark:bg-[#9E9E9E] tablet:mt-0 tablet:h-[49.6px] tablet:w-[28.2px] tablet:rounded-l-[10.3px] tablet:pb-[13px] tablet:pt-[14px] laptop:h-[74px] laptop:w-[40px]">
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
          <div className="relative w-full">
            <div className="flex w-full">
              <input
                className="dark:text-gray-1 w-full border-y-[1px] border-[#ACACAC] bg-white px-[9.24px] py-[0.35rem] text-[0.625rem] font-normal leading-[1] text-black focus-visible:outline-none tablet:px-11 tablet:py-[11.6px] tablet:text-[1.296rem] laptop:py-[18px] laptop:text-[1.875rem]"
                onChange={(e) => handleChange(e.target.value)}
                onBlur={(e) => e.target.value.trim() !== '' && answerVerification(e.target.value.trim())}
                value={typedValue}
              />
              {title === 'MultipleChoice' && trash && (
                <button
                  id={`test${number}`}
                  className={`border-y-[1px] border-[#ACACAC] bg-white text-[0.5rem] font-semibold dark:border-[#222325] tablet:text-[17.54px] laptop:text-[1.875rem] ${optionStatus?.color} py-[0.29rem]`}
                >
                  <div className="pr-[1.25rem] tablet:pr-[2.4rem]">
                    <>
                      {optionsCount > 2 && (
                        <div
                          onClick={() => {
                            removeOption(number);
                          }}
                        >
                          <img
                            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/trash2.svg`}
                            alt="trash"
                            className="min-w-[.6rem] cursor-pointer tablet:min-w-[1.5rem]"
                          />
                        </div>
                      )}
                    </>
                  </div>
                </button>
              )}

              <button
                id={`test${number}`}
                className={`relative rounded-r-[0.33rem] border-y-[1px] border-r-[1px] border-[#ACACAC] bg-white text-[0.5rem] font-semibold dark:border-[#222325] tablet:rounded-r-[10.3px] tablet:text-[17.54px] laptop:rounded-r-2xl laptop:text-[1.875rem] ${optionStatus.color} py-[0.29rem]`}
              >
                <div className="border-l-[0.7px] px-[1.25rem] tablet:px-[2.4rem]">{optionStatus?.name}</div>
                <Tooltip optionStatus={optionStatus} />
              </button>
            </div>
            <div className="absolute right-[60px] top-1/2 flex -translate-y-1/2 transform items-center">
              {options && (
                <div id="green-checkbox" className="-mb-[7px] mr-6">
                  <input
                    id="default-checkbox"
                    type="checkbox"
                    className="h-10 w-[38px] rounded"
                    onChange={handleOptionSelect}
                    checked={isSelected}
                  />
                </div>
              )}

              {title === 'RankChoice' && trash ? (
                <>
                  {optionsCount > 0 && (
                    <div
                      onClick={() => {
                        removeOption(number);
                      }}
                    >
                      <img
                        src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/trash2.svg`}
                        alt="trash"
                        className="h-[13.2px] cursor-pointer tablet:h-[36px]"
                      />
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceOptions;
