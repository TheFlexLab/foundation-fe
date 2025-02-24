import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import {
  findPostsByCategoryId,
  findPostsBySharedLink,
  updateCategoryViewCount,
} from '../../../../services/api/listsApi';
import QuestionCardWithToggle from '../QuestStartSection/components/QuestionCardWithToggle';
import Topbar from '../../components/Topbar';
import DashboardLayout from '../../components/DashboardLayout';
import { useEffect } from 'react';
import SystemNotificationCard from '../../../../components/posts/SystemNotificationCard';
import { Helmet } from 'react-helmet-async';

const PostsByList = () => {
  let { id, categoryId } = useParams();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const { state } = useLocation();

  const {
    data: listData,
    error,
    isLoading,
    isSuccess,
  } = useQuery({
    queryFn: async () => {
      if (id === null || id === '' || id === undefined) {
        return await findPostsByCategoryId({ userUuid: persistedUserInfo.uuid, categoryId });
      } else {
        return await findPostsBySharedLink({ id });
      }
    },
    queryKey: ['postsByCategory', categoryId, persistedUserInfo.uuid, id],
  });

  useEffect(() => {
    if (isSuccess && listData) {
      updateCategoryViewCount({ categoryLink: id });
    }
  }, [isSuccess, listData]);

  const content =
    listData?.post?.map((item, index) => {
      if (item.id === 'system_notification') {
        return <SystemNotificationCard key={index + 1} post={item} />;
      } else {
        return (
          <div key={item._id}>
            <QuestionCardWithToggle
              questStartData={item.questForeginKey}
              categoryId={item._id}
              profilePicture={state?.profilePicture}
            />
          </div>
        );
      }
    }) ?? null;

  return (
    <>
      <Helmet>
        <script>
          {`
            window.prerenderReady = false;
          `}
        </script>
        <title>Foundation: Shared list</title>
        <meta name="description" content="A revolutionary new social platform. Own your data. Get rewarded." />
        <meta property="og:title" content="Foundation: Shared list" />
        <meta property="og:description" content="A revolutionary new social platform. Own your data. Get rewarded." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://foundation-seo.s3.amazonaws.com/seo-logo-v2.png" />
        <meta property="og:image:secure_url" content="https://foundation-seo.s3.amazonaws.com/seo-logo-v2.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Foundation: Shared list" />
        <meta
          property="twitter:description"
          content="A revolutionary new social platform. Own your data. Get rewarded."
        />
        <meta property="twitter:image" content="https://foundation-seo.s3.amazonaws.com/seo-logo-v2.png" />
        <meta name="google" content="notranslate" />
      </Helmet>
      {id === null || id === '' || id === undefined ? (
        <div className="mx-auto mt-[0.94rem] flex h-full max-h-[calc(100dvh-134px)] min-h-[calc(100dvh-134px)] w-full max-w-[778px] flex-col overflow-y-hidden bg-[#F2F3F5] dark:bg-black tablet:max-h-[calc(100dvh-172px)] tablet:min-h-[calc(100dvh-172px)] laptop:max-h-[calc(100dvh-70px)] laptop:min-h-[calc(100dvh-70px)]">
          <div className="flex h-[calc(100dvh-174px)] flex-col gap-2 overflow-y-auto px-4 pb-[10px] no-scrollbar tablet:gap-5 tablet:px-6 tablet:pb-5 laptop:h-full">
            {content}
          </div>
        </div>
      ) : (
        <>
          <Topbar />
          <div className="w-full bg-[#F2F3F5] dark:bg-black">
            <DashboardLayout>
              <div className="mx-auto mt-[0.94rem] flex h-full max-h-[calc(100dvh-134px)] min-h-[calc(100dvh-70px)] w-full max-w-[778px] flex-col overflow-y-hidden bg-[#F2F3F5] no-scrollbar dark:bg-black tablet:max-h-[calc(100dvh-172px)] tablet:min-h-[calc(100dvh-172px)] laptop:mx-[331px] laptop:max-h-[calc(100dvh-70px)] laptop:min-h-[calc(100dvh-70px)] desktop:mx-auto">
                <div className="mb-10 flex h-[calc(100dvh)] flex-col gap-2 overflow-y-auto px-4 pb-[10px] no-scrollbar tablet:mb-0 tablet:gap-5 tablet:px-6 tablet:pb-5 laptop:h-full">
                  {isLoading ? (
                    <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[24px] font-bold tablet:text-[25px]">
                      Loading...
                    </p>
                  ) : listData?.response?.data?.message === 'This link is not active.' ? (
                    <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[24px] font-bold tablet:text-[25px]">
                      This link is not active.
                    </p>
                  ) : listData?.response?.data?.message?.includes('An error occurred while getting the userList') ? (
                    <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[24px] font-bold tablet:text-[25px]">
                      Sharing is disabled for this collection.
                    </p>
                  ) : listData?.post?.length === 0 ? (
                    <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[24px] font-bold tablet:text-[25px]">
                      The list is Empty.
                    </p>
                  ) : (
                    content
                  )}
                </div>
              </div>
            </DashboardLayout>
          </div>
        </>
      )}
    </>
  );
};

export default PostsByList;
