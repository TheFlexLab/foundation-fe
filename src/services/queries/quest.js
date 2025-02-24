import { useQuery } from '@tanstack/react-query';
import { applyFilters, fetchDataByStatus } from '../../utils/questionCard';
import * as HomepageAPIs from '../api/homepageApis';
import api from '../api/Axios';

// export function useGetFeedData(filterStates, debouncedSearch, pagination, columns, params) {
//   params = applyFilters(params, filterStates, columns);

//   const { data, isLoading, isFetching } = useQuery({
//     queryFn: async () => {
//       if (debouncedSearch === '') {
//         const result = await fetchDataByStatus(params, filterStates);
//         return result.data;
//       } else {
//         const result = await HomepageAPIs.searchQuestions(debouncedSearch, params.moderationRatingFilter);
//         return result;
//       }
//     },
//     queryKey: ['FeedData', filterStates, debouncedSearch, pagination, columns],
//     staleTime: 60000,
//   });

//   return { data, isLoading, isFetching };
// }

// Not being used at FE
export function useGetHiddenFeedData(filterStates, debouncedSearch, pagination, columns, params) {
  params = applyFilters(params, filterStates, columns);
  return useQuery({
    queryFn: async () => {
      if (debouncedSearch === '') {
        const result = await fetchDataByStatus(params, filterStates);
        return result.data;
      } else {
        const result = await HomepageAPIs.searchHiddenQuestions(debouncedSearch);
        return result;
      }
    },
    queryKey: ['HiddenFeedData', filterStates, debouncedSearch, pagination, columns],
    staleTime: 0,
  });
}

// Not being used in FE
export function useGetBookmarkFeedData(filterStates, debouncedSearch, pagination, columns, params) {
  params = applyFilters(params, filterStates, columns);
  return useQuery({
    queryFn: async () => {
      if (debouncedSearch === '') {
        const result = await fetchDataByStatus(params, filterStates);
        return result.data;
      } else {
        const result = await HomepageAPIs.searchBookmarks(debouncedSearch, params.moderationRatingFilter);
        return result;
      }
    },
    queryKey: ['BookmarkFeedData', filterStates, debouncedSearch, pagination, columns],
    staleTime: 0,
  });
}

export function useGetSingleQuest(uuid, id) {
  return useQuery({
    queryFn: async () => {
      return (await HomepageAPIs.getSingleQuest(uuid, id)).data.data[0];
    },
    queryKey: ['SingleQuest'],
    initialData: null,
    staleTime: 0,
  });
}

// Not being used in the app
export function useGetBookmarkData() {
  const { data, isLoading } = useQuery({
    queryFn: () => HomepageAPIs.getAllBookmarkedQuests(),
    queryKey: ['getBookmarked'],
    staleTime: 60000,
  });

  return { data, isLoading };
}

// GET ALL PREFERENCES
export function useGetAllTopics() {
  return useQuery({
    queryFn: () => HomepageAPIs.getAllTopics(),
    queryKey: ['topicsData'],
    staleTime: 60000,
  });
}

// SEARCH PREFERENCES
export function useSearchTopics(getPreferences) {
  return useQuery({
    queryFn: async () => {
      if (getPreferences?.topicSearch !== '') {
        const result = await HomepageAPIs.searchTopics(getPreferences?.topicSearch);
        return result;
      } else {
        return [];
      }
    },
    queryKey: ['TopicSearch', getPreferences.topicSearch],
  });
}
