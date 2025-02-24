import { GrClose } from 'react-icons/gr';
import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import { hiddenPostFilters, updateSearch } from '../../../../../features/profile/hiddenPosts';
import QuestionCard from '../../QuestStartSection/components/QuestionCard';
import api from '../../../../../services/api/Axios';
import { setAreHiddenPosts } from '../../../../../features/quest/utilsSlice';
import * as questUtilsActions from '../../../../../features/quest/utilsSlice';
import SummaryCard from '../../../../../components/SummaryCard';
import FeedEndStatus from '../../../../../components/FeedEndStatus';
import { useDebounce } from '../../../../../utils/useDebounce';

export default function HiddenPosts() {
  const { ref, inView } = useInView();
  const dispatch = useDispatch();
  const questUtils = useSelector(questUtilsActions.getQuestUtils);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const getHiddenPostFilters = useSelector(hiddenPostFilters);
  const [startTest, setStartTest] = useState(null);
  const [viewResult, setViewResult] = useState(null);
  const [hiddenSearch, setHiddenSearch] = useState('');

  const handleHiddenPostSearch = (e) => {
    setHiddenSearch(e.target.value);
  };

  const debouncedHiddenSearch = useDebounce(hiddenSearch, 1000);

  useEffect(() => {
    dispatch(updateSearch(debouncedHiddenSearch));
  }, [debouncedHiddenSearch]);

  useEffect(() => {
    if (getHiddenPostFilters.searchData === '') {
      setHiddenSearch('');
    }
  }, [getHiddenPostFilters.searchData]);

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

  const fetchPosts = async function getInfoQuestions({ pageParam }) {
    const params = {
      _page: pageParam,
      _limit: 5,
      start: (pageParam - 1) * 5,
      end: pageParam * 5,
      uuid: persistedUserInfo.uuid,
      sort: 'Newest First',
      Page: 'Hidden',
      terms: getHiddenPostFilters.searchData,
      type: 'All',
      moderationRatingInitial: 0,
      moderationRatingFinal: 100,
    };

    const response = await api.get('/infoquestions/getQuestsAll', { params });

    return response.data.data;
  };

  const { data, status, error, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['hiddenPosts', getHiddenPostFilters.searchData],
    queryFn: fetchPosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nexPage = lastPage.length ? allPages.length + 1 : undefined;
      return nexPage;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (status === 'error') {
    return <p>Error: {error.message}</p>;
  }

  const content = data?.pages.map((posts) =>
    posts.map((post, index) => {
      if (posts.length == index + 1) {
        return (
          <QuestionCard
            innerRef={ref}
            key={post._id}
            questStartData={post}
            postProperties={'HiddenPosts'}
            startTest={startTest}
            setStartTest={setStartTest}
            viewResult={viewResult}
            handleViewResults={memoizedViewResults}
            handleStartTest={memoizedStartTest}
          />
        );
      } else {
        return (
          <QuestionCard
            key={post._id}
            questStartData={post}
            postProperties={'HiddenPosts'}
            startTest={startTest}
            setStartTest={setStartTest}
            viewResult={viewResult}
            handleViewResults={memoizedViewResults}
            handleStartTest={memoizedStartTest}
          />
        );
      }
    })
  );

  useEffect(() => {
    if (data?.pages[0].length !== 0) {
      dispatch(setAreHiddenPosts(true));
    } else {
      dispatch(setAreHiddenPosts(false));
    }
  }, [data]);

  return (
    <div>
      {/* Summary Section */}
      <div className="mx-4 mb-3 tablet:mx-6 tablet:mb-5">
        <SummaryCard headerIcon="/assets/summary/feedback-given.svg" headerTitle="Feedback Given">
          <h1 className="summary-text">
            See the feedback you've given on other's posts, including those you've chosen to hide.
          </h1>
          <div className="mt-3 flex items-center justify-center gap-2 tablet:mt-5 tablet:gap-6">
            <div className="max-w-28 border-r border-[#707175] pr-3 tablet:max-w-full tablet:pr-6">
              <h1 className="text-gray-1 text-center text-[12px] font-semibold leading-[116%] dark:text-gray-300 tablet:text-[16px] tablet:leading-normal">
                Posts I have given feedback on
              </h1>
              <h5 className="text-gray-1 text-center text-[18px] font-normal dark:text-gray-300">
                {persistedUserInfo?.questsActivity?.feedbackGiven || 0}
              </h5>
            </div>
            <div className="max-w-28 pr-3 tablet:max-w-full tablet:pr-6">
              <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
                Posts I have hidden
              </h1>
              <h5 className="text-center text-[18px] font-normal">
                {persistedUserInfo?.questsActivity?.myHiddenQuestsCount}
              </h5>
            </div>
          </div>
        </SummaryCard>
      </div>

      {/* Main Content */}
      {questUtils.areHiddenPosts && (
        <div className="mx-[15px] my-2 mr-4 flex justify-end tablet:ml-[97px] tablet:mr-[70px] tablet:hidden">
          <div className="relative">
            <div className="relative h-[15.96px] w-[128px] tablet:h-[45px] tablet:w-[337px]">
              <input
                type="text"
                id="floating_outlined"
                className="peer block h-full w-full appearance-none rounded-[3.55px] border-[0.71px] border-[#707175] bg-transparent py-2 pl-2 pr-8 text-[6px] leading-[7.25px] text-[#707175] focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-100 dark:text-[#707175] dark:focus:border-blue-500 tablet:rounded-[10px] tablet:border-2 tablet:pl-5 tablet:text-[18.23px]"
                value={hiddenSearch}
                placeholder=""
                onChange={handleHiddenPostSearch}
              />
              <label
                htmlFor="floating_outlined"
                className="absolute left-[15px] start-1 top-[10px] z-10 origin-[0] -translate-y-4 scale-75 transform bg-[#F2F3F5] px-2 text-[8.33px] leading-[10px] text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-[#0A0A0C] peer-focus:dark:text-blue-500 tablet:top-2 tablet:text-[18px] tablet:leading-[21.78px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
              >
                Search
              </label>
              {getHiddenPostFilters.searchData && (
                <button
                  className="absolute right-1.5 top-[55%] -translate-y-1/2 transform tablet:right-3 tablet:top-1/2"
                  onClick={() => {
                    dispatch(updateSearch(''));
                  }}
                >
                  <GrClose className="h-2 w-2 text-[#ACACAC] dark:text-white tablet:h-4 tablet:w-4" />
                </button>
              )}
              {!getHiddenPostFilters.searchData && (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/search.svg`}
                  alt="search"
                  className="absolute right-1.5 top-[55%] h-2 w-2 -translate-y-1/2 transform tablet:right-3 tablet:top-1/2 tablet:h-4 tablet:w-4"
                />
              )}
            </div>
          </div>
        </div>
      )}

      <div className="tablet:w-fulls mx-auto flex h-full max-w-full flex-col overflow-y-auto bg-[#F2F3F5] no-scrollbar dark:bg-black">
        <div className="mx-4 space-y-2 tablet:mx-6 tablet:space-y-5">
          {content}
          <FeedEndStatus
            isFetching={isFetching}
            searchData={getHiddenPostFilters.searchData}
            data={data}
            noMatchText="No matching posts found!"
            clearSearchText="Clear Search"
            noDataText="No hidden posts!"
            noMoreDataText="No more hidden posts!"
            clearSearchAction={() => dispatch(updateSearch(''))}
          />
        </div>
      </div>
    </div>
  );
}
