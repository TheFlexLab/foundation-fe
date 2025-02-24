import { GrClose } from 'react-icons/gr';
import { useSelector, useDispatch } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from '../../../../../utils/useDebounce';
import { setAreShareLinks } from '../../../../../features/quest/utilsSlice';
import { sharedLinksFilters, updateSharedLinkSearch } from '../../../../../features/profile/sharedLinks';
import ContentCard from '../../../../../components/ContentCard';
import FeedEndStatus from '../../../../../components/FeedEndStatus';
import useFetchSharedLinks from '../../../../../services/api/sharedLinks';
import QuestionCard from '../../QuestStartSection/components/QuestionCard';
import * as questUtilsActions from '../../../../../features/quest/utilsSlice';
import DisabledLinkPopup from '../../../../../components/dialogue-boxes/DisabledLinkPopup';
import QuestionCardWithToggle from '../../QuestStartSection/components/QuestionCardWithToggle';

export default function SharedLinks() {
  const { ref, inView } = useInView();
  const dispatch = useDispatch();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const questUtils = useSelector(questUtilsActions.getQuestUtils);
  const getSharedLinksFilters = useSelector(sharedLinksFilters);
  const [startTest, setStartTest] = useState(null);
  const [viewResult, setViewResult] = useState(null);
  const [sharedlinkSearch, setSharedlinkSearch] = useState('');

  const handleSharedLinkSearch = (e) => {
    setSharedlinkSearch(e.target.value);
  };

  const debouncedSharedSearch = useDebounce(sharedlinkSearch, 1000);

  useEffect(() => {
    dispatch(updateSharedLinkSearch(debouncedSharedSearch));
  }, [debouncedSharedSearch]);

  useEffect(() => {
    if (getSharedLinksFilters.searchData === '') {
      setSharedlinkSearch('');
    }
  }, [getSharedLinksFilters.searchData]);

  const memoizedStartTest = useCallback(
    (testId) => {
      setViewResult(null);
      setStartTest((prev) => (prev === testId ? null : testId));
    },
    [setViewResult, setStartTest]
  );

  const memoizedViewResults = useCallback(
    (testId) => {
      setStartTest(null);
      setViewResult((prev) => (prev === testId ? null : testId));
    },
    [setStartTest, setViewResult]
  );

  const showHidePostClose = () => {
    dispatch(questUtilsActions.updateDialogueBox({ type: null, status: false, link: null, id: null }));
  };

  const { data, status, error, fetchNextPage, hasNextPage, isFetching } = useFetchSharedLinks(
    getSharedLinksFilters.searchData,
    persistedUserInfo
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (status === 'error') {
    return <p>Error: {error.message}</p>;
  }

  const content = data?.pages.flatMap((posts) =>
    posts.map((post, index) => (
      <QuestionCardWithToggle
        key={post._id}
        innerRef={index === posts.length - 1 ? ref : null}
        questStartData={post}
        playing={post._id === questUtils.playerPlayingId && questUtils.isMediaPlaying}
        postProperties="SharedLinks"
        handleStartTest={memoizedStartTest}
        handleViewResults={memoizedViewResults}
        startTest={startTest}
        setStartTest={setStartTest}
        viewResult={viewResult}
      />
      // <QuestionCard
      //   key={post._id}
      //   questStartData={post}
      //   postProperties="SharedLinks"
      //   startTest={startTest}
      //   setStartTest={setStartTest}
      //   viewResult={viewResult}
      //   handleViewResults={memoizedViewResults}
      //   handleStartTest={memoizedStartTest}
      //   innerRef={index === posts.length - 1 ? ref : undefined}
      // />
    ))
  );

  useEffect(() => {
    if (data?.pages[0].length !== 0) {
      dispatch(setAreShareLinks(true));
    } else {
      dispatch(setAreShareLinks(false));
    }
  }, [data]);

  return (
    <div>
      {/* Shared Posts Insights */}
      <ContentCard icon="assets/summary/share-posts-logo.svg" title="Shared Posts">
        <h1 className="summary-text">
          Sharing posts helps broaden your reach. The more engagement your shares receive, the more FDX you earn. Shared
          posts are displayed on your Home Page for all to see.
        </h1>
        <div className="mt-3 flex items-center justify-center gap-2 tablet:mt-5 tablet:gap-6">
          <div className="max-w-28 border-r border-[#707175] pr-3 tablet:max-w-full tablet:pr-6">
            <h1 className="text-gray-1 text-center text-[12px] font-semibold leading-[116%] dark:text-gray-300 tablet:text-[16px] tablet:leading-normal">
              Posts you’ve shared
            </h1>
            <h5 className="text-gray-1 text-center text-[18px] font-normal dark:text-gray-300">
              {persistedUserInfo?.sharedQuestsStatistics.sharedQuests}
            </h5>
          </div>

          <div className="max-w-28 border-r border-[#707175] pr-3 tablet:max-w-full tablet:pr-6">
            <h1 className="text-gray-1 text-center text-[12px] font-semibold leading-[116%] dark:text-gray-300 tablet:text-[16px] tablet:leading-normal">
              Total post engagement
            </h1>
            <h5 className="text-gray-1 text-center text-[18px] font-normal dark:text-gray-300">
              {persistedUserInfo?.sharedQuestsStatistics.totalQuestsCompleted}
            </h5>
          </div>
          <div>
            <h1 className="text-gray-1 text-center text-[12px] font-semibold leading-[116%] dark:text-gray-300 tablet:text-[16px] tablet:leading-normal">
              Total views
            </h1>
            <h5 className="text-gray-1 text-center text-[18px] font-normal dark:text-gray-300">
              {persistedUserInfo?.sharedQuestsStatistics.totalQuestsImpression}
            </h5>
          </div>
        </div>
      </ContentCard>

      <div className="mx-[15px] my-2 mr-4 flex justify-end tablet:ml-[97px] tablet:mr-[70px] tablet:hidden">
        {/* <DisabledLinkPopup handleClose={showHidePostClose} modalVisible={questUtils.sharedQuestStatus.isDialogueBox} /> */}
        <div className="relative">
          <div className="relative h-[15.96px] w-[128px] tablet:h-[45px] tablet:w-[337px]">
            <input
              type="text"
              id="floating_outlined"
              className="peer block h-full w-full appearance-none rounded-[3.55px] border-[0.71px] border-[#707175] bg-transparent py-2 pl-2 pr-8 text-[6px] leading-[7.25px] text-[#707175] focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-100 dark:text-[#707175] dark:focus:border-blue-500 tablet:rounded-[10px] tablet:border-2 tablet:pl-5 tablet:text-[18.23px]"
              value={sharedlinkSearch}
              placeholder=""
              onChange={handleSharedLinkSearch}
            />
            <label
              htmlFor="floating_outlined"
              className="absolute left-[15px] start-1 top-[10px] z-10 origin-[0] -translate-y-4 scale-75 transform bg-[#F2F3F5] px-2 text-[8.33px] leading-[10px] text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-[#0A0A0C] peer-focus:dark:text-blue-500 tablet:top-2 tablet:text-[18px] tablet:leading-[21.78px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
            >
              Search
            </label>
            {getSharedLinksFilters.searchData && (
              <button
                className="absolute right-1.5 top-[55%] -translate-y-1/2 transform tablet:right-3 tablet:top-1/2"
                onClick={() => {
                  dispatch(updateSharedLinkSearch(''));
                }}
              >
                <GrClose className="h-2 w-2 text-[#ACACAC] dark:text-white tablet:h-4 tablet:w-4" />
              </button>
            )}
            {!getSharedLinksFilters.searchData && (
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/search.svg`}
                alt="search"
                className="absolute right-1.5 top-[55%] h-2 w-2 -translate-y-1/2 transform tablet:right-3 tablet:top-1/2 tablet:h-4 tablet:w-4"
              />
            )}
          </div>
        </div>
      </div>

      <div className="tablet:w-fulls mx-auto flex h-full max-w-full flex-col overflow-y-auto bg-[#F2F3F5] no-scrollbar dark:bg-black">
        <div className="mx-4 space-y-2 tablet:mx-6 tablet:space-y-5">
          {content}
          <FeedEndStatus
            isFetching={isFetching}
            searchData={getSharedLinksFilters.searchData}
            data={data}
            noMatchText="No matching posts found!"
            clearSearchText="Clear Search"
            noDataText="No shared posts!"
            noMoreDataText="No more shared posts!"
            clearSearchAction={() => dispatch(updateSharedLinkSearch(''))}
          />
        </div>
      </div>
    </div>
  );
}
