import { FaSpinner } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const FeedEndStatus = ({
  isFetching,
  searchData,
  data,
  noMatchText,
  clearSearchText,
  noDataText,
  noMoreDataText,
  clearSearchAction,
}) => {
  const persistedTheme = useSelector((state) => state.utils.theme);

  return (
    <div className="flex flex-col justify-center gap-4 px-4 pb-8 pt-3 text-gray-1 tablet:mb-[27px] tablet:py-[27px]">
      {isFetching ? (
        <div className="flex items-center justify-center">
          <FaSpinner className="animate-spin text-[10vw] text-blue-100 tablet:text-[4vw]" />
        </div>
      ) : searchData && (data.pages.length === 0 || data?.pages[0].length) === 0 ? (
        <div className="my-[15vh] flex flex-col items-center justify-center">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/error-bot.svg' : 'assets/svgs/dashboard/noMatchingLight.svg'}`}
            alt="no posts image"
            className="h-[173px] w-[160px]"
          />
          <div className="flex flex-col items-center gap-[10px] tablet:gap-4">
            <p className="font-inter mt-[1.319vw] text-center text-[5.083vw] font-bold tablet:text-[2.083vw]">
              {noMatchText}
            </p>
            <button
              className={`${
                persistedTheme === 'dark' ? 'bg-[#333B46]' : 'bg-gradient-to-r from-blue-500 to-blue-100'
              } inset-0 w-fit rounded-[0.375rem] px-[0.56rem] py-[0.35rem] text-[0.625rem] font-semibold leading-[1.032] text-white shadow-inner dark:text-[#EAEAEA] tablet:pt-2 tablet:text-[15px] tablet:leading-normal laptop:w-[192px] laptop:rounded-[0.938rem] laptop:px-5 laptop:py-2 laptop:text-[1.25rem]`}
              onClick={clearSearchAction}
            >
              {clearSearchText}
            </button>
          </div>
        </div>
      ) : !searchData && data?.pages[0].length === 0 ? (
        <p className="text-center text-[4vw] laptop:text-[2vw]">
          <b>{noDataText}</b>
        </p>
      ) : !searchData && data?.pages[0].length !== 0 ? (
        <p className="text-center text-[4vw] laptop:text-[2vw]">
          <b>{noMoreDataText}</b>
        </p>
      ) : (
        <div className="flex flex-col items-center gap-[10px] tablet:gap-4">
          <p className="font-inter mt-[1.319vw] text-center text-[5.083vw] font-bold tablet:text-[2.083vw]">
            You are all caught up!
          </p>
          <button
            className={`${
              persistedTheme === 'dark' ? 'bg-[#333B46]' : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
            } inset-0 w-fit rounded-[0.375rem] px-[0.56rem] py-[0.35rem] text-[0.625rem] font-semibold leading-[1.032] text-white shadow-inner dark:text-[#EAEAEA] tablet:pt-2 tablet:text-[15px] tablet:leading-normal laptop:w-[192px] laptop:rounded-[0.938rem] laptop:px-5 laptop:py-2 laptop:text-[1.25rem]`}
            onClick={clearSearchAction}
          >
            {clearSearchText}
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedEndStatus;
