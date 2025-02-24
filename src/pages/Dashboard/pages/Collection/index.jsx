import CollectionCard from './components/CollectionCard';
import { fetchLists } from '../../../../services/api/listsApi';
import { useQuery } from '@tanstack/react-query';
import SummaryCard from '../../../../components/SummaryCard';
import { useSelector } from 'react-redux';
import { Button } from '../../../../components/ui/Button';
import AddToListPopup from '../../../../components/dialogue-boxes/AddToListPopup';
import { useState } from 'react';

const Collection = () => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [addToList, setAddToList] = useState(false);

  const {
    data: listData = [],
    isError,
    isSuccess,
  } = useQuery({
    queryFn: () => fetchLists(),
    queryKey: ['collection'],
  });

  if (isError) {
    console.log('some error occur');
  }

  return (
    <div className="flex h-[calc(100vh-70px)] w-full flex-col gap-2 overflow-y-auto px-4 pb-[10px] no-scrollbar tablet:h-[calc(100dvh-200px)] tablet:gap-5 tablet:px-6 tablet:pb-5 laptop:h-[calc(100vh-148px)]">
      <SummaryCard headerIcon="/assets/summary/my-list-logo.svg" headerTitle="My Collections">
        <h1 className="summary-text">
          Organize what posts matter most and get a deeper understanding of your audience with Collections. The more
          engagement your Collections receive, the more FDX you’ll earn! Shared collections will appear on your home
          page for all to see.
        </h1>
        <div className="mt-3 flex items-center justify-center gap-2 tablet:mt-5 tablet:gap-6">
          <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Shared Collections
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.myListStatistics?.totalSharedListsCount}
            </h5>
          </div>
          <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Total collections
            </h1>
            <h5 className="text-center text-[18px] font-normal">{persistedUserInfo?.myListStatistics?.totalLists}</h5>
          </div>

          <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Total collection engagement
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.myListStatistics?.totalSharedListsParticipentsCount}
            </h5>
          </div>
          <div>
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Total collection views
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.myListStatistics?.totalSharedListsClicksCount}
            </h5>
          </div>
        </div>
        <div className="mt-3 flex justify-center tablet:mt-5">
          <Button variant="submit" onClick={() => setAddToList(true)}>
            Create a new collection
          </Button>
          {addToList && (
            <AddToListPopup handleClose={() => setAddToList(false)} modalVisible={addToList} page={'my-collection'} />
          )}
        </div>
      </SummaryCard>
      {isSuccess && <CollectionCard listData={listData} />}
    </div>
  );
};

export default Collection;
