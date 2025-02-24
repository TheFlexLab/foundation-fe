import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import { useFetchOtherProfiles } from '../../services/api/profile';
import { profileFilters, updateProfileSearch } from '../../features/profiles/profileSlice';
import OthersProfileCard from './components/OthersProfileCard';
import FeedEndStatus from '../../components/FeedEndStatus';

export const OtherProfiles = () => {
  const { ref, inView } = useInView();
  const dispatch = useDispatch();
  const getProfilesFilters = useSelector(profileFilters);
  const { data, fetchNextPage, hasNextPage, isLoading, isError, isFetching, error } = useFetchOtherProfiles(
    getProfilesFilters.searchData
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

    return data.pages.map((profiles) =>
      profiles.domains?.map((profile: any, index: number) => {
        const isLastPost = profiles.length === index + 1;

        return <OthersProfileCard key={profile._id} data={profile} innerRef={isLastPost ? ref : null} />;
      })
    );
  }, [data]);

  if (isError) return <div className="flex w-full justify-center">{error?.message}</div>;
  return (
    <>
      <div className="mx-auto flex max-w-[730px] flex-col gap-3 px-4 tablet:gap-6 tablet:px-0">{content}</div>
      <FeedEndStatus
        isFetching={isFetching}
        searchData={getProfilesFilters.searchData}
        data={data}
        noMatchText="No matching profile found!"
        clearSearchText="Clear Search"
        noDataText="No profiles found!"
        noMoreDataText="No more profiles!"
        clearSearchAction={() => dispatch(updateProfileSearch(''))}
      />
    </>
  );
};
