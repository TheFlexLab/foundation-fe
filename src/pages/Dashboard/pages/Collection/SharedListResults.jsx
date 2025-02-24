import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../../../../components/ui/Button';
import { viewListAllResults, viewListResults } from '../../../../services/api/listsApi';

import Loader from '../../../../components/ui/Loader';
import Topbar from '../../components/Topbar';
import QuestionCardWithToggle from '../QuestStartSection/components/QuestionCardWithToggle';
import DashboardLayout from '../../components/DashboardLayout';

export default function SharedListResults() {
  const location = useLocation();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [tab, setTab] = useState(
    persistedUserInfo.role === 'guest' || persistedUserInfo?.role === 'visitor'
      ? 'All of Foundation'
      : 'My Audience Results'
  );

  const {
    data: sharedlistAllData,
    isPending: allDataPending,
    isSuccess: allDataSuccess,
  } = useQuery({
    queryFn: async () => {
      return await viewListAllResults({ categoryId: location.state.categoryItem });
    },
    queryKey: ['allPostsByCategory', persistedUserInfo.uuid],
  });

  const {
    data: sharedlistData,
    isPending,
    isSuccess,
  } = useQuery({
    queryFn: async () => {
      return await viewListResults({ categoryId: location.state.categoryItem });
    },
    queryKey: ['postsByCategory', persistedUserInfo.uuid],
  });

  return (
    <>
      <Topbar />
      <div className="bg-[#F2F3F5] dark:bg-[#242424]">
        <DashboardLayout>
          <div className="mx-auto h-[calc(100dvh-91px)] w-full max-w-[1440px] no-scrollbar tablet:h-[calc(100vh-70px)] laptop:mx-[331px] laptop:px-4 desktop:mx-auto desktop:px-0">
            {persistedUserInfo?.role === 'user' && (
              <div className="my-2 flex justify-center gap-[15px] tablet:gap-5 laptop:my-[14.82px] laptop:gap-[35px]">
                <Button
                  variant={'topics'}
                  className={`${
                    tab === 'All of Foundation'
                      ? 'border-[#4A8DBD] bg-[#4A8DBD] text-white'
                      : 'border-[#ACACAC] bg-white text-[#707175]'
                  }`}
                  onClick={() => setTab('All of Foundation')}
                >
                  All of Foundation
                </Button>
                <Button
                  variant={'topics'}
                  className={`${
                    tab === 'My Audience Results'
                      ? 'border-[#4A8DBD] bg-[#4A8DBD] text-white'
                      : 'border-[#ACACAC] bg-white text-[#707175]'
                  }`}
                  onClick={() => setTab('My Audience Results')}
                >
                  My Audience Results
                </Button>
              </div>
            )}

            {tab === 'All of Foundation' ? (
              allDataPending ? (
                <Loader />
              ) : (
                <>
                  {allDataSuccess && sharedlistAllData?.data.category.post.length <= 0 ? (
                    <div className="flex justify-center gap-4 px-4 pb-8 pt-3 tablet:py-[27px]">
                      <p className="text-center text-[4vw] laptop:text-[2vw]">
                        <b>No posts in this list!</b>
                      </p>
                    </div>
                  ) : (
                    <div className="mb-5 flex h-[calc(100vh-115px)] flex-col gap-2 overflow-y-auto pb-8 no-scrollbar tablet:h-[calc(100vh-118px)] tablet:gap-5 tablet:pb-12">
                      {allDataSuccess &&
                        sharedlistAllData.data.category.post.map((item) => (
                          <div
                            key={item._id}
                            className="mx-auto w-full px-4 tablet:max-w-[730px] tablet:px-6 laptop:px-[0px]"
                          >
                            <QuestionCardWithToggle
                              questStartData={item.questForeginKey}
                              postProperties={'sharedlink-results'}
                              SharedLinkButton={'shared-links-results-button'}
                            />
                          </div>
                        ))}
                    </div>
                  )}
                </>
              )
            ) : null}

            {tab === 'My Audience Results' ? (
              isPending ? (
                <Loader />
              ) : (
                <>
                  {isSuccess && sharedlistData?.data.category.post.length <= 0 ? (
                    <div className="flex justify-center gap-4 px-4 pb-8 pt-3 tablet:py-[27px]">
                      <p className="text-center text-[4vw] laptop:text-[2vw]">
                        <b>No posts in this list!</b>
                      </p>
                    </div>
                  ) : (
                    <div className="mb-5 flex h-[calc(100vh-115px)] flex-col gap-2 overflow-y-auto pb-8 no-scrollbar tablet:h-[calc(100vh-118px)] tablet:gap-5 tablet:pb-12">
                      {isSuccess &&
                        sharedlistData.data.category.post.map((item) => (
                          <div
                            key={item._id}
                            className="mx-auto w-full px-4 tablet:max-w-[730px] tablet:px-6 laptop:px-[0px]"
                          >
                            <QuestionCardWithToggle
                              questStartData={item.questForeginKey}
                              postProperties={'sharedlink-results'}
                              SharedLinkButton={'shared-links-results-button'}
                            />
                          </div>
                        ))}
                    </div>
                  )}
                </>
              )
            ) : null}
          </div>
        </DashboardLayout>
      </div>
    </>
  );
}
