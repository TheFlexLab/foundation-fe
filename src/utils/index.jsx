import { FaSpinner } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import * as homeFilterActions from '../features/sidebar/filtersSlice';
import { isEqual } from 'lodash';
import { setFilterStates } from '../services/api/userAuth';
import { useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { resetPlayingIds, setIsShowPlayer, setPlayingPlayerId } from '../features/quest/utilsSlice';

const filtersInitialState = {
  filterByStatus: 'All',
  filterByType: 'All',
  filterByScope: 'All',
  filterByMedia: 'All',
  filterBySort: 'Newest First',
  clearFilter: false,
};

export function calculateRemainingTime(lastInteractedAt, howManyTimesAnsChanged, usersChangeTheirAns) {
  const validateInterval = () => {
    let timeInterval = 0;
    if (usersChangeTheirAns === 'Daily') {
      return (timeInterval = 24 * 60 * 60 * 1000);
    } else if (usersChangeTheirAns === 'Weekly') {
      return (timeInterval = 7 * 24 * 60 * 60 * 1000);
    } else if (usersChangeTheirAns === 'Monthly') {
      return (timeInterval = 30 * 24 * 60 * 60 * 1000);
    } else if (usersChangeTheirAns === 'Yearly') {
      return (timeInterval = 365 * 24 * 60 * 60 * 1000);
    } else if (usersChangeTheirAns === 'TwoYears') {
      return (timeInterval = 2 * 365 * 24 * 60 * 60 * 1000);
    } else if (usersChangeTheirAns === 'FourYears') {
      return (timeInterval = 4 * 365 * 24 * 60 * 60 * 1000);
    }
  };

  const currentDate = new Date();
  const timeInterval = validateInterval();

  if (howManyTimesAnsChanged >= 1 && currentDate - new Date(lastInteractedAt) < timeInterval) {
    let futureDate = new Date(currentDate.getTime() + timeInterval);

    const timeDifference = futureDate - currentDate;
    const days = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    const twoYears = Math.floor(days / (2 * 365));
    const fourYears = Math.floor(days / (4 * 365));

    const remainingTime = [
      days > 0 ? (days === 1 ? '24 hours' : days === 365 ? '12 months' : `${days} days`) : null,
      weeks > 0 ? `${weeks} weeks` : null,
      months > 0 ? `${months} months` : null,
      years > 0 ? `${years} years` : null,
      twoYears > 0 ? `${twoYears} two years` : null,
      fourYears > 0 ? `${fourYears} four years` : null,
    ]
      .filter(Boolean)
      .join(', ');

    return `, after ${remainingTime.split(',')[0]}`;
  } else {
    return ', you are good to go';
  }
}
// export function remainingTime(lastInteractedAt, howManyTimesAnsChanged, usersChangeTheirAns) {
//   const validateInterval = () => {
//     if (usersChangeTheirAns === 'Daily') {
//       return 24 * 60 * 60 * 1000;
//     } else if (usersChangeTheirAns === 'Weekly') {
//       return 7 * 24 * 60 * 60 * 1000;
//     } else if (usersChangeTheirAns === 'Monthly') {
//       return 30 * 24 * 60 * 60 * 1000;
//     } else if (usersChangeTheirAns === 'Yearly') {
//       return 365 * 24 * 60 * 60 * 1000;
//     } else if (usersChangeTheirAns === 'TwoYears') {
//       return 2 * 365 * 24 * 60 * 60 * 1000;
//     } else if (usersChangeTheirAns === 'FourYears') {
//       return 4 * 365 * 24 * 60 * 60 * 1000;
//     }
//   };

//   const currentDate = new Date();
//   const timeInterval = validateInterval();

//   if (howManyTimesAnsChanged >= 1 && currentDate - new Date(lastInteractedAt) < timeInterval) {
//     const timeLeft = timeInterval - (currentDate - new Date(lastInteractedAt));

//     const minutes = Math.floor(timeLeft / (60 * 1000));
//     const hours = Math.floor(timeLeft / (60 * 60 * 1000));
//     const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
//     const weeks = Math.floor(days / 7);
//     const months = Math.floor(days / 30);
//     const years = Math.floor(days / 365);
//     const twoYears = Math.floor(days / (2 * 365));
//     const fourYears = Math.floor(days / (4 * 365));

//     if (fourYears > 0) {
//       return `${fourYears} four years`;
//     } else if (twoYears > 0) {
//       return `${twoYears} two years`;
//     } else if (years > 0) {
//       return `${years} ${years === 1 ? 'year' : 'years'}`;
//     } else if (months > 0) {
//       return `${months} ${months === 1 ? 'month' : 'months'}`;
//     } else if (weeks > 0) {
//       return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
//     } else if (days > 0) {
//       return `${days} ${days === 1 ? 'day' : 'days'}`;
//     } else if (hours > 0) {
//       return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
//     } else {
//       return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
//     }
//   } else {
//     return 'you are good to go';
//   }
// }

export function remainingTime(lastInteractedAt, howManyTimesAnsChanged, usersChangeTheirAns) {
  const validateInterval = () => {
    if (usersChangeTheirAns === 'Daily') {
      return 24 * 60 * 60 * 1000;
    } else if (usersChangeTheirAns === 'Weekly') {
      return 7 * 24 * 60 * 60 * 1000;
    } else if (usersChangeTheirAns === 'Monthly') {
      return 30 * 24 * 60 * 60 * 1000;
    } else if (usersChangeTheirAns === 'Yearly') {
      return 365 * 24 * 60 * 60 * 1000;
    } else if (usersChangeTheirAns === 'TwoYears') {
      return 2 * 365 * 24 * 60 * 60 * 1000;
    } else if (usersChangeTheirAns === 'FourYears') {
      return 4 * 365 * 24 * 60 * 60 * 1000;
    }
  };

  const currentDate = new Date();
  const timeInterval = validateInterval();

  if (howManyTimesAnsChanged >= 1 && currentDate - new Date(lastInteractedAt) < timeInterval) {
    const timeLeft = timeInterval - (currentDate - new Date(lastInteractedAt));

    const minutes = Math.floor(timeLeft / (60 * 1000));
    const hours = Math.floor(timeLeft / (60 * 60 * 1000));
    const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    const twoYears = Math.floor(days / (2 * 365));
    const fourYears = Math.floor(days / (4 * 365));

    if (fourYears > 0) {
      return `${fourYears} four years`;
    } else if (twoYears > 0) {
      return `${twoYears} two years`;
    } else if (years > 0) {
      return `${years} ${years === 1 ? 'year' : 'years'}`;
    } else if (months > 0) {
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    } else if (weeks > 0) {
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
    } else if (days > 0) {
      return `${days} ${days === 1 ? 'day' : 'days'}`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    } else {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    }
  } else {
    return 'you are good to go';
  }
}

export const handleClickScroll = () => {
  const element = document.getElementById('section-1');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

function matchFilters(filters, state) {
  for (const key in filters) {
    if (
      filters.hasOwnProperty(key) &&
      state.hasOwnProperty(key) &&
      key !== 'columns' &&
      key !== 'searchData' &&
      key !== 'expandedView'
    ) {
      const filterValue = filters[key];
      const stateValue = state[key];

      if (filterValue !== stateValue) {
        return false;
      }
    }
  }

  return true;
}

export const printNoRecordsMessage = (
  persistedTheme,
  isBookmarked,
  filterStates,
  dispatch,
  setFilters,
  resetOtherStates
) => {
  const filtersActions = homeFilterActions;
  const result = matchFilters(filtersInitialState, filterStates);
  const resultPreferences = filterStates?.topics?.Block?.list?.length === 0;
  const resultPreferencesForBookmark = true;
  const isOtherCategory = filterStates?.topics?.Block?.list !== undefined && filterStates?.topics?.Block.list[0];
  return (
    <div className="dark:text-gray-1 my-[15vh] flex flex-col items-center justify-center">
      <img
        src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/error-bot.svg' : 'assets/svgs/dashboard/noMatchingLight.svg'}`}
        alt="no posts image"
        className="h-[173px] w-[160px]"
      />
      {isBookmarked ? (
        <div className="flex flex-col items-center gap-[10px] tablet:gap-4">
          <p className="font-inter mt-[1.319vw] text-center text-[5.083vw] font-bold tablet:text-[2.083vw]">
            No bookmarks found!
          </p>
          {(result === false || !resultPreferencesForBookmark) && (
            <button
              className={`${
                persistedTheme === 'dark' ? 'bg-[#333B46]' : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
              } inset-0 w-fit rounded-[0.375rem] px-[0.56rem] py-[0.35rem] text-[0.625rem] font-semibold leading-[1.032] text-white shadow-inner dark:text-[#EAEAEA] tablet:pt-2 tablet:text-[15px] tablet:leading-normal laptop:w-[192px] laptop:rounded-[0.938rem] laptop:px-5 laptop:py-2 laptop:text-[1.25rem]`}
              onClick={() => {
                const { topics: topicsFilter, ...filterWithoutTopicsAll } = filterStates;
                const { topics: topicsInitialState, ...initialStateWithoutTopicsAll } =
                  homeFilterActions.filterInitialState;
                dispatch(filtersActions.setBlockTopics([]));

                if (!isEqual(filterWithoutTopicsAll, initialStateWithoutTopicsAll)) {
                  dispatch(filtersActions.resetOtherFilters());
                  setFilters(resetOtherStates);
                }
                dispatch(setIsShowPlayer(false));
                dispatch(setPlayingPlayerId(''));
                dispatch(resetPlayingIds());
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-[10px] tablet:gap-4">
          <p className="font-inter mt-[1.319vw] text-center text-[5.083vw] font-bold tablet:text-[4vw] laptop:text-[2.083vw]">
            No matching posts found!
          </p>
          {(result === false || !resultPreferences) && isOtherCategory !== 'Other' && (
            <button
              className={`${
                persistedTheme === 'dark' ? 'bg-[#333B46]' : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
              } inset-0 w-fit rounded-[0.375rem] px-[0.56rem] py-[0.35rem] text-[0.625rem] font-semibold leading-[1.032] text-white shadow-inner dark:text-[#EAEAEA] tablet:pt-2 tablet:text-[15px] tablet:leading-normal laptop:w-[192px] laptop:rounded-[0.938rem] laptop:px-5 laptop:py-2 laptop:text-[1.25rem]`}
              onClick={() => {
                const { topics: topicsFilter, ...filterWithoutTopicsAll } = filterStates;
                const { topics: topicsInitialState, ...initialStateWithoutTopicsAll } =
                  homeFilterActions.filterInitialState;
                dispatch(filtersActions.setBlockTopics([]));
                if (!isEqual(filterWithoutTopicsAll, initialStateWithoutTopicsAll)) {
                  dispatch(filtersActions.resetOtherFilters());
                  setFilters(resetOtherStates);
                }
                dispatch(setIsShowPlayer(false));
                dispatch(setPlayingPlayerId(''));
                dispatch(resetPlayingIds());
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export const printEndMessage = (allData, isBookmarked, isFetching) => {
  const dispatch = useDispatch();
  const filtersActions = homeFilterActions;
  const filterStates = useSelector(filtersActions.getFilters);
  const result = matchFilters(filtersInitialState, filterStates);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const resultPreferences = filterStates?.topics?.Block?.list?.length === 0;
  const resultPreferencesForBookmark = true;
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const resetOtherStates = {
    filterByStatus: 'All',
    filterByType: 'All',
    filterByScope: 'All',
    filterByMedia: 'All',
    bookmarks: false,
    filterBySort: 'Newest First',
    clearFilter: false,
    topics: {
      ...filterStates.topics,
      Block: {
        ...filterStates.topics.Block,
        list: [],
      },
    },
    selectedBtnId: 'newButton',
    uuid: persistedUserInfo.uuid,
  };

  const { mutateAsync: setFilters } = useMutation({
    mutationFn: setFilterStates,
    onError: (err) => {
      console.log(err);
    },
  });

  return !isFetching ? (
    <div className="text-gray-1 flex justify-center gap-4 px-4 pb-8 pt-3 tablet:py-[27px]">
      {filterStates.searchData && allData.length == 0 ? (
        <div className="my-[15vh] flex flex-col items-center justify-center">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/error-bot.svg' : 'assets/svgs/dashboard/noMatchingLight.svg'}`}
            alt="no posts image"
            className="h-[173px] w-[160px]"
          />
          {isBookmarked ? (
            <div className="flex flex-col items-center gap-[10px] tablet:gap-4">
              <p className="font-inter mt-[1.319vw] text-center text-[5.083vw] font-bold tablet:text-[2.083vw]">
                No bookmarks found!
              </p>
              {(result === false || !resultPreferencesForBookmark) && (
                <button
                  className={`${
                    persistedTheme === 'dark' ? 'bg-[#333B46]' : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
                  } inset-0 w-fit rounded-[0.375rem] px-[0.56rem] py-[0.35rem] text-[0.625rem] font-semibold leading-[1.032] text-white shadow-inner dark:text-[#EAEAEA] tablet:pt-2 tablet:text-[15px] tablet:leading-normal laptop:w-[192px] laptop:rounded-[0.938rem] laptop:px-5 laptop:py-2 laptop:text-[1.25rem]`}
                  onClick={() => {
                    const { topics: topicsFilter, ...filterWithoutTopicsAll } = filterStates;
                    const { topics: topicsInitialState, ...initialStateWithoutTopicsAll } =
                      homeFilterActions.filterInitialState;
                    dispatch(filtersActions.setBlockTopics([]));
                    if (!isEqual(filterWithoutTopicsAll, initialStateWithoutTopicsAll)) {
                      dispatch(filtersActions.resetOtherFilters());
                      setFilters(resetOtherStates);
                    }
                    dispatch(setIsShowPlayer(false));
                    dispatch(setPlayingPlayerId(''));
                    dispatch(resetPlayingIds());
                  }}
                >
                  Clear Filters
                </button>
              )}
              <button
                className={`${
                  persistedTheme === 'dark' ? 'bg-[#333B46]' : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
                } inset-0 w-fit rounded-[0.375rem] px-[0.56rem] py-[0.35rem] text-[0.625rem] font-semibold leading-[1.032] text-white shadow-inner dark:text-[#EAEAEA] tablet:pt-2 tablet:text-[15px] tablet:leading-normal laptop:w-[192px] laptop:rounded-[0.938rem] laptop:px-5 laptop:py-2 laptop:text-[1.25rem]`}
                onClick={() => {
                  dispatch(filtersActions.resetSearchData());
                }}
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-[10px] tablet:gap-4">
              <p className="font-inter mt-[1.319vw] text-center text-[5.083vw] font-bold tablet:text-[2.083vw]">
                No matching posts found!
              </p>
              {(result === false || !resultPreferences) && (
                <button
                  className={`${
                    persistedTheme === 'dark' ? 'bg-[#333B46]' : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
                  } inset-0 w-fit rounded-[0.375rem] px-[0.56rem] py-[0.35rem] text-[0.625rem] font-semibold leading-[1.032] text-white shadow-inner dark:text-[#EAEAEA] tablet:pt-2 tablet:text-[15px] tablet:leading-normal laptop:w-[192px] laptop:rounded-[0.938rem] laptop:px-5 laptop:py-2 laptop:text-[1.25rem]`}
                  onClick={() => {
                    const { topics: topicsFilter, ...filterWithoutTopicsAll } = filterStates;
                    const { topics: topicsInitialState, ...initialStateWithoutTopicsAll } =
                      homeFilterActions.filterInitialState;
                    dispatch(filtersActions.setBlockTopics([]));
                    if (!isEqual(filterWithoutTopicsAll, initialStateWithoutTopicsAll)) {
                      dispatch(filtersActions.resetOtherFilters());
                      setFilters(resetOtherStates);
                    }
                    dispatch(setIsShowPlayer(false));
                    dispatch(setPlayingPlayerId(''));
                    dispatch(resetPlayingIds());
                  }}
                >
                  Clear Filters
                </button>
              )}
              <button
                className={`${
                  persistedTheme === 'dark' ? 'bg-[#333B46]' : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
                } inset-0 w-fit rounded-[0.375rem] px-[0.56rem] py-[0.35rem] text-[0.625rem] font-semibold leading-[1.032] text-white shadow-inner dark:text-[#EAEAEA] tablet:pt-2 tablet:text-[15px] tablet:leading-normal laptop:w-[192px] laptop:rounded-[0.938rem] laptop:px-5 laptop:py-2 laptop:text-[1.25rem]`}
                onClick={() => {
                  dispatch(filtersActions.resetSearchData());
                }}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      ) : !filterStates.searchData && allData && allData?.length === 0 ? (
        <>{printNoRecordsMessage(persistedTheme, isBookmarked, filterStates, dispatch, setFilters, resetOtherStates)}</>
      ) : !filterStates.searchData ? (
        <div className="text-center text-[4vw] laptop:text-[2vw]">
          {isBookmarked ? (
            <div className="flex flex-col items-center gap-[10px] tablet:gap-4">
              <b>{!resultPreferencesForBookmark ? 'No more matching bookmarks found!' : 'No more bookmarks!'}</b>
              {(result === false || !resultPreferencesForBookmark) && (
                <button
                  className={`${
                    persistedTheme === 'dark' ? 'bg-[#333B46]' : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
                  } inset-0 w-fit rounded-[0.375rem] px-[0.56rem] py-[0.35rem] text-[0.625rem] font-semibold leading-[1.032] text-white shadow-inner dark:text-[#EAEAEA] tablet:pt-2 tablet:text-[15px] tablet:leading-normal laptop:w-[192px] laptop:rounded-[0.938rem] laptop:px-5 laptop:py-2 laptop:text-[1.25rem]`}
                  onClick={() => {
                    const { topics: topicsFilter, ...filterWithoutTopicsAll } = filterStates;
                    const { topics: topicsInitialState, ...initialStateWithoutTopicsAll } =
                      homeFilterActions.filterInitialState;
                    dispatch(filtersActions.setBlockTopics([]));
                    if (!isEqual(filterWithoutTopicsAll, initialStateWithoutTopicsAll)) {
                      dispatch(filtersActions.resetOtherFilters());
                      setFilters(resetOtherStates);
                    }
                    dispatch(setIsShowPlayer(false));
                    dispatch(setPlayingPlayerId(''));
                    dispatch(resetPlayingIds());
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : result === false || !resultPreferences ? (
            <div className="flex flex-col items-center gap-[10px] tablet:gap-4">
              <b>
                {result === false || !resultPreferences ? 'No more matching posts found!' : 'You are all caught up!'}
              </b>
              {(result === false || !resultPreferences) && (
                <button
                  className={`${
                    persistedTheme === 'dark' ? 'bg-[#333B46]' : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
                  } inset-0 w-fit rounded-[0.375rem] px-[0.56rem] py-[0.35rem] text-[0.625rem] font-semibold leading-[1.032] text-white shadow-inner dark:text-[#EAEAEA] tablet:pt-2 tablet:text-[15px] tablet:leading-normal laptop:w-[192px] laptop:rounded-[0.938rem] laptop:px-5 laptop:py-2 laptop:text-[1.25rem]`}
                  // onClick={() => {
                  //   dispatch(filtersActions.resetOtherFilters());
                  //   localStorage.setItem('filterByState', 'false');
                  // }}
                  onClick={() => {
                    const { topics: topicsFilter, ...filterWithoutTopicsAll } = filterStates;
                    const { topics: topicsInitialState, ...initialStateWithoutTopicsAll } =
                      homeFilterActions.filterInitialState;
                    dispatch(filtersActions.setBlockTopics([]));
                    if (!isEqual(filterWithoutTopicsAll, initialStateWithoutTopicsAll)) {
                      dispatch(filtersActions.resetOtherFilters());
                      setFilters(resetOtherStates);
                    }
                    dispatch(setIsShowPlayer(false));
                    dispatch(setPlayingPlayerId(''));
                    dispatch(resetPlayingIds());
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <b>You are all caught up!</b>
          )}
        </div>
      ) : (
        <div className="text-center text-[4vw] laptop:text-[2vw]">
          {isBookmarked ? (
            <div className="flex flex-col items-center gap-[10px] tablet:gap-4">
              <b>No more bookmarks!</b>{' '}
              {(result === false || !resultPreferencesForBookmark) && (
                <button
                  className={`${
                    persistedTheme === 'dark' ? 'bg-[#333B46]' : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
                  } inset-0 w-fit rounded-[0.375rem] px-[0.56rem] py-[0.35rem] text-[0.625rem] font-semibold leading-[1.032] text-white shadow-inner dark:text-[#EAEAEA] tablet:pt-2 tablet:text-[15px] tablet:leading-normal laptop:w-[192px] laptop:rounded-[0.938rem] laptop:px-5 laptop:py-2 laptop:text-[1.25rem]`}
                  onClick={() => {
                    const { topics: topicsFilter, ...filterWithoutTopicsAll } = filterStates;
                    const { topics: topicsInitialState, ...initialStateWithoutTopicsAll } =
                      homeFilterActions.filterInitialState;
                    dispatch(filtersActions.setBlockTopics([]));
                    if (!isEqual(filterWithoutTopicsAll, initialStateWithoutTopicsAll)) {
                      dispatch(filtersActions.resetOtherFilters());
                      setFilters(resetOtherStates);
                    }
                    dispatch(setIsShowPlayer(false));
                    dispatch(setPlayingPlayerId(''));
                    dispatch(resetPlayingIds());
                  }}
                >
                  Clear Filters
                </button>
              )}
              <button
                className={`${
                  persistedTheme === 'dark' ? 'bg-[#333B46]' : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
                } inset-0 w-fit rounded-[0.375rem] px-[0.56rem] py-[0.35rem] text-[0.625rem] font-semibold leading-[1.032] text-white shadow-inner dark:text-[#EAEAEA] tablet:pt-2 tablet:text-[15px] tablet:leading-normal laptop:w-[192px] laptop:rounded-[0.938rem] laptop:px-5 laptop:py-2 laptop:text-[1.25rem]`}
                onClick={() => {
                  dispatch(filtersActions.resetSearchData());
                }}
              >
                Clear Search
              </button>
            </div>
          ) : filterStates?.searchData ? (
            <div className="flex flex-col items-center gap-[10px] tablet:gap-4">
              <b>No more matching posts found!</b>
              <button
                className={`${
                  persistedTheme === 'dark' ? 'bg-[#333B46]' : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
                } inset-0 w-fit rounded-[0.375rem] px-[0.56rem] py-[0.35rem] text-[0.625rem] font-semibold leading-[1.032] text-white shadow-inner dark:text-[#EAEAEA] tablet:pt-2 tablet:text-[15px] tablet:leading-normal laptop:w-[192px] laptop:rounded-[0.938rem] laptop:px-5 laptop:py-2 laptop:text-[1.25rem]`}
                onClick={() => {
                  dispatch(filtersActions.resetSearchData());
                }}
              >
                Clear Search
              </button>
            </div>
          ) : (
            <b>You are all caught up!</b>
          )}
        </div>
      )}
    </div>
  ) : (
    <div className="flex items-center justify-center pb-[6rem] pt-3 tablet:py-[27px]">
      <FaSpinner className="animate-spin text-[10vw] text-blue-100 tablet:text-[8vw] laptop:text-[4vw]" />
    </div>
  );
};

export const validateInterval = (usersChangeTheirAns) => {
  let timeInterval = 0;
  if (usersChangeTheirAns === 'Daily') {
    return (timeInterval = 24 * 60 * 60 * 1000); // 24 hours in milliseconds
  } else if (usersChangeTheirAns === 'Weekly') {
    return (timeInterval = 7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
  } else if (usersChangeTheirAns === 'Monthly') {
    // Assuming 30 days in a month for simplicity
    return (timeInterval = 30 * 24 * 60 * 60 * 1000); // 30 days in milliseconds
  } else if (usersChangeTheirAns === 'Yearly') {
    // Assuming 365 days in a year for simplicity
    return (timeInterval = 365 * 24 * 60 * 60 * 1000); // 365 days in milliseconds
  } else if (usersChangeTheirAns === 'TwoYears') {
    // Assuming 2 years
    return (timeInterval = 2 * 365 * 24 * 60 * 60 * 1000); // 2 years in milliseconds
  } else if (usersChangeTheirAns === 'FourYears') {
    // Assuming 4 years
    return (timeInterval = 4 * 365 * 24 * 60 * 60 * 1000); // 4 years in milliseconds
  }
};

export const capitalizeFirstLetter = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};
