import api from './Axios';
import { useMemo } from 'react';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const useFetchSharedLinks = (searchData, persistedUserInfo) => {
  const fetchPosts = async ({ pageParam = 1 }) => {
    const params = {
      _page: pageParam,
      _limit: 5,
      start: (pageParam - 1) * 5,
      end: pageParam * 5,
      uuid: persistedUserInfo.uuid,
      sort: 'Newest First',
      Page: 'SharedLink',
      terms: searchData,
      type: 'All',
      moderationRatingInitial: 0,
      moderationRatingFinal: 100,
    };

    const response = await api.get('/infoquestions/getQuestsAll', { params });
    return response.data.data;
  };

  const { data, status, error, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['sharedLink', searchData],
    queryFn: fetchPosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => (lastPage.length ? allPages.length + 1 : undefined),
  });

  return useMemo(
    () => ({
      data,
      status,
      error,
      fetchNextPage,
      hasNextPage,
      isFetching,
    }),
    [data, status, error, fetchNextPage, hasNextPage, isFetching]
  );
};

export default useFetchSharedLinks;

// REVEAL My LINK RESULTS
export const revealMyAnswers = async ({ uuid, questForeignKey, revealMyAnswers }) => {
  const resp = await api.patch(`/startQuest/revealMyAnswers`, {
    uuid,
    questForeignKey,
    revealMyAnswers,
  });
  return resp.data;
};

export const useRevealMyAnswers = () => {
  return useMutation({
    mutationFn: revealMyAnswers,
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error) => {
      console.error(error);
      if (error?.response?.data?.message === 'Please Participate first') {
        toast.error('Please Participate first');
      }
    },
  });
};
