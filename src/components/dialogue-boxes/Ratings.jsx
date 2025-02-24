import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { useSelector, useDispatch } from 'react-redux';
import PopUp from '../ui/PopUp';
import * as homeFilterActions from '../../features/sidebar/filtersSlice';
import * as bookmarkFiltersActions from '../../features/sidebar/bookmarkFilterSlice';
import { useLocation } from 'react-router-dom';
import { isEqual } from 'lodash';
import { setIsShowPlayer, setPlayingPlayerId, resetPlayingIds } from '../../features/quest/utilsSlice';
import { setGuestSignUpDialogue } from '../../features/extras/extrasSlice';

export const StatusFiltersList = [
  {
    id: 1,
    title: 'All',
    val: 'All',
  },
  {
    id: 2,
    title: 'Not Participated',
    val: 'Not Participated',
  },
  {
    id: 3,
    title: 'Participated',
    val: 'Participated',
  },
];

export const MediaFiltersList = [
  {
    id: 1,
    title: 'All',
    val: 'All',
  },
  {
    id: 2,
    title: 'Flickr',
    val: 'Image',
  },
  {
    id: 3,
    title: 'YouTube',
    val: 'Video',
  },
  {
    id: 4,
    title: 'Soundcloud',
    val: 'Music',
  },
  {
    id: 5,
    title: 'GIPHY',
    val: 'Giphy',
  },
  {
    id: 6,
    title: 'None',
    val: 'None',
  },
];

export const TypeFiltersList = [
  {
    id: 1,
    title: 'All',
    val: 'All',
  },
  {
    id: 2,
    title: 'Yes/No',
    val: 'yes/no',
  },
  {
    id: 3,
    title: 'Multiple Choice',
    val: 'multiple choise',
  },
  {
    id: 4,
    title: 'Open Choice',
    val: 'open choice',
  },
  {
    id: 5,
    title: 'Ranked Choice',
    val: 'ranked choise',
  },
  {
    id: 6,
    title: 'Agree/Disagree',
    val: 'agree/disagree',
  },
  {
    id: 7,
    title: 'Like/Dislike',
    val: 'like/dislike',
  },
];

export const filterTitles = {
  All: 'All',
  'Yes/No': 'Yes/No',
  'Agree/Disagree': 'Agree/Disagree',
  'Like/Dislike': 'Like/Dislike',
  'Multiple Choise': 'Multiple Choice',
  'Open Choice': 'Open Choice',
  'Ranked Choise': 'Rank Choice',
};

