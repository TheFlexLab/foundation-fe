import { useInfiniteQuery } from '@tanstack/react-query';
import api from '../api/Axios';

export const useFetchPosts = (filterStates, persistedUserInfo) => {
  return useInfiniteQuery({
    queryKey: [
      'posts',
      filterStates.filterBySort,
      filterStates.filterByType,
      filterStates.filterByScope,
      filterStates.moderationRatingFilter.initial,
      filterStates.moderationRatingFilter.final,
      filterStates.searchData,
      filterStates.filterByStatus,
      filterStates.topics.Block.list,
      filterStates.bookmarks,
      filterStates.filterByMedia,
    ],
    queryFn: async ({ pageParam = 1, signal }) => {
      const params = {
        _page: pageParam,
        _limit: 5,
        start: (pageParam - 1) * 5,
        end: pageParam * 5,
        uuid: persistedUserInfo.uuid,
        sort: filterStates.filterBySort || 'Newest First',
        type: filterStates.filterByType,
        filter: filterStates.filterByScope === 'Me',
        participated:
          filterStates.filterByStatus === 'Participated'
            ? 'Yes'
            : filterStates.filterByStatus === 'Not Participated'
              ? 'Not'
              : 'All',
        moderationRatingInitial: filterStates.moderationRatingFilter.initial,
        moderationRatingFinal: filterStates.moderationRatingFilter.final,
        terms: filterStates.searchData,
        Page: filterStates.bookmarks ? 'Bookmark' : '',
        media: filterStates.filterByMedia,
      };

      if (filterStates.topics.Block.list.length !== 0) {
        params.blockedTerms = JSON.stringify(filterStates.topics.Block.list);
      }

      const response = await api.get('/infoquestions/getQuestsAll', { params, signal });
      return response.data.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length >= 1 ? allPages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false,
  });
};
