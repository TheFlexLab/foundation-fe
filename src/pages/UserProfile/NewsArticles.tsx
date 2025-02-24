import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useFetchNewsFeed } from '../../services/queries/news-feed';
import NewsFeedCard from '../features/news-feed/components/NewsFeedCard';
import SummaryCard from '../../components/SummaryCard';
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { FaSpinner } from 'react-icons/fa';

export default function NewsArticles({ domain }: { domain: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { ref, inView } = useInView();
  const [showAll, setShowAll] = useState(false);
  const isPublicProfile = location.pathname.startsWith('/h/');
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Clear cache when the page changes
    queryClient.resetQueries({ queryKey: ['sharedArticles'] });
  }, []);

  const { data, fetchNextPage, hasNextPage, isLoading } = useFetchNewsFeed(
    '',
    'sharedArticles',
    domain,
    location.pathname.startsWith('/h/') ? true : false
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

    const pagesToShow = showAll ? data.pages : data.pages.slice(0, 1);

    return pagesToShow.map((posts) =>
      posts?.data?.map((post: any, index: number) => {
        const isLastPost = index === posts.data.length - 1;
        return (
          <NewsFeedCard
            key={post._id}
            data={post}
            innerRef={isLastPost ? ref : null}
            postType={!isPublicProfile ? 'user-profile' : undefined}
          />
        );
      })
    );
  }, [data, ref, showAll]);

  return (
    <>
      {content && content[0].length !== 0 && (
        <>
          <SummaryCard
            headerIcon="/assets/topbar/news.svg"
            headerTitle="Shared Articles"
            isPublicProfile={isPublicProfile}
          >
            {!isPublicProfile && (
              <>
                <h1 className="summary-text">
                  Manage news articles you’ve shared and track engagement metrics. Shared articles also appear on your
                  Home Page for your audience to see.
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
                  <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
                    <h1 className="text-gray-1 text-center text-[12px] font-semibold leading-[116%] dark:text-gray-300 tablet:text-[16px] tablet:leading-normal">
                      Total engagements
                    </h1>
                    <h5 className="text-gray-1 text-center text-[18px] font-normal dark:text-gray-300">
                      {persistedUserInfo?.myArticleStatistics.overAllArticleSharedEngagementCount}
                    </h5>
                  </div>
                  <div>
                    <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
                      Total views
                    </h1>
                    <h5 className="text-center text-[18px] font-normal">
                      {persistedUserInfo?.myArticleStatistics?.totalSharedArticleViews}
                    </h5>
                  </div>
                </div>
                <div className="mt-3 flex w-full justify-center tablet:mt-5">
                  <Button variant={'submit'} onClick={() => navigate('/profile/shared-articles')}>
                    Manage all shared articles
                  </Button>
                </div>
              </>
            )}
          </SummaryCard>

          <div className="mx-auto flex w-full max-w-[730px] flex-col items-center gap-3 tablet:gap-6">
            <div className="flex w-full flex-col gap-3 tablet:gap-5">{content}</div>
            {!showAll && data?.pages[0]?.data?.length === 5 && data?.pages[1]?.data?.length > 0 && (
              <Button variant="submit" onClick={() => setShowAll(true)}>
                See All Articles
              </Button>
            )}
          </div>
        </>
      )}
      {isLoading && (
        <div className="flex items-center justify-center pb-[6rem] pt-3 tablet:py-[27px]">
          <FaSpinner className="animate-spin text-[10vw] text-blue-200 tablet:text-[8vw] laptop:text-[4vw]" />
        </div>
      )}
    </>
  );
}