const FilterContainer = (props) => {
  const { heading, list, style } = props;

  return (
    <div className={`w-full`}>
      <div className="rounded-t-[15px] border-x-[3px] border-t-[3px] border-white-500 bg-white-500 py-2 dark:border-gray-100 dark:bg-accent-100">
        <h1 className="text-gray text-center text-[12px] font-bold dark:text-gray-300 tablet:text-[22px]">{heading}</h1>
      </div>
      <div
        className={` ${style === 'yes' ? 'grid h-[calc(125px-26px)] grid-cols-2' : 'flex h-[calc(100%-34px)]'} flex-col gap-[6px] rounded-b-[15px] border-x-[3px] border-b-[3px] border-white-500 bg-white-900 p-2 dark:border-gray-100 dark:bg-gray-200 tablet:h-[calc(100%-49px)] tablet:gap-4 tablet:p-[15px]`}
      >
        {list?.map((item, index) => (
          <div
            key={index + 1}
            className="flex cursor-pointer items-center gap-3 tablet:gap-6"
            onClick={() => {
              if (heading === 'Status') {
                props.setFilterValues({ ...props.filterValues, status: item.title });
              }
              if (heading === 'Type') {
                props.setFilterValues({ ...props.filterValues, type: item.val });
              }
              if (heading === 'Media') {
                props.setFilterValues({ ...props.filterValues, media: item.val });
              }
            }}
          >
            <div className="flex size-4 min-h-4 min-w-4 items-center justify-center rounded-full border-2 border-[#525252] dark:border-gray-300 tablet:size-6 tablet:min-h-6 tablet:min-w-6">
              {heading === 'Status' && props.filterValues.status === item.title ? (
                <div className="size-2 min-h-2 min-w-2 rounded-full bg-[#525252] dark:bg-gray-300 tablet:size-[14px] tablet:min-h-[14px] tablet:min-w-[14px]"></div>
              ) : heading === 'Type' && props.filterValues.type === item.val ? (
                <div className="size-2 min-h-2 min-w-2 rounded-full bg-[#525252] dark:bg-gray-300 tablet:size-[14px] tablet:min-h-[14px] tablet:min-w-[14px]"></div>
              ) : heading === 'Media' && props.filterValues.media === item.val ? (
                <div className="size-2 min-h-2 min-w-2 rounded-full bg-[#525252] dark:bg-gray-300 tablet:size-[14px] tablet:min-h-[14px] tablet:min-w-[14px]"></div>
              ) : null}
            </div>

            <h3 className="text-gray-1 whitespace-nowrap text-center text-[12px] font-normal leading-[12px] dark:text-gray-300 tablet:text-[18px] tablet:font-semibold tablet:leading-[18px]">
              {item.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Ratings({ handleClose, modalVisible, selectedOptions, setSelectedOptions, setFilters }) {
  const location = useLocation();
  let filtersActions;
  if (location.pathname === '/bookmark') {
    filtersActions = bookmarkFiltersActions;
  } else {
    filtersActions = homeFilterActions;
  }
  const dispatch = useDispatch();
  const filterStates = useSelector(filtersActions.getFilters);
  const [filterValues, setFilterValues] = useState({});
  const persistedUserInfo = useSelector((state) => state.auth.user);

  useEffect(() => {
    setFilterValues({
      type: filterStates.filterByType,
      media: filterStates.filterByMedia,
      status: filterStates.filterByStatus,
    });
  }, [
    filterStates.filterByType,
    filterStates.filterByMedia,
    filterStates.filterByStatus,
    filterStates.moderationRatingFilter,
  ]);

  useEffect(() => {
    dispatch(
      filtersActions.setRatings({
        initial: filterStates.moderationRatingFilter?.initial ? filterStates.moderationRatingFilter?.initial : 0,
        final: filterStates.moderationRatingFilter?.final ? filterStates.moderationRatingFilter?.final : 0,
      })
    );
    if (filterStates.moderationRatingFilter?.initial === 0 && filterStates.moderationRatingFilter?.final === 100) {
      setSelectedOptions(['adult', 'everyone']);
    } else if (
      filterStates.moderationRatingFilter?.initial === 1 &&
      filterStates.moderationRatingFilter?.final === 100
    ) {
      setSelectedOptions(['adult']);
    } else {
      setSelectedOptions(['everyone']);
    }
  }, []);

  const handleCheckboxChange = (option) => {
    if (selectedOptions.includes(option)) {
      if (selectedOptions.length > 1) {
        setSelectedOptions(selectedOptions.filter((item) => item !== option));
      }
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleSubmit = () => {
    dispatch(setIsShowPlayer(false));
    dispatch(setPlayingPlayerId(''));
    dispatch(resetPlayingIds());
    dispatch(homeFilterActions.setFilterByType(filterValues.type));
    dispatch(homeFilterActions.setFilterByStatus(filterValues.status));
    dispatch(homeFilterActions.setFilterByMedia(filterValues.media));
    if (selectedOptions.includes('adult') && selectedOptions.includes('everyone')) {
      dispatch(
        filtersActions.setRatings({
          initial: 0,
          final: 100,
        })
      );
    } else if (selectedOptions.includes('adult')) {
      dispatch(
        filtersActions.setRatings({
          initial: 1,
          final: 100,
        })
      );
    } else {
      dispatch(
        filtersActions.setRatings({
          initial: 0,
          final: 0,
        })
      );
    }
    setFilters({
      ...filterStates,
      filterByType: filterValues.type,
      filterByMedia: filterValues.media,
      filterByStatus: filterValues.status,
      moderationRatingFilter: {
        initial:
          selectedOptions.includes('adult') && selectedOptions.includes('everyone')
            ? 0
            : selectedOptions.includes('adult')
              ? 1
              : 0,
        final:
          selectedOptions.includes('adult') && selectedOptions.includes('everyone')
            ? 100
            : selectedOptions.includes('adult')
              ? 100
              : 0,
      },
      uuid: persistedUserInfo.uuid,
      // filterBySort: 'Newest First',
      // filterByScope: '',
      // bookmarks: false,
      // topics: {
      //   ...filterStates.topics,
      //   Block: {
      //     ...filterStates.topics.Block,
      //     list: [],
      //   },
      // },

      // selectedBtnId: localStorage.removeItem('selectedButtonId'),
    });
    // }

    // filterStates.moderationRatingFilter.initial,
    // filterStates.moderationRatingFilter.final,
    // if (filterValues.status !== '') {
    //   dispatch(homeFilterActions.setFilterByStatus(filterValues.status));
    //   setFilters({
    //     ...filterStates,
    //     filterByStatus: filterValues.status,
    //     filterByMedia: 'All',
    //     filterBySort: 'Newest First',
    //     filterByScope: '',
    //     bookmarks: false,
    //     topics: {
    //       ...filterStates.topics,
    //       Block: {
    //         ...filterStates.topics.Block,
    //         list: [],
    //       },
    //     },
    //     selectedBtnId: localStorage.removeItem('selectedButtonId'),
    //   });
    // }
    // if (filterValues.media !== '') {
    //   dispatch(homeFilterActions.setFilterByMedia(filterValues.media));
    //   setFilters({
    //     ...filterStates,
    //     filterByMedia: filterValues.media,
    //     filterByStatus: 'All',
    //     filterBySort: 'Newest First',
    //     filterByScope: '',
    //     bookmarks: false,
    //     topics: {
    //       ...filterStates.topics,
    //       Block: {
    //         ...filterStates.topics.Block,
    //         list: [],
    //       },
    //     },
    //     selectedBtnId: localStorage.removeItem('selectedButtonId'),
    //   });
    // }
    // if (selectedOptions.includes('adult') && selectedOptions.includes('everyone')) {
    //   dispatch(
    //     filtersActions.setRatings({
    //       initial: 0,
    //       final: 100,
    //     }),
    //   );
    //   setFilters({
    //     ...filterStates,
    //     filterByType: 'All',
    //     filterByStatus: 'All',
    //     filterBySort: 'Newest First',
    //     filterByScope: '',
    //     bookmarks: false,
    //     topics: {
    //       ...filterStates.topics,
    //       Block: {
    //         ...filterStates.topics.Block,
    //         list: [],
    //       },
    //     },
    //     moderationRatingFilter: {
    //       initial: 0,
    //       final: 100,
    //     },
    //     selectedBtnId: localStorage.removeItem('selectedButtonId'),
    //   });
    // } else if (selectedOptions.includes('adult')) {
    //   dispatch(
    //     filtersActions.setRatings({
    //       initial: 1,
    //       final: 100,
    //     }),
    //   );
    //   setFilters({
    //     ...filterStates,
    //     filterByType: 'All',
    //     filterByStatus: 'All',
    //     filterBySort: 'Newest First',
    //     filterByScope: '',
    //     bookmarks: false,
    //     topics: {
    //       ...filterStates.topics,
    //       Block: {
    //         ...filterStates.topics.Block,
    //         list: [],
    //       },
    //     },
    //     moderationRatingFilter: {
    //       initial: 1,
    //       final: 100,
    //     },
    //     selectedBtnId: localStorage.removeItem('selectedButtonId'),
    //   });
    // } else {
    //   dispatch(
    //     filtersActions.setRatings({
    //       initial: 0,
    //       final: 0,
    //     }),
    //   );
    //   setFilters({
    //     ...filterStates,
    //     filterByType: 'All',
    //     filterByStatus: 'All',
    //     filterBySort: 'Newest First',
    //     filterByScope: '',
    //     bookmarks: false,
    //     topics: {
    //       ...filterStates.topics,
    //       Block: {
    //         ...filterStates.topics.Block,
    //         list: [],
    //       },
    //     },
    //     moderationRatingFilter: {
    //       initial: 0,
    //       final: 0,
    //     },
    //     selectedBtnId: localStorage.removeItem('selectedButtonId'),
    //   });
    // }

    handleClose();
  };
  return (
    <PopUp
      logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/dialoguebox/ratings-icon.svg`}
      title={'Filters'}
      open={modalVisible}
      handleClose={() => {
        setFilterValues({
          type: filterStates.filterByType,
          media: filterStates.filterByMedia,
          status: filterStates.filterByStatus,
        });
        handleClose();
      }}
    >
      <div className="px-[18px] pt-[10px] tablet:px-[45px] tablet:pt-[25px]">
        <h1 className="text-gray-1 text-[10px] font-medium leading-[12px] dark:text-gray-300 tablet:text-[20px] tablet:leading-[24.2px]">
          Select your Rating Category
        </h1>
        <div className="mt-[10px] flex items-center justify-center gap-[36.8px] border-b border-[#7C7C7C] pb-[25px] dark:border-gray-300 tablet:mt-[25px] tablet:gap-[100px]">
          <div className="flex items-center justify-center gap-[10px] tablet:gap-[25px]">
            <div id="custom-rating-checkbox" className="flex h-full items-center">
              <input
                id="small-checkbox"
                type="checkbox"
                className="checkbox h-[13.5px] w-[13.5px] rounded-full tablet:h-[25px] tablet:w-[25px]"
                checked={selectedOptions.includes('everyone')}
                onChange={() => handleCheckboxChange('everyone')}
                readOnly
              />
            </div>
            <div className="flex items-center justify-center gap-[8px]">
              <img
                src="/assets/svgs/ratings/desk-e.svg"
                alt=""
                className="h-[15px] w-[15px] tablet:h-[35px] tablet:w-[35px]"
              />
              <p className="text-gray-1 text-[10px] font-semibold dark:text-gray-300 tablet:text-[20px]">Everyone</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-[10px] tablet:gap-[25px]">
            <div id="custom-rating-checkbox" className="flex h-full items-center">
              <input
                id="small-checkbox"
                type="checkbox"
                className="checkbox h-[13.5px] w-[13.5px] rounded-full tablet:h-[25px] tablet:w-[25px]"
                checked={selectedOptions.includes('adult')}
                onChange={() => {
                  if (persistedUserInfo?.role === 'guest' || persistedUserInfo?.role === 'visitor') {
                    dispatch(setGuestSignUpDialogue(true));
                    return;
                  }
                  handleCheckboxChange('adult');
                }}
                readOnly
              />
            </div>
            <div className="flex items-center justify-center gap-[8px]">
              <img
                src="/assets/svgs/ratings/desk-r.svg"
                alt=""
                className="h-[15px] w-[15px] tablet:h-[35px] tablet:w-[35px]"
              />
              <p className="text-gray-1 text-[10px] font-semibold dark:text-gray-300 tablet:text-[20px]">Adult</p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-[18px] py-[10px] tablet:px-[45px] tablet:py-[25px]">
        <h1 className="text-gray-1 text-[10px] font-medium leading-[12px] dark:text-gray-300 tablet:text-[20px] tablet:leading-[24.2px]">
          Select your Filter Options
        </h1>
        <div className="mt-3 grid grid-cols-2 gap-[15px] tablet:mt-5 laptop:grid-cols-3">
          <FilterContainer
            heading="Status"
            list={StatusFiltersList}
            setFilters={setFilters}
            filterValues={filterValues}
            setFilterValues={setFilterValues}
          />
          <FilterContainer
            heading="Media"
            list={MediaFiltersList}
            setFilters={setFilters}
            filterValues={filterValues}
            setFilterValues={setFilterValues}
          />
          <div className="hidden laptop:block">
            <FilterContainer
              heading="Type"
              list={TypeFiltersList}
              setFilters={setFilters}
              filterValues={filterValues}
              setFilterValues={setFilterValues}
            />
          </div>
        </div>
        <div className="mt-3 block laptop:hidden">
          <FilterContainer
            heading="Type"
            list={TypeFiltersList}
            style="yes"
            setFilters={setFilters}
            filterValues={filterValues}
            setFilterValues={setFilterValues}
          />
        </div>
        <div className="mt-[10px] flex items-center justify-end gap-[25px] tablet:mt-[25px] tablet:gap-[35px]">
          <Button
            variant={'danger'}
            onClick={() => {
              dispatch(setIsShowPlayer(false));
              dispatch(setPlayingPlayerId(''));
              dispatch(resetPlayingIds());
              setFilterValues({
                type: 'All',
                media: 'All',
                status: 'All',
              });
              const { topics: topicsFilter, ...filterWithoutTopicsAll } = filterStates;
              const { topics: topicsInitialState, ...initialStateWithoutTopicsAll } =
                homeFilterActions.filterInitialState;

              dispatch(homeFilterActions.setBlockTopics([]));
              if (!isEqual(filterWithoutTopicsAll, initialStateWithoutTopicsAll)) {
                dispatch(homeFilterActions.resetFilters());
                setFilters({
                  expandedView: true,
                  searchData: '',
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
                });
              }
            }}
          >
            Clear Filters
          </Button>

          <Button variant={'submit'} onClick={handleSubmit}>
            Apply
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
