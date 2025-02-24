import { useDispatch } from 'react-redux';
import { getQuestUtils, toggleMedia } from '../features/quest/utilsSlice';
import * as questUtilsActions from '../features/quest/utilsSlice';
import { useSelector } from 'react-redux';

export default function MediaControls() {
  const dispatch = useDispatch();
  const questUtilsState = useSelector(getQuestUtils);

  const scrollToPlayingCard = () => {
    const playingCard = document.getElementById('playing-card');

    if (playingCard) {
      playingCard.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const runLoop = () => {
    dispatch(questUtilsActions.toggleLoop(!questUtilsState.loop));
  };

  const playPrevious = () => {
    const index = questUtilsState.playingIds.findIndex((mediaId) => mediaId === questUtilsState.playerPlayingId);
    if (index !== -1 && index - 1 >= 0) {
      dispatch(questUtilsActions.setPlayingPlayerId(questUtilsState.playingIds[index - 1]));
      dispatch(questUtilsActions.toggleMedia(true));
    }
  };

  const playNext = () => {
    const index = questUtilsState.playingIds.findIndex((mediaId) => mediaId === questUtilsState.playerPlayingId);
    if (index !== -1 && index + 1 < questUtilsState.playingIds.length) {
      dispatch(questUtilsActions.setPlayingPlayerId(questUtilsState.playingIds[index + 1]));
      dispatch(questUtilsActions.toggleMedia(true));
    } else if (
      index !== -1 &&
      index + 1 >= questUtilsState.playingIds.length &&
      questUtilsState.hasNextPage === false
    ) {
      dispatch(questUtilsActions.setPlayingPlayerId(questUtilsState.playingIds[0]));
      dispatch(questUtilsActions.toggleMedia(true));
    }
  };

  return (
    <div className="my-5 flex w-max items-center justify-center gap-2 rounded-[9.211px] border-[2.86px] border-[#CECFD1] bg-white px-4 py-2 dark:border-gray-100 dark:bg-gray-200 tablet:w-fit tablet:max-w-[300px] tablet:gap-3 tablet:rounded-[14px] tablet:py-3">
      {/* {questUtilsState.loop ? 'Loop' : 'Series'} */}
      <img
        src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/player/${questUtilsState.loop ? 'loop.svg' : 'series.svg'}`}
        onClick={() => {
          runLoop();
        }}
        className="size-6 cursor-pointer tablet:size-[33px]"
      />
      <img
        src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/player/back.svg`}
        className={`${
          questUtilsState.playingIds.findIndex((mediaId) => mediaId === questUtilsState.playerPlayingId) === 0
            ? 'opacity-[60%]'
            : 'opacity-[100%]'
        } size-6 cursor-pointer tablet:size-[33px]`}
        onClick={playPrevious}
      />

      <button
        onClick={() => dispatch(toggleMedia(questUtilsState.isMediaPlaying === true ? false : true))}
        className="flex size-6 items-center justify-center tablet:size-[33px]"
      >
        {!questUtilsState.isMediaPlaying ? (
          <svg className="size-6 tablet:size-[33px]" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="17.3346" cy="16.6667" r="16.6667" fill="#7C7C7C" />
            <path
              d="M13.9961 12.041C13.9961 11.8501 14.0486 11.6628 14.1479 11.4997C14.2472 11.3367 14.3894 11.204 14.5591 11.1163C14.7287 11.0286 14.9192 10.9893 15.1097 11.0025C15.3002 11.0158 15.4834 11.0812 15.6392 11.1915L22.9281 16.3581C23.0635 16.4538 23.1741 16.5804 23.2506 16.7275C23.3272 16.8746 23.3675 17.0378 23.3682 17.2036C23.3689 17.3693 23.33 17.5329 23.2547 17.6806C23.1794 17.8283 23.07 17.9559 22.9354 18.0528L15.6465 23.2964C15.491 23.4085 15.3076 23.4756 15.1164 23.4901C14.9252 23.5047 14.7337 23.4662 14.5631 23.3788C14.3924 23.2915 14.2491 23.1588 14.1491 22.9953C14.049 22.8318 13.9961 22.6438 13.9961 22.4521V12.041Z"
              fill="white"
            />
          </svg>
        ) : (
          <svg className="size-6 tablet:size-[33px]" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16.9089" cy="16.9523" r="16.6667" fill="#7C7C7C" />
            <rect x="12.625" y="10.7622" width="2.53541" height="12.4952" rx="0.89652" fill="white" />
            <rect x="18.418" y="10.7622" width="2.53541" height="12.4952" rx="0.89652" fill="white" />
          </svg>
        )}
      </button>
      <img
        src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/player/next.svg`}
        onClick={playNext}
        className={`${
          questUtilsState.playingIds.findIndex((mediaId) => mediaId === questUtilsState.playerPlayingId) + 1 >=
            questUtilsState.playingIds.length && questUtilsState.hasNextPage === true
            ? 'opacity-[60%]'
            : 'opacity-[100%]'
        } size-6 cursor-pointer tablet:size-[33px]`}
      />
      <button
        className="rounded-[3.892px] bg-[#A3A3A3] px-4 py-2 text-[10px] font-medium leading-normal text-white tablet:rounded-[7.78px] tablet:py-2 tablet:text-[18px]"
        onClick={() => {
          scrollToPlayingCard();
        }}
      >
        Playing
      </button>
    </div>
  );
}
