const YesNoOptions = ({ answer }) => {
  return (
    <div className="flex flex-row items-center gap-[25px]">
      <div className="flex w-full justify-between rounded-[10px] bg-white dark:bg-accent-100">
        <div className="flex w-full items-center">
          <div className="flex h-full w-[12.28px] min-w-[12.28px] items-center justify-center rounded-l-[5.387px] border-y border-s border-white-500 bg-white-500 px-[0px] py-[6px] dark:border-gray-100 dark:bg-gray-100 tablet:w-[23.5px] tablet:rounded-l-[10px] tablet:border-y-[3px] tablet:border-s-[3px] tablet:pb-[13px] tablet:pt-[14px] laptop:w-[25.2px] laptop:min-w-[25.2px]"></div>
          <div className="flex h-[27px] w-full items-center justify-between rounded-r-[4.89px] border-y border-r border-white-500 dark:border-gray-100 tablet:h-[51px] tablet:rounded-r-[10px] tablet:border-y-[3px] tablet:border-r-[3px]">
            <h1 className="text-gray-1 w-full pl-2 text-[0.625rem] font-normal leading-normal dark:text-white-600 tablet:pl-5 tablet:text-[20.7px] laptop:text-[18px]">
              {answer}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YesNoOptions;
