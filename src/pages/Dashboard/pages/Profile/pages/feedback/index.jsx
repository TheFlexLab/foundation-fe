import { GrClose } from 'react-icons/gr';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useDebounce } from '../../../../../../utils/useDebounce';
import { FeedbackCard } from './components/FeedbackCard';
import { feedbackFilters, updateFeedbackSearch } from '../../../../../../features/profile/feedbackSlice';
import * as questUtilsActions from '../../../../../../features/quest/utilsSlice';
import ContentCard from '../../../../../../components/ContentCard';
import api from '../../../../../../services/api/Axios';
import FeedEndStatus from '../../../../../../components/FeedEndStatus';

export default function Feedback() {
  const dispatch = useDispatch();
  const { ref, inView } = useInView();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const getFeedbackFilters = useSelector(feedbackFilters);
  const [feedbackSearch, setFeedbackSearch] = useState('');
  const questUtils = useSelector(questUtilsActions.getQuestUtils);

  const handleFeedbackSearch = (e) => {
    setFeedbackSearch(e.target.value);
  };

  const debouncedFeedbackSearch = useDebounce(feedbackSearch, 1000);

  useEffect(() => {
    dispatch(updateFeedbackSearch(debouncedFeedbackSearch));
  }, [debouncedFeedbackSearch]);

  useEffect(() => {
    if (getFeedbackFilters.searchData === '') {
      setFeedbackSearch('');
    }
  }, [getFeedbackFilters.searchData]);

  const fetchPosts = async function getInfoQuestions({ pageParam }) {
    const params = {
      _page: pageParam,
      _limit: 5,
      start: (pageParam - 1) * 5,
      end: pageParam * 5,
      uuid: persistedUserInfo.uuid,
      sort: 'Newest First',
      Page: 'Feedback',
      terms: getFeedbackFilters.searchData,
      type: 'All',
      moderationRatingInitial: 0,
      moderationRatingFinal: 100,
    };

    const response = await api.get('/infoquestions/getQuestsAll', { params });

    return response.data.data;
  };

  const { data, status, error, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['feedback', getFeedbackFilters.searchData],
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
        return <FeedbackCard key={index + 1} innerRef={ref} persistedUserInfo={persistedUserInfo} post={post} />;
      } else {
        return <FeedbackCard key={index + 1} persistedUserInfo={persistedUserInfo} post={post} />;
      }
    })
  );

  useEffect(() => {
    if (data?.pages[0].length !== 0) {
      dispatch(questUtilsActions.setAreFeedbackPosts(true));
    } else {
      dispatch(questUtilsActions.setAreFeedbackPosts(false));
    }
  }, [data]);

  return (
    <div>
      {/* Summary Section */}
      <ContentCard icon="assets/summary/feedback-received.svg" title="Feedback Received">
        <h1 className="summary-text">
          Here’s a look at the posts you’ve created that others have provided feedback on, including those they've
          chosen to hide.
        </h1>
        <div className="mt-3 flex items-center justify-center gap-2 tablet:mt-5 tablet:gap-6">
          <div className="max-w-28 border-r border-[#707175] pr-3 tablet:max-w-full tablet:pr-6">
            <h1 className="text-gray-1 text-center text-[12px] font-semibold leading-[116%] dark:text-gray-300 tablet:text-[16px] tablet:leading-normal">
              Feedback on my posts
            </h1>
            <h5 className="text-gray-1 text-center text-[18px] font-normal dark:text-gray-300">
              {persistedUserInfo?.questsActivity?.feedbackReceived}
            </h5>
          </div>
          <div>
            <h1 className="text-gray-1 text-center text-[12px] font-semibold leading-[116%] dark:text-gray-300 tablet:text-[16px] tablet:leading-normal">
              Hidden Posts
            </h1>
            <h5 className="text-gray-1 text-center text-[18px] font-normal dark:text-gray-300">
              {persistedUserInfo?.feedBackQuestsStatistics?.otherHidingOurQuestsCount}
            </h5>
          </div>
        </div>
      </ContentCard>

      {/* Main Content */}
      {questUtils.areFeedBackPosts && (
        <div className="mx-[15px] my-2 mr-4 flex justify-end tablet:ml-[97px] tablet:mr-[70px] tablet:hidden">
          <div className="relative">
            <div className="relative h-[15.96px] w-[128px] tablet:h-[45px] tablet:w-[337px]">
              <input
                type="text"
                id="floating_outlined"
                className="peer block h-full w-full appearance-none rounded-[3.55px] border-[0.71px] border-[#707175] bg-transparent py-2 pl-2 pr-8 text-[6px] leading-[7.25px] text-[#707175] focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-100 dark:text-[#707175] dark:focus:border-blue-500 tablet:rounded-[10px] tablet:border-2 tablet:pl-5 tablet:text-[18.23px]"
                value={feedbackSearch}
                placeholder=""
                onChange={handleFeedbackSearch}
              />
              <label
                htmlFor="floating_outlined"
                className="absolute left-[15px] start-1 top-[10px] z-10 origin-[0] -translate-y-4 scale-75 transform bg-[#F2F3F5] px-2 text-[8.33px] leading-[10px] text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-[#0A0A0C] peer-focus:dark:text-blue-500 tablet:top-2 tablet:text-[18px] tablet:leading-[21.78px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
              >
                Search
              </label>
              {getFeedbackFilters.searchData && (
                <button
                  className="absolute right-1.5 top-[55%] -translate-y-1/2 transform tablet:right-3 tablet:top-1/2"
                  onClick={() => {
                    dispatch(updateFeedbackSearch(''));
                  }}
                >
                  <GrClose className="h-2 w-2 text-[#ACACAC] dark:text-white tablet:h-4 tablet:w-4" />
                </button>
              )}
              {!getFeedbackFilters.searchData && (
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
            searchData={getFeedbackFilters.searchData}
            data={data}
            noMatchText="No matching posts found!"
            clearSearchText="Clear Search"
            noDataText="No feedback on your posts!"
            noMoreDataText="No more posts!"
            clearSearchAction={() => dispatch(updateFeedbackSearch(''))}
          />
        </div>
      </div>
    </div>
  );
}
