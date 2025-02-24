import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import { useFetchNewsFeed } from '../../../services/queries/news-feed';
import { newsFeedFilters, updateNewsFeedSearch } from '../../../features/news-feed/newsFeedSlice';
import NewsFeedCard from './components/NewsFeedCard';
import FeedEndStatus from '../../../components/FeedEndStatus';

export default function NewsFeed() {
  const dispatch = useDispatch();
  const { ref, inView } = useInView();
  const getNewsFeedFilters = useSelector(newsFeedFilters);
  const { data, fetchNextPage, hasNextPage, isError, isFetching, error } = useFetchNewsFeed(
    getNewsFeedFilters.searchData
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const content = useMemo(() => {
    if (!data || !data.pages || data.pages.length === 0) {
      return null;
    }

    return data?.pages?.map((posts) =>
      posts?.data?.map((post: any, index: number) => {
        const isLastPost = index === posts.data.length - 1;
        return <NewsFeedCard key={post._id} data={post} innerRef={isLastPost ? ref : null} />;
      })
    );
  }, [data]);

  if (isError) return <div className="flex w-full justify-center">{error?.message}</div>;

  return (
    <>
      <div className="mx-4 space-y-2 tablet:mx-6 tablet:space-y-5">{content}</div>
      <FeedEndStatus
        isFetching={isFetching}
        searchData={getNewsFeedFilters.searchData}
        data={data}
        noMatchText="No matching news found!"
        clearSearchText="Clear Search"
        noDataText="No news articles!"
        noMoreDataText="No more news articles!"
        clearSearchAction={() => dispatch(updateNewsFeedSearch(''))}
      />
    </>
  );
}
