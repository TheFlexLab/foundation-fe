import { Link, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilterStates } from '../services/api/userAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setIsShowPlayer, setPlayingPlayerId, resetPlayingIds } from '../features/quest/utilsSlice';
import * as QuestServices from '../services/queries/quest';
import * as homeFilterActions from '../features/sidebar/filtersSlice';
import * as bookmarkFiltersActions from '../features/sidebar/bookmarkFilterSlice';

function Slider() {
  let filtersActions;
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const rightArrowRef = useRef(null);
  const leftArrowRef = useRef(null);
  const tabsListRef = useRef(null);
  const tabRefs = useRef([]);
  const queryClient = useQueryClient();
  const [dragging, setDragging] = useState(false);

  if (location.pathname === '/bookmark') {
    filtersActions = bookmarkFiltersActions;
  } else {
    filtersActions = homeFilterActions;
  }

  const filterStates = useSelector(filtersActions.getFilters);

  const manageIcons = () => {
    if (tabsListRef.current.scrollLeft >= 20) {
      leftArrowRef.current.classList.add('active');
    } else {
      leftArrowRef.current.classList.remove('active');
    }

    let maxScrollValue = tabsListRef.current.scrollWidth - tabsListRef.current.clientWidth - 20;
    if (tabsListRef.current.scrollLeft >= maxScrollValue) {
      rightArrowRef.current.classList.remove('active');
    } else {
      rightArrowRef.current.classList.add('active');
    }
  };

  const handleRightArrowClick = () => {
    tabsListRef.current.scrollLeft += 200;
    manageIcons();
  };

  const handleLeftArrowClick = () => {
    tabsListRef.current.scrollLeft -= 200;
    manageIcons();
  };

  const drag = (e) => {
    if (!dragging) return;
    tabsListRef.current.classList.add('dragging');
    tabsListRef.current.scrollLeft -= e.movementX;
  };

  useEffect(() => {
    const tabsList = tabsListRef.current;
    const handleMouseUp = () => {
      setDragging(false);
      tabsList.classList.remove('dragging');
    };

    document.addEventListener('mouseup', handleMouseUp);
    tabsList.addEventListener('scroll', manageIcons);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      tabsList.removeEventListener('scroll', manageIcons);
    };
  }, [dragging]);

  const { data: topicsData, isSuccess } = QuestServices.useGetAllTopics();

  useEffect(() => {
    if (isSuccess) {
      dispatch(homeFilterActions.setTopics(topicsData?.data.data || []));
    }
  }, [topicsData, isSuccess]);

  const { mutateAsync: setFilters } = useMutation({
    mutationFn: setFilterStates,
    onError: (err) => {
      console.log(err);
    },
  });

  const handleButtonSelection = (type, data, id) => {
    queryClient.cancelQueries('posts');

    localStorage.setItem('selectedButtonId', id);
    const selectedButton = document.getElementById(id);
    if (selectedButton) {
      selectedButton.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    const container = document.getElementById('post-container');
    container?.scrollTo({ top: 0, behavior: 'smooth' });

    switch (type) {
      case 'newest-first':
        if (filterStates.filterBySort !== 'Newest First') {
          setFilters({
            ...filterStates,
            filterBySort: 'Newest First',
            filterByScope: '',
            bookmarks: false,
            selectedBtnId: localStorage.getItem('selectedButtonId'),
            topics: {
              ...filterStates.topics,
              Block: {
                ...filterStates.topics.Block,
                list: [],
              },
            },
            uuid: persistedUserInfo.uuid,
          });
          dispatch(setIsShowPlayer(false));
          dispatch(setPlayingPlayerId(''));
          dispatch(resetPlayingIds());
          dispatch(filtersActions.setBookmarks(false));
          dispatch(homeFilterActions.setBlockTopics([]));
          dispatch(filtersActions.setFilterByScope('All'));
          dispatch(filtersActions.setFilterBySort('Newest First'));
        }
        break;
      case 'oldest-first':
        if (filterStates.filterBySort !== 'Oldest First') {
          setFilters({
            ...filterStates,
            filterBySort: 'Oldest First',
            filterByScope: '',
            bookmarks: false,
            selectedBtnId: localStorage.getItem('selectedButtonId'),
            topics: {
              ...filterStates.topics,
              Block: {
                ...filterStates.topics.Block,
                list: [],
              },
            },
            uuid: persistedUserInfo.uuid,
          });
          dispatch(setIsShowPlayer(false));
          dispatch(setPlayingPlayerId(''));
          dispatch(resetPlayingIds());
          dispatch(filtersActions.setBookmarks(false));
          dispatch(homeFilterActions.setBlockTopics([]));
          dispatch(filtersActions.setFilterByScope('All'));
          dispatch(filtersActions.setFilterBySort('Oldest First'));
        }
        break;
      case 'most-popular':
        if (filterStates.filterBySort !== 'Most Popular') {
          setFilters({
            ...filterStates,
            filterByScope: '',
            filterBySort: 'Most Popular',
            bookmarks: false,
            selectedBtnId: localStorage.getItem('selectedButtonId'),
            topics: {
              ...filterStates.topics,
              Block: {
                ...filterStates.topics.Block,
                list: [],
              },
            },
            uuid: persistedUserInfo.uuid,
          });
          dispatch(setIsShowPlayer(false));
          dispatch(setPlayingPlayerId(''));
          dispatch(resetPlayingIds());
          dispatch(filtersActions.setBookmarks(false));
          dispatch(homeFilterActions.setBlockTopics([]));
          dispatch(filtersActions.setFilterByScope(true));
          dispatch(filtersActions.setFilterBySort('Most Popular'));
        }
        break;
      case 'wow':
        if (filterStates.filterBySort !== 'Wow') {
          setFilters({
            ...filterStates,
            filterByScope: '',
            filterBySort: 'Wow',
            bookmarks: false,
            selectedBtnId: localStorage.getItem('selectedButtonId'),
            topics: {
              ...filterStates.topics,
              Block: {
                ...filterStates.topics.Block,
                list: [],
              },
            },
            uuid: persistedUserInfo.uuid,
          });
          dispatch(setIsShowPlayer(false));
          dispatch(setPlayingPlayerId(''));
          dispatch(resetPlayingIds());
          dispatch(filtersActions.setBookmarks(false));
          dispatch(homeFilterActions.setBlockTopics([]));
          dispatch(filtersActions.setFilterByScope(true));
          dispatch(filtersActions.setFilterBySort('Wow'));
        }
        break;
      case 'my-posts':
        if (filterStates.filterByScope !== 'Me') {
          setFilters({
            ...filterStates,
            filterByScope: 'Me',
            bookmarks: false,
            filterBySort: '',
            selectedBtnId: localStorage.getItem('selectedButtonId'),
            topics: {
              ...filterStates.topics,
              Block: {
                ...filterStates.topics.Block,
                list: [],
              },
            },
            uuid: persistedUserInfo.uuid,
          });
          dispatch(setIsShowPlayer(false));
          dispatch(setPlayingPlayerId(''));
          dispatch(resetPlayingIds());
          dispatch(filtersActions.setBookmarks(false));
          dispatch(homeFilterActions.setBlockTopics([]));
          dispatch(filtersActions.setFilterBySort(''));
          dispatch(filtersActions.setFilterByScope('Me'));
        }
        break;
      case 'bookmarks':
        if (filterStates.bookmarks !== true) {
          setFilters({
            ...filterStates,
            filterBySort: '',
            filterByScope: '',
            bookmarks: true,
            selectedBtnId: localStorage.getItem('selectedButtonId'),
            topics: {
              ...filterStates.topics,
              Block: {
                ...filterStates.topics.Block,
                list: [],
              },
            },
            uuid: persistedUserInfo.uuid,
          });
          dispatch(setIsShowPlayer(false));
          dispatch(setPlayingPlayerId(''));
          dispatch(resetPlayingIds());
          dispatch(homeFilterActions.setBlockTopics([]));
          dispatch(filtersActions.setFilterBySort(''));
          dispatch(filtersActions.setFilterByScope('All'));
          dispatch(filtersActions.setBookmarks(true));
        }
        break;
      case 'topics':
        if (filterStates.topics?.Block && filterStates.topics?.Block.list.includes(data)) return;
        setFilters({
          ...filterStates,
          filterBySort: '',
          filterByScope: '',
          bookmarks: false,
          topics: {
            ...filterStates.topics,
            Block: {
              ...filterStates.topics.Block,
              list: [data],
            },
          },
          selectedBtnId: id,
          uuid: persistedUserInfo.uuid,
        });
        dispatch(setIsShowPlayer(false));
        dispatch(setPlayingPlayerId(''));
        dispatch(resetPlayingIds());
        dispatch(filtersActions.setBookmarks(false));
        dispatch(filtersActions.setBlockTopics([data]));
        dispatch(filtersActions.setFilterBySort(''));
        dispatch(filtersActions.setFilterByScope('All'));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const selectedButtonId = localStorage.getItem('selectedButtonId');
    const selectedButton = document.getElementById(selectedButtonId);
    if (selectedButton) {
      selectedButton.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [filterStates.topics]);

  return (
    <div className="scrollable-tabs-container">
      <div ref={leftArrowRef} className="left-arrow" onClick={handleLeftArrowClick}>
        <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/arrow-right.svg`}
          alt="arrow-right.svg"
          className="size-[10px] rotate-180 tablet:size-6"
        />
      </div>
      <ul ref={tabsListRef} onMouseDown={() => setDragging(true)} onMouseMove={drag}>
        <div className="flex gap-[6.75px] border-r-[2.4px] border-[#CECECE] pr-[6.75px] dark:border-[#CECDCD] tablet:gap-[13.82px] tablet:pr-[13.82px]">
          <Link
            className={`${filterStates.filterBySort === 'Newest First' ? 'slider-link-active' : 'slider-link-inactive'} slider-link`}
            to={''}
            onClick={() => {
              handleButtonSelection('newest-first', null, 'newButton');
            }}
            id={'newButton'}
          >
            New!
          </Link>
          <Link
            className={`${filterStates.filterBySort === 'Oldest First' ? 'slider-link-active' : 'slider-link-inactive'} slider-link`}
            to={''}
            onClick={() => {
              handleButtonSelection('oldest-first', null, 'oldButton');
            }}
            id={'oldButton'}
          >
            Old!
          </Link>
          <Link
            className={`${filterStates.filterBySort === 'Most Popular' ? 'slider-link-active' : 'slider-link-inactive'} slider-link`}
            to={''}
            onClick={() => {
              handleButtonSelection('most-popular', null, 'trendingButton');
            }}
            id={'trendingButton'}
          >
            Trending!
          </Link>
          <Link
            className={`${filterStates.filterBySort === 'Wow' ? 'slider-link-active' : 'slider-link-inactive'} slider-link`}
            to={''}
            onClick={() => {
              handleButtonSelection('wow', null, 'wowButton');
            }}
            id={'wowButton'}
          >
            Wow!
          </Link>
        </div>
        <div className="flex gap-[6.75px] border-r-[2.4px] border-[#CECECE] pr-[6.75px] dark:border-[#CECDCD] tablet:gap-[13.82px] tablet:pr-[13.82px]">
          <Link
            className={`${filterStates.filterByScope === 'Me' ? 'slider-link-active' : 'slider-link-inactive'} slider-link`}
            to={''}
            onClick={() => {
              handleButtonSelection('my-posts', null, 'myPostButton');
            }}
            id={'myPostButton'}
          >
            My Posts
          </Link>
          <Link
            className={`${filterStates.bookmarks === true ? 'slider-link-active' : 'slider-link-inactive'} slider-link`}
            to={''}
            onClick={() => {
              handleButtonSelection('bookmarks', null, 'bookmarkButton');
            }}
            id={'bookmarkButton'}
          >
            Bookmarks
          </Link>
        </div>
        {filterStates.topics?.All?.list.map((tab, index) => {
          const isItemBlocked = filterStates.topics?.Block && filterStates.topics?.Block?.list?.includes(tab);
          return (
            <li key={index} ref={(el) => (tabRefs.current[index] = el)}>
              <Link
                className={`${isItemBlocked ? 'slider-link-active' : 'slider-inactive'} slider-link`}
                to={''}
                onClick={() => {
                  handleButtonSelection('topics', tab, `topic-${index}`);
                }}
                id={`topic-${index}`}
              >
                {tab}
              </Link>
            </li>
          );
        })}
      </ul>
      <div ref={rightArrowRef} className="right-arrow active" onClick={handleRightArrowClick}>
        <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/arrow-right.svg`}
          alt="arrow-right.svg"
          className="size-[10px] tablet:size-6"
        />
      </div>
    </div>
  );
}

export default Slider;
