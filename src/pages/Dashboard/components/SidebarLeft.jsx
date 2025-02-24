import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import * as homeFilterActions from '../../../features/sidebar/filtersSlice';
import * as bookmarkFiltersActions from '../../../features/sidebar/bookmarkFilterSlice';
import { GrClose } from 'react-icons/gr';
import { setFilterStates } from '../../../services/api/userAuth';
import { setPlayingPlayerId, setIsShowPlayer, getQuestUtils } from '../../../features/quest/utilsSlice';
import { useDebounce } from '../../../utils/useDebounce';
import Ratings from '../../../components/dialogue-boxes/Ratings';
import MediaControls from '../../../components/MediaControls';

const SidebarLeft = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { pathname } = location;
  let filtersActions;
  if (pathname === '/bookmark') {
    filtersActions = bookmarkFiltersActions;
  } else {
    filtersActions = homeFilterActions;
  }
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const filterStates = useSelector(filtersActions.getFilters);
  const questUtilsState = useSelector(getQuestUtils);
  const [ratingsDialogue, setRatingsDialogue] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]); //for ratings
  const [search, setSearch] = useState(
    pathname === '/bookmark' ? persistedUserInfo?.bookmarkStates.searchData : persistedUserInfo?.States.searchData
  );

  const showRatingDialogue = () => setRatingsDialogue(true);
  const hideRatingDialogue = () => setRatingsDialogue(false);

  const { mutateAsync: setFilters } = useMutation({
    mutationFn: setFilterStates,
    onError: (err) => {
      console.log(err);
    },
  });

  // useEffect(() => {
  //   const userData = JSON.parse(localStorage.getItem('userData'));
  //   dispatch(filtersActions.setFilterByScope(userData?.States.filterByScope));
  //   dispatch(filtersActions.setFilterBySort(userData?.States.filterBySort));
  //   dispatch(filtersActions.setFilterByStatus(userData?.States.filterByStatus));
  //   dispatch(filtersActions.setFilterByType(userData?.States.filterByType));
  //   dispatch(filtersActions.setFilterByMedia(userData?.States.filterByMedia));
  //   dispatch(filtersActions.setExpandedView(true));
  //   dispatch(filtersActions.setBookmarks(userData?.States.bookmarks));
  //   dispatch(filtersActions.setSearchData(userData?.States.searchData));
  //   dispatch(filtersActions.setBlockTopics(userData?.States.topics?.Block.list));
  //   dispatch(
  //     filtersActions.setRatings({
  //       initial: userData?.States.moderationRatingFilter?.initial
  //         ? userData?.States.moderationRatingFilter?.initial
  //         : 0,
  //       final: userData?.States.moderationRatingFilter?.final ? userData?.States.moderationRatingFilter?.final : 0,
  //     }),
  //   );
  //   localStorage.setItem('selectedButtonId', userData?.States.selectedBtnId);
  // }, []);

  // Search
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const debouncedSearch = useDebounce(search, 1000);

  useEffect(() => {
    dispatch(filtersActions.setSearchData(debouncedSearch));
  }, [debouncedSearch]);

  useEffect(() => {
    if (filterStates.searchData === '') {
      setSearch('');
    }
  }, [filterStates.searchData]);

  useEffect(() => {
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
  }, [ratingsDialogue]);

  return (
    <div className="block">
      <Ratings
        modalVisible={ratingsDialogue}
        handleClose={hideRatingDialogue}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        setFilters={setFilters}
      />
      <div className="my-[15px] ml-[31px] hidden h-fit w-[18.75rem] min-w-[18.75rem] rounded-[15px] bg-white py-[23px] pl-[1.3rem] pr-[2.1rem] dark:border dark:border-gray-100 dark:bg-gray-200 laptop:block">
        <div className="relative">
          <div className="relative h-[45px] w-full">
            <input
              type="text"
              id="floating_outlined"
              className="peer block h-full w-full appearance-none rounded-[10px] border-2 border-[#707175] bg-transparent py-2 pl-5 pr-8 text-sm text-gray-1 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-white-100 dark:text-white-100 dark:focus:border-blue-500 tablet:text-[18.23px]"
              value={search}
              placeholder=""
              onChange={handleSearch}
            />
            <label
              htmlFor="floating_outlined"
              className="absolute left-[15px] start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-200 dark:text-white-100 peer-focus:dark:text-blue-500 tablet:text-[17px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
            >
              Search
            </label>
          </div>
          {search && (
            <button
              className="absolute right-3 top-4"
              onClick={() => {
                dispatch(filtersActions.setSearchData(''));
                setSearch('');
              }}
            >
              <GrClose className="h-4 w-4 text-[#ACACAC] dark:text-white" />
            </button>
          )}
          {!search && (
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/search.svg`}
              alt="search"
              className="absolute right-3 top-4 h-4 w-4"
            />
          )}
        </div>
      </div>
      <div className="my-[15px] ml-[31px] hidden h-fit w-[18.75rem] min-w-[18.75rem] rounded-[15px] border-gray-100 bg-white py-[23px] pl-[1.3rem] pr-[2.1rem] dark:border dark:bg-gray-200 laptop:block">
        <div className="flex w-full flex-col items-center justify-center gap-[25px]">
          <button
            onClick={() => {
              showRatingDialogue();
            }}
            className="w-[212px] rounded-[9.338px] bg-gradient-to-r from-[#6BA5CF] to-[#389CE3] px-5 py-3 text-[18px] font-medium leading-[18px] text-white focus:outline-none"
          >
            Filters
          </button>
        </div>
      </div>

      <div>
        {/* {questUtilsState.isShowPlayer && (
          <div className="ml-[31px] mt-[30px] hidden max-w-[285px] laptop:block">
            <div className="relative">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/mediaCloseIcon.svg`}
                alt="mediaCloseIcon"
                className="absolute -right-3 -top-3 h-6 w-6 cursor-pointer text-black tablet:-right-[14px] tablet:-top-[18px] tablet:size-[33px] dark:text-white"
                onClick={() => {
                  dispatch(setIsShowPlayer(false));
                  dispatch(setPlayingPlayerId(''));
                }}
              />
            </div>
            <MediaControls />
          </div>
        )} */}
        {/* sidebar mobile */}
        <div className="block bg-white px-4 py-[10px] dark:bg-[#0A0A0C] tablet:px-6 tablet:py-5 laptop:hidden laptop:py-[26px]">
          <div className="flex h-[23px] w-full items-center justify-between gap-2 tablet:h-[36px]">
            <button
              className="inset-0 h-full w-[75px] min-w-[75px] max-w-[75px] text-nowrap rounded-[0.375rem] bg-gradient-to-r from-[#6BA5CF] to-[#389CE3] px-[0.56rem] py-[0.35rem] text-[0.625rem] font-normal leading-[1.032] text-white shadow-inner dark:from-gray-300 dark:to-gray-300 dark:text-gray-1 tablet:w-[192px] tablet:min-w-[192px] tablet:max-w-[192px] tablet:pt-2 tablet:text-[15px] tablet:font-semibold tablet:leading-normal laptop:rounded-[0.938rem] laptop:px-5 laptop:py-2 laptop:text-[1.25rem]"
              onClick={() => {
                showRatingDialogue();
              }}
            >
              Filters
            </button>
            <div className="relative flex w-full items-center">
              <input
                type="text"
                placeholder="Search here...."
                className="h-[23px] w-full rounded-[8px] border-[0.59px] border-[#707175] bg-[#F6F6F6] pl-[10px] pr-6 text-[9px] font-normal text-[#858585] focus:outline-none dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:h-[36px] tablet:pr-10 tablet:text-[16px] tablet:leading-[16px]"
                value={search}
                onChange={handleSearch}
              />
              {search && (
                <button
                  className="absolute right-3 top-[50%] translate-y-[-50%]"
                  onClick={() => {
                    dispatch(filtersActions.setSearchData(''));
                    setSearch('');
                  }}
                >
                  <GrClose className="size-2 text-black dark:text-white tablet:size-4" />
                </button>
              )}
              {!search && (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/search.svg' : 'assets/svgs/dashboard/search.svg'}`}
                  alt="search"
                  className="absolute right-[12px] top-1/2 h-3 w-3 -translate-y-1/2 tablet:h-5 tablet:w-6"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarLeft;
