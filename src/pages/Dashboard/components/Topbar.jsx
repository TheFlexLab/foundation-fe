import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MobileTopbarItems, TopbarItems } from '../../../constants/topbar';
import {
  addSharedLinkPost,
  resetPlayingIds,
  setIsShowPlayer,
  setPlayingPlayerId,
} from '../../../features/quest/utilsSlice';
import * as createQuestActions from '../../../features/createQuest/createQuestSlice';
import * as pictureMediaAction from '../../../features/createQuest/pictureMediaSlice';
import { useMutation, useQuery } from '@tanstack/react-query';
import { setFilterStates } from '../../../services/api/userAuth';
import * as homeFilterActions from '../../../features/sidebar/filtersSlice';
import { appVersion } from '../../../version';
import { getRecievedMessages } from '../../../services/api/directMessagingApi';
import { setGuestSignUpDialogue } from '../../../features/extras/extrasSlice';
import GuestDialogueScreen from '../../../components/GuestDialogueScreen';
import { getSeldonState, handleSeldonInput, resetSeldonState } from '../../../features/seldon-ai/seldonSlice';
import { resetSeldonDataState } from '../../../features/seldon-ai/seldonDataSlice';
import NavMobileMenu from './NavMobileMenu';

const Topbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const filterStates = useSelector(homeFilterActions.getFilters);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const isPseudoBadge = persistedUserInfo?.badges?.some((badge) => (badge?.pseudo ? true : false));
  const seldonState = useSelector(getSeldonState);

  const { mutateAsync: setFilters } = useMutation({
    mutationFn: setFilterStates,
    onError: (err) => {
      console.log(err);
    },
  });

  const { data: receivedMsg } = useQuery({
    queryKey: ['receivedMsg'],
    queryFn: () => getRecievedMessages(persistedUserInfo.uuid),
    refetchInterval: 300000,
  });

  const handleHomeClick = () => {
    if (filterStates.filterBySort !== 'Newest First') {
      localStorage.setItem('selectedButtonId', 'newButton');

      dispatch(homeFilterActions.setBookmarks(false));
      dispatch(homeFilterActions.setBlockTopics([]));
      dispatch(homeFilterActions.setFilterByScope('All'));
      dispatch(homeFilterActions.setFilterBySort('Newest First'));

      setFilters({
        ...filterStates,
        filterBySort: 'Newest First',
        filterByScope: '',
        bookmarks: false,
        selectedBtnId: 'newButton',
        topics: {
          ...filterStates.topics,
          Block: {
            ...filterStates.topics.Block,
            list: [],
          },
        },
        uuid: persistedUserInfo.uuid,
      });
    }

    dispatch(setIsShowPlayer(false));
    dispatch(setPlayingPlayerId(''));
    dispatch(resetPlayingIds());
    dispatch(createQuestActions.resetCreateQuest());

    navigate('/');
  };

  return (
    <>
      <GuestDialogueScreen />
      <div className="border-blue-100 border-b-blue-100 bg-blue-100 dark:border-b-gray-100 dark:bg-gray-200 tablet:border-b-[1.85px]">
        <div className="static mx-auto flex h-[48px] max-h-[48px] min-h-[48px] w-full max-w-[1378px] flex-col items-center justify-between tablet:h-20 tablet:min-h-20 laptop:h-[92px] laptop:max-h-[69px] laptop:min-h-[69px] laptop:flex-row">
          <div className="relative flex h-full w-full items-center justify-between px-4 py-[13px] tablet:min-w-[18.25rem] laptop:w-[18.25rem] laptop:px-0 laptop:py-0 laptop:pl-[31px] desktop:pl-0 5xl:w-[23rem] 5xl:min-w-[23rem]">
            <div className="flex w-full items-center justify-between gap-[25px] laptop:justify-center">
              <div className="flex cursor-pointer items-center gap-[10px] tablet:gap-[25px]">
                <div className="relative flex justify-center" onClick={handleHomeClick}>
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/topbar/${location.pathname === '/' ? 'home-filled.svg' : 'home.svg'}`}
                    alt="foundation_logo"
                    className="size-5 tablet:size-8"
                  />
                </div>
                <div
                  className="relative justify-center laptop:flex"
                  onClick={() => {
                    navigate('/news');
                  }}
                >
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/topbar/${location.pathname === '/news' ? 'news-active.svg' : 'news.svg'}`}
                    alt="news-feed-icon"
                    className="size-5 tablet:size-8"
                  />
                </div>
                <div className="flex flex-col gap-[2px] tablet:gap-[6px]" onClick={handleHomeClick}>
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/foundation_logo.svg`}
                    alt="foundation_logo"
                    className="h-[10px] w-auto tablet:h-auto"
                  />
                  <span className="w-fit whitespace-nowrap font-poppins text-[10px] font-medium leading-[10px] text-[#D0E4F2] tablet:text-[14px] tablet:leading-[14px]">
                    v {appVersion}
                  </span>
                </div>
              </div>
              {/* Mobile */}
              <div className="flex w-fit items-center justify-end gap-3 text-[11.8px] font-semibold leading-normal text-white tablet:gap-6 tablet:text-[21.4px] laptop:hidden laptop:gap-[78px]">
                {MobileTopbarItems.filter((item) => {
                  if (persistedUserInfo.role === 'guest' || persistedUserInfo.role === 'visitor') {
                    // Hide both item.id 2 for guest or visitor roles
                    return item.id !== 2;
                  }

                  // For all other cases, show the item
                  return true;
                }).map((item) => (
                  <Link
                    key={item.id}
                    to={
                      (persistedUserInfo.role === 'guest' || persistedUserInfo?.role === 'visitor') && item.id === 1
                        ? item.signupPath
                        : item.path
                    }
                    className={`${
                      item.activePaths?.some((path) => location.pathname === path) ||
                      location.pathname === `${item.path}/`
                        ? 'text-white'
                        : persistedTheme === 'dark'
                          ? 'text-[#92959D]'
                          : 'text-[#BEDEF4]'
                    } relative flex size-full items-center`}
                    onClick={() => {
                      dispatch(createQuestActions.resetCreateQuest());
                      dispatch(pictureMediaAction.resetToInitialState());
                      dispatch(addSharedLinkPost(null));

                      if (
                        (persistedUserInfo.role === 'guest' || persistedUserInfo?.role === 'visitor') &&
                        item.id === 1
                      ) {
                        dispatch(
                          setGuestSignUpDialogue('Please create an account to unlock all features and claim your FDX.')
                        );
                      }
                    }}
                  >
                    {item.id === 2 && receivedMsg?.data?.count > 0 && (
                      <div className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-red-100 tablet:size-5">
                        <p className="text-[10px] leading-[10px] text-white">{receivedMsg?.data?.count}</p>
                      </div>
                    )}
                    <img
                      src={
                        (persistedUserInfo.role === 'guest' || persistedUserInfo?.role === 'visitor') && item.id === 1
                          ? item.signupIcon
                          : item.activePaths?.some((path) => location.pathname === path) ||
                              location.pathname === `${item.path}/`
                            ? item.iconSelected
                            : item.icon
                      }
                      alt="arrow-right"
                      className="size-5 tablet:size-8"
                    />
                  </Link>
                ))}
                <NavMobileMenu />
              </div>
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden h-full w-[23rem] min-w-[23rem] cursor-pointer items-center justify-end gap-6 text-[28px] font-semibold leading-normal text-white 2xl:w-[25rem] 2xl:text-[30px] laptop:flex laptop:w-[18.25rem] laptop:min-w-[18.25rem] laptop:gap-[35px] laptop:px-0 laptop:py-0 laptop:pr-[31px] desktop:pr-0">
            {TopbarItems.filter((item) => {
              if (persistedUserInfo.role === 'guest' || persistedUserInfo.role === 'visitor') {
                // Hide both item.id 5 and 6 for guest or visitor roles
                return item.id !== 5 && item.id !== 6;
              }

              // Hide item.id 6 only if isPseudoBadge is true
              if (!isPseudoBadge) {
                return item.id !== 6;
              }

              // For all other cases, show the item
              return true;
            }).map((item) => (
              <Link
                key={item.id}
                to={
                  (persistedUserInfo.role === 'guest' || persistedUserInfo?.role === 'visitor') && item.id === 1
                    ? '#'
                    : item.path
                }
                className={`${
                  item.activePaths?.some((path) => location.pathname === path) || location.pathname === `${item.path}/`
                    ? 'text-white'
                    : persistedTheme === 'dark'
                      ? 'text-[#92959D]'
                      : 'text-[#BEDEF4]'
                } relative flex h-full items-center`}
                onClick={() => {
                  dispatch(createQuestActions.resetCreateQuest());
                  dispatch(pictureMediaAction.resetToInitialState());
                  dispatch(addSharedLinkPost(null));

                  if ((persistedUserInfo.role === 'guest' || persistedUserInfo?.role === 'visitor') && item.id === 1) {
                    dispatch(
                      setGuestSignUpDialogue('Please create an account to unlock all features and claim your FDX.')
                    );
                  }
                  if (item.id === 6) {
                    if (seldonState.isTitle) {
                      dispatch(resetSeldonState());
                      dispatch(handleSeldonInput({ name: 'isTitle', value: false }));
                      dispatch(handleSeldonInput({ name: 'question', value: '' }));
                      dispatch(resetSeldonDataState());
                    }
                  }
                }}
              >
                {item.id === 5 && receivedMsg?.data?.count > 0 && (
                  <div className="absolute -right-3 top-3 flex size-5 items-center justify-center rounded-full bg-red-100">
                    <p className="text-[16px] leading-[15px] text-white">{receivedMsg?.data?.count}</p>
                  </div>
                )}
                <img
                  src={
                    (persistedUserInfo.role === 'guest' || persistedUserInfo?.role === 'visitor') && item.id === 1
                      ? item.signupIcon
                      : item.activePaths?.some((path) => location.pathname === path) ||
                          location.pathname === `${item.path}/`
                        ? item.iconSelected
                        : item.icon
                  }
                  alt="arrow-right"
                  className="size-8"
                />
              </Link>
            ))}

            <NavMobileMenu />
          </div>
        </div>
      </div>
    </>
  );
};

export default Topbar;
