import { useEffect, useMemo } from 'react';
import { printEndMessage } from '../../../../utils';
import { useSelector, useDispatch } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import { useFetchPosts } from '../../../../services/queries/post';
import { getFilters } from '../../../../features/sidebar/filtersSlice';
import * as questUtilsActions from '../../../../features/quest/utilsSlice';
import Slider from '../../../../components/Slider';
import SidebarLeft from '../../components/SidebarLeft';
import MediaControls from '../../../../components/MediaControls';
import QuestionCardWithToggle from './components/QuestionCardWithToggle';
import SystemNotificationCard from '../../../../components/posts/SystemNotificationCard';

const QuestStartSection = () => {
  const dispatch = useDispatch();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const filterStates = useSelector(getFilters);
  const questUtils = useSelector(questUtilsActions.getQuestUtils);

  const { ref, inView } = useInView();

  const { data, status, error, fetchNextPage, hasNextPage, isFetching } = useFetchPosts(
    filterStates,
    persistedUserInfo
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
    dispatch(questUtilsActions.setNextPage(hasNextPage));
  }, [inView, hasNextPage, fetchNextPage, dispatch]);

  if (status === 'error') {
    return <p>Error: {error.message}</p>;
  }

  const content = useMemo(
    () =>
      data?.pages.map((posts) =>
        posts.map((post, index) => {
          const isLastPost = index === posts.length - 1;

          if (post.id === 'system_notification') {
            return <SystemNotificationCard key={index + 1} post={post} innerRef={isLastPost ? ref : null} />;
          }

          return (
            <QuestionCardWithToggle
              key={post._id}
              innerRef={isLastPost ? ref : null}
              questStartData={post}
              playing={post._id === questUtils.playerPlayingId && questUtils.isMediaPlaying}
            />
          );
        })
      ),
    [data, ref, questUtils]
  );

  return (
    <div className="mx-auto w-full max-w-[1440px] bg-[#F2F3F5] dark:bg-black laptop:mx-[331px] desktop:mx-auto">
      <div className="relative mx-auto flex w-full max-w-[778px] flex-col laptop:flex-row">
        <div className="block tablet:hidden">
          <SidebarLeft />
        </div>
        <div className="mx-auto flex h-full max-h-[calc(100dvh-134px)] min-h-[calc(100dvh-134px)] w-full max-w-[778px] flex-col overflow-y-hidden bg-[#F2F3F5] no-scrollbar dark:bg-black tablet:max-h-[calc(100dvh-172px)] tablet:min-h-[calc(100dvh-172px)] laptop:max-h-[calc(100dvh-70px)] laptop:min-h-[calc(100dvh-70px)]">
          <div className="fixed left-auto right-auto max-w-full laptop:max-w-[calc(100%-662px)] desktop:max-w-[calc(1440px-662px)]">
            <Slider isFetching={isFetching} />
          </div>
          <div
            id="post-container"
            className="mt-10 flex h-[calc(100dvh-174px)] flex-col gap-2 overflow-y-auto px-4 pb-[10px] no-scrollbar tablet:mt-[77.63px] tablet:h-[calc(100dvh-314px)] tablet:gap-5 tablet:px-6 tablet:pb-5 laptop:h-full laptop:max-h-[calc(100dvh-147px)]"
          >
            {content}
            {printEndMessage(data?.pages[0], filterStates.bookmarks, isFetching)}
          </div>
        </div>
        {questUtils.isShowPlayer && (
          <div className="absolute bottom-0 left-1/2 z-10 block -translate-x-1/2 laptop:hidden">
            <div className="relative">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/mediaCloseIcon.svg`}
                alt="mediaCloseIcon"
                className="absolute -right-2 top-3 z-20 h-6 w-6 cursor-pointer text-black dark:text-white"
                onClick={() => {
                  dispatch(questUtilsActions.setIsShowPlayer(false));
                  dispatch(questUtilsActions.setPlayingPlayerId(''));
                }}
              />
            </div>
            <MediaControls />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestStartSection;
