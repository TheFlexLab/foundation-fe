import { useState, useEffect } from 'react';
import * as createQuestAction from '../features/createQuest/createQuestSlice';
import { useDispatch } from 'react-redux';

export const Tooltip = ({ optionStatus, id, type }) => {
  const dispatch = useDispatch();
  const [tooltipStatus, setTooltipStatusState] = useState(optionStatus);

  useEffect(() => {
    setTooltipStatusState(optionStatus);
  }, [optionStatus]);

  const hideTooltipMsg = () => {
    dispatch(createQuestAction.hideToolTipMessage({ id, type }));
  };

  return (
    <>
      {tooltipStatus?.showToolTipMsg && (
        <>
          {tooltipStatus?.name === 'Rejected' && (
            <div
              className={`absolute w-32 sm:w-[186px] md:w-52 xl:w-48 ${
                tooltipStatus?.duplication ? '-top-[31px]' : '-top-[50px] tablet:-top-[110px] laptop:-top-[124px]'
              } left-0 -translate-x-1/2 transform tablet:-left-[12px] laptop:left-1/2 ${
                tooltipStatus?.duplication ? 'tablet:-top-[100px]' : 'tablet:-top-[116px]'
              }`}
            >
              <div className="relative mx-2 flex flex-col items-end text-center">
                <div
                  className="relative -right-[7px] top-[10px] rounded-full bg-[#F34141] p-[2px] tablet:-right-4 tablet:top-[18px] tablet:p-2"
                  onClick={() => {
                    setTooltipStatusState('');
                    hideTooltipMsg();
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-[15px] w-[15px] text-white tablet:h-4 tablet:w-4 laptop:h-6 laptop:w-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <div className="bottom-full right-0 w-[11rem] rounded-md border-[0.533px] bg-[#FEDEDE] px-[0.32rem] py-[0.2rem] text-[0.5rem] font-normal text-[#F34141] dark:bg-[#3C1A20] dark:text-[#DB6262] tablet:w-[28rem] tablet:rounded-[15px] tablet:py-[18px] tablet:text-[1rem]">
                  {tooltipStatus?.tooltipName}
                  <svg
                    className="absolute left-[27px] top-full -mt-[1px] h-2 w-full text-[#FEDEDE] dark:text-[#3C1A20] tablet:left-[65px] tablet:h-[28px] laptop:left-[0px]"
                    x="0px"
                    y="0px"
                    viewBox="0 0 255 255"
                    xmlSpace="preserve"
                  >
                    <polygon
                      className="fill-current"
                      points="0,0 127.5,127.5 255,0"
                      stroke="#F34141"
                      strokeWidth="10"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}
          {tooltipStatus?.name === 'Duplicate' && (
            <div
              className={`absolute w-32 sm:w-[186px] md:w-52 xl:w-48 ${
                tooltipStatus?.duplication ? '-top-[31px]' : '-top-[55px]'
              } left-0 -translate-x-1/2 transform tablet:-left-[12px] laptop:left-1/2 ${
                tooltipStatus?.duplication ? 'tablet:-top-[100px]' : 'tablet:-top-[127px]'
              }`}
            >
              <div className="relative mx-2 flex flex-col items-end text-center">
                <div
                  className="relative -right-[7px] top-[10px] rounded-full bg-[#C89E0A] p-[2px] tablet:-right-4 tablet:top-[18px] tablet:p-2"
                  onClick={() => {
                    setTooltipStatusState('');
                    hideTooltipMsg();
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-[15px] text-white tablet:h-4 tablet:w-4 laptop:h-6 laptop:w-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <div className="bottom-full right-0 w-fit rounded-md border-[0.533px] bg-[#FCF324] px-4 py-[0.2rem] text-[0.5rem] font-normal text-[#9B7A06] dark:bg-[#FCF324] dark:text-[#9B7A06] tablet:rounded-[15px] tablet:py-[18px] tablet:text-[1rem]">
                  <div
                    className="tooltip-name"
                    style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {tooltipStatus?.tooltipName}
                  </div>
                  <svg
                    className="absolute left-[27px] top-full -mt-[1px] h-2 w-full text-[#FCF324] dark:text-[#FCF324] tablet:left-[65px] tablet:h-[28px] laptop:left-[0px]"
                    x="0px"
                    y="0px"
                    viewBox="0 0 255 255"
                    xmlSpace="preserve"
                  >
                    <polygon
                      className="fill-current"
                      points="0,0 127.5,127.5 255,0"
                      stroke="#9B7A06"
                      strokeWidth="10"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};
