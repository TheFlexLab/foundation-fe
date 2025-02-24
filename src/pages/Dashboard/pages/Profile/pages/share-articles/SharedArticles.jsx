import { GrClose } from 'react-icons/gr';
import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import { useDebounce } from '../../../../../../utils/useDebounce';
import { useFetchNewsFeed } from '../../../../../../services/queries/news-feed';
import { newsFeedFilters, updateNewsFeedSearch } from '../../../../../../features/news-feed/newsFeedSlice';
import DisabledLinkPopup from '../../../../../../components/dialogue-boxes/DisabledLinkPopup';
import * as questUtilsActions from '../../../../../../features/quest/utilsSlice';
import ContentCard from '../../../../../../components/ContentCard';
import FeedEndStatus from '../../../../../../components/FeedEndStatus';
import NewsFeedCard from '../../../../../features/news-feed/components/NewsFeedCard';

export default function SharedArticles() {
  const { ref, inView } = useInView();
  const dispatch = useDispatch();
  const getNewsFeedFilters = useSelector(newsFeedFilters);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const questUtils = useSelector(questUtilsActions.getQuestUtils);
  const [sharedArticlesSearch, setSharedArticlesSearch] = useState('');

  // Search for shared collections
  const handleSharedLinkSearch = (e) => {
    setSharedArticlesSearch(e.target.value);
  };

  const debouncedSharedSearch = useDebounce(sharedArticlesSearch, 1000);

  useEffect(() => {
    dispatch(updateNewsFeedSearch(debouncedSharedSearch));
  }, [debouncedSharedSearch]);

  useEffect(() => {
    if (getNewsFeedFilters.searchData === '') {
      setSharedArticlesSearch('');
    }
  }, [getNewsFeedFilters.searchData]);
  // Search Ended

  const showHidePostClose = () => {
    dispatch(questUtilsActions.updateDialogueBox({ type: null, status: false, link: null, id: null }));
  };

  const { data, fetchNextPage, hasNextPage, isFetching, error } = useFetchNewsFeed(
    getNewsFeedFilters.searchData,
    'sharedArticles'
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (status === 'error') {
    return <p>Error: {error.message}</p>;
  }

  const content = useMemo(() => {
    if (!data || !data.pages || data.pages.length === 0) {
      return null;
    }

    return data?.pages?.map((posts) =>
      posts?.data?.map((post, index) => {
        const isLastPost = posts.data.length === index + 1;

        return <NewsFeedCard key={index} data={post} innerRef={isLastPost ? ref : null} postType="sharedArticles" />;
      })
    );
  }, [data, ref]);

  return (
    <div>
      {/* Shared Articles Insights */}
      <ContentCard icon="assets/topbar/news.svg" title="Shared Articles">
        <h1 className="summary-text">
          Manage news articles you’ve shared and track engagement metrics. Shared articles also appear on your Home Page
          for your audience to see.
        </h1>
        <div className="mt-3 flex items-center justify-center gap-2 tablet:mt-5 tablet:gap-6">
          <div className="max-w-28 border-r border-[#707175] pr-3 tablet:max-w-full tablet:pr-6">
            <h1 className="text-gray-1 text-center text-[12px] font-semibold leading-[116%] dark:text-gray-300 tablet:text-[16px] tablet:leading-normal">
              Articles you’ve shared
            </h1>
            <h5 className="text-gray-1 text-center text-[18px] font-normal dark:text-gray-300">
              {persistedUserInfo?.myArticleStatistics.totalSharedArticlesCount}
            </h5>
          </div>

          <div className="max-w-28 border-r border-[#707175] pr-3 tablet:max-w-full tablet:pr-6">
            <h1 className="text-gray-1 text-center text-[12px] font-semibold leading-[116%] dark:text-gray-300 tablet:text-[16px] tablet:leading-normal">
              Total engagements
            </h1>
            <h5 className="text-gray-1 text-center text-[18px] font-normal dark:text-gray-300">
              {persistedUserInfo?.myArticleStatistics.overAllArticleSharedEngagementCount}
            </h5>
          </div>
          <div>
            <h1 className="text-gray-1 text-center text-[12px] font-semibold leading-[116%] dark:text-gray-300 tablet:text-[16px] tablet:leading-normal">
              Total views
            </h1>
            <h5 className="text-gray-1 text-center text-[18px] font-normal dark:text-gray-300">
              {persistedUserInfo?.myArticleStatistics?.totalSharedArticleViews}
            </h5>
          </div>
        </div>
      </ContentCard>
      <div className="mx-[15px] my-2 mr-4 flex justify-end tablet:ml-[97px] tablet:mr-[70px] tablet:hidden">
        <DisabledLinkPopup handleClose={showHidePostClose} modalVisible={questUtils.sharedQuestStatus.isDialogueBox} />
        <div className="relative">
          <div className="relative h-[15.96px] w-[128px] tablet:h-[45px] tablet:w-[337px]">
            <input
              type="text"
              id="floating_outlined"
              className="peer block h-full w-full appearance-none rounded-[3.55px] border-[0.71px] border-[#707175] bg-transparent py-2 pl-2 pr-8 text-[6px] leading-[7.25px] text-[#707175] focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-100 dark:text-[#707175] dark:focus:border-blue-500 tablet:rounded-[10px] tablet:border-2 tablet:pl-5 tablet:text-[18.23px]"
              value={sharedArticlesSearch}
              placeholder=""
              onChange={handleSharedLinkSearch}
            />
            <label
              htmlFor="floating_outlined"
              className="absolute left-[15px] start-1 top-[10px] z-10 origin-[0] -translate-y-4 scale-75 transform bg-[#F2F3F5] px-2 text-[8.33px] leading-[10px] text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-[#0A0A0C] peer-focus:dark:text-blue-500 tablet:top-2 tablet:text-[18px] tablet:leading-[21.78px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
            >
              Search
            </label>
            {getNewsFeedFilters.searchData && (
              <button
                className="absolute right-1.5 top-[55%] -translate-y-1/2 transform tablet:right-3 tablet:top-1/2"
                onClick={() => {
                  dispatch(updateNewsFeedSearch(''));
                }}
              >
                <GrClose className="h-2 w-2 text-[#ACACAC] dark:text-white tablet:h-4 tablet:w-4" />
              </button>
            )}
            {!getNewsFeedFilters.searchData && (
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
            searchData={getNewsFeedFilters.searchData}
            data={data}
            noMatchText="No matching articles found!"
            clearSearchText="Clear Search"
            noDataText="No shared articles!"
            noMoreDataText="No more shared articles!"
            clearSearchAction={() => dispatch(updateNewsFeedSearch(''))}
          />
        </div>
      </div>
    </div>
  );
}
