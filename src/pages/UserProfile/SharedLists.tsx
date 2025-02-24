import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CollectionCard from '../Dashboard/pages/Collection/components/CollectionCard';
import { Button } from '../../components/ui/Button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchListsExpended } from '../../services/api/listsApi';
import { useSelector } from 'react-redux';
import SummaryCard from '../../components/SummaryCard';
import AddToListPopup from '../../components/dialogue-boxes/AddToListPopup';
import { FaSpinner } from 'react-icons/fa';

export default function SharedLists({ domain, profilePicture }: { domain: string; profilePicture: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isPublicProfile = location.pathname.startsWith('/h/');
  const [showAll, setShowAll] = useState(false);
  const [addToList, setAddToList] = useState(false);
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    // Clear cache when the page changes
    queryClient.resetQueries({ queryKey: ['collection'] });
  }, []);

  const {
    data: listData,
    isError,
    isLoading,
  } = useQuery({
    queryFn: () =>
      fetchListsExpended(domain, persistedUserInfo.uuid, location.pathname.startsWith('/h/') ? true : false),
    queryKey: ['collection'],
  });

  return (
    <>
      {listData?.length > 0 && (
        <>
          <SummaryCard
            headerIcon="/assets/summary/my-list-logo.svg"
            headerTitle="Shared Collections"
            isPublicProfile={isPublicProfile}
          >
            {!isPublicProfile && (
              <>
                <h1 className="summary-text">
                  Organize what posts matter most and get a deeper understanding of your audience with Collections. The
                  more engagement your Collections receive, the more FDX you’ll earn! Shared collections will appear on
                  your home page for all to see.
                </h1>
                <div className="mt-3 flex items-center justify-center gap-2 tablet:mt-5 tablet:gap-6">
                  <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
                    <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
                      Total Collections
                    </h1>
                    <h5 className="text-center text-[18px] font-normal">
                      {persistedUserInfo?.myListStatistics?.totalLists}
                    </h5>
                  </div>
                  <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
                    <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
                      Collections you’ve shared
                    </h1>
                    <h5 className="text-center text-[18px] font-normal">
                      {persistedUserInfo?.myListStatistics?.totalSharedListsCount}
                    </h5>
                  </div>

                  <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
                    <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
                      Total engagements
                    </h1>
                    <h5 className="text-center text-[18px] font-normal">
                      {persistedUserInfo?.myListStatistics?.totalSharedListsParticipentsCount}
                    </h5>
                  </div>
                  <div>
                    <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
                      Total views
                    </h1>
                    <h5 className="text-center text-[18px] font-normal">
                      {persistedUserInfo?.myListStatistics?.totalSharedListsClicksCount}
                    </h5>
                  </div>
                </div>
                <div className="mt-3 flex w-full justify-center gap-3 tablet:mt-5">
                  <Button variant="submit" onClick={() => setAddToList(true)}>
                    Create a new collection
                  </Button>

                  <Button variant={'submit'} onClick={() => navigate('/profile/collections')}>
                    Manage all my collections
                  </Button>
                </div>
              </>
            )}
            {addToList && (
              <AddToListPopup
                handleClose={() => setAddToList(false)}
                modalVisible={addToList}
                questStartData={null}
                page={'my-collection'}
              />
            )}
          </SummaryCard>

          <div className="mx-auto flex w-full max-w-[730px] flex-col items-center gap-3 tablet:gap-6">
            <div className="flex w-full flex-col gap-3 tablet:gap-5">
              <CollectionCard
                listData={showAll ? listData : listData?.slice(0, 5)}
                page={''}
                profilePicture={profilePicture}
              />
              <div className="mx-auto w-fit">
                {!showAll && listData?.length > 5 && (
                  <Button variant="submit" onClick={() => setShowAll(true)}>
                    See All Collection
                  </Button>
                )}
              </div>
            </div>
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
