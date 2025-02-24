import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tooltip } from '../../../../../utils/Tooltip';
import { Button } from '../../../../../components/ui/Button';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { useDebounce } from '../../../../../utils/useDebounce';
import { extractPartFromUrl, extractYouTubeVideoId } from '../../../../../utils/embeddedutils';
import { soundcloudUnique, youtubeBaseURLs } from '../../../../../constants/addMedia';
import * as createQuestAction from '../../../../../features/createQuest/createQuestSlice';
import ReactPlayer from 'react-player/lazy';
import './Player.css';
import showToast from '../../../../../components/ui/Toast';

export default function AddAudio({ handleTab }) {
  const playerRef = useRef(null);
  const dispatch = useDispatch();
  const getMediaStates = useSelector(createQuestAction.getMedia);
  let debouncedURL = useDebounce(getMediaStates.url, 1000);
  const [mediaURL, setMediaURL] = useState(debouncedURL);

  const handleVideoEnded = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.getInternalPlayer().play(); // Resume playback
    }
  };

  // To show and hide artwork on different screen sizes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 744) {
        // Hide artwork for screens smaller than 400px
        setMediaURL(`${debouncedURL}&show_artwork=false`);
      } else {
        // Show artwork for larger screens
        setMediaURL(debouncedURL);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [debouncedURL]);

  // To Check If it is a playlist url
  useEffect(() => {
    // Check if the URL is a SoundCloud playlist
    if (getMediaStates.url?.includes(soundcloudUnique) && getMediaStates.url?.includes('/sets/')) {
      showToast('error', 'soundCloudPlaylistNot');
      dispatch(createQuestAction.clearUrl());
      return;
    }

    // Check if the URL is a YouTube playlist
    if (
      youtubeBaseURLs.some((baseURL) => getMediaStates.url?.includes(baseURL)) &&
      getMediaStates.url.includes('list=')
    ) {
      showToast('error', 'youtubePlaylistNot');
      dispatch(createQuestAction.clearUrl());
      return;
    }
  }, [debouncedURL]);

  const handleDescChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue.length <= 350) {
      dispatch(createQuestAction.addMediaDesc(inputValue));
    }
  };

  const descVerification = async (value) => {
    if (getMediaStates.validatedDescription === value) return;
    dispatch(createQuestAction.checkDescription(value));
  };

  const urlVerification = async (value) => {
    if (getMediaStates.validatedUrl === value) return;

    if (youtubeBaseURLs.some((baseURL) => value?.includes(baseURL))) {
      const videoId = extractYouTubeVideoId(value);

      dispatch(createQuestAction.checkIsUrlAlreayExists({ id: videoId, url: getMediaStates.url }));
    } else if (value?.includes(soundcloudUnique)) {
      const urlId = extractPartFromUrl(value);
      dispatch(createQuestAction.checkIsUrlAlreayExists({ id: urlId, url: getMediaStates.url }));
    } else {
      showToast('error', 'youtubeSoundCloudLinks');
    }
  };

  return (
    <div>
      {getMediaStates?.isMedia ? (
        <div className="w-[calc(100%-51.75px] relative mt-3 flex flex-col gap-[6px] rounded-[7.175px] border border-white-500 p-[15px] px-[5px] py-[10px] dark:border-gray-250 tablet:mt-[25px] tablet:gap-[15px] tablet:border-[2.153px] tablet:px-[15px] tablet:py-[25px]">
          <h1 className="absolute -top-[5.5px] left-5 bg-white text-[10px] font-semibold leading-[10px] text-[#707175] dark:bg-gray-200 dark:text-white-400 tablet:-top-[11px] tablet:left-9 tablet:text-[20px] tablet:leading-[20px]">
            Media
          </h1>
          <div
            className="absolute -right-[7px] -top-[5px] z-0 cursor-pointer tablet:-right-5 tablet:-top-[26px]"
            onClick={() => {
              dispatch(createQuestAction.clearMedia());
            }}
          >
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/mediaCloseIcon.svg`}
              alt="mediaCloseIcon"
              className="size-[15px] tablet:size-[41px]"
            />
          </div>
          <div className="flex">
            <TextareaAutosize
              id="input-0"
              tabIndex={1}
              onChange={handleDescChange}
              onBlur={(e) => e.target.value.trim() !== '' && descVerification(e.target.value.trim())}
              value={getMediaStates.desctiption}
              placeholder="Please describe this media..."
              onKeyDown={(e) => e.key === 'Tab' || (e.key === 'Enter' && handleTab(0, 'Enter'))}
              className="text-gray-1 dark:text-gray-1 w-full resize-none rounded-l-[5.128px] border-y border-l border-white-500 bg-white px-[9.24px] pb-2 pt-[7px] text-[0.625rem] font-medium leading-[13px] focus-visible:outline-none dark:border-[#0D1012] dark:bg-[#0D1012] tablet:rounded-l-[10.3px] tablet:border-y-[3px] tablet:border-l-[3px] tablet:px-[18px] tablet:py-[11.6px] tablet:text-[1.296rem] tablet:leading-[23px] laptop:rounded-l-[0.625rem] laptop:py-[13px] laptop:text-[1.25rem]"
            />
            <button
              className={`relative rounded-r-[5.128px] border-y border-r border-white-500 bg-white text-[0.5rem] font-semibold leading-none dark:border-[#0D1012] dark:bg-[#0D1012] tablet:rounded-r-[10.3px] tablet:border-y-[3px] tablet:border-r-[3px] tablet:text-[1rem] laptop:rounded-r-[0.625rem] laptop:text-[1.25rem] ${getMediaStates.mediaDescStatus.color}`}
            >
              <div className="flex h-[75%] w-[50px] items-center justify-center border-l-[0.7px] border-white-500 tablet:w-[100px] tablet:border-l-[3px] laptop:w-[134px]">
                {getMediaStates.mediaDescStatus.name}
              </div>
              <Tooltip optionStatus={getMediaStates.mediaDescStatus} type="media" />
            </button>
          </div>
          {getMediaStates.urlStatus.tooltipName !== 'Question is Verified' && (
            <div className="flex">
              <TextareaAutosize
                id="input-1"
                tabIndex={2}
                onKeyDown={(e) => e.key === 'Tab' || (e.key === 'Enter' && handleTab(1, 'Enter'))}
                onChange={(e) => {
                  dispatch(createQuestAction.addMediaUrl(e.target.value));
                }}
                onBlur={(e) => e.target.value.trim() !== '' && urlVerification(e.target.value.trim())}
                value={getMediaStates.url}
                placeholder="Paste YouTube or Soundcloud URL here..."
                className="text-gray-1 dark:text-gray-1 w-full resize-none rounded-l-[5.128px] border-y border-l border-white-500 bg-white px-[9.24px] pb-2 pt-[7px] text-[0.625rem] font-medium leading-[13px] focus-visible:outline-none dark:border-[#0D1012] dark:bg-[#0D1012] tablet:rounded-l-[10.3px] tablet:border-y-[3px] tablet:border-l-[3px] tablet:px-[18px] tablet:py-[11.6px] tablet:text-[1.296rem] tablet:leading-[23px] laptop:rounded-l-[0.625rem] laptop:py-[13px] laptop:text-[1.25rem]"
              />
              <button
                className={`relative rounded-r-[5.128px] border-y border-r border-white-500 bg-white text-[0.5rem] font-semibold leading-none dark:border-[#0D1012] dark:bg-[#0D1012] tablet:rounded-r-[10.3px] tablet:border-y-[3px] tablet:border-r-[3px] tablet:text-[1rem] laptop:rounded-r-[0.625rem] laptop:text-[1.25rem] ${getMediaStates.urlStatus.color}`}
              >
                <div className="flex h-[75%] w-[50px] items-center justify-center border-l-[0.7px] border-white-500 tablet:w-[100px] tablet:border-l-[3px] laptop:w-[134px]">
                  {getMediaStates.urlStatus.name}
                </div>
                <Tooltip optionStatus={getMediaStates.urlStatus} type="mediaURL" />
              </button>
            </div>
          )}
          {getMediaStates.urlStatus.tooltipName === 'Question is Verified' && (
            <div
              className="player-wrapper relative mt-1 cursor-pointer rounded-[10px] tablet:mt-[10px]"
              onClick={() => {
                dispatch(createQuestAction.clearUrl());
              }}
            >
              <div
                className={`absolute -right-1 -top-[6px] z-20 tablet:-right-4 tablet:-top-4 ${getMediaStates.url ? 'block' : 'hidden'}`}
              >
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/mediaCloseIcon.svg`}
                  alt="mediaCloseIcon"
                  className="size-[15px] tablet:size-[41px]"
                />
              </div>

              <ReactPlayer
                ref={playerRef}
                url={getMediaStates.url}
                className="react-player"
                onError={(e) => {
                  showToast('error', 'invalidUrl'), dispatch(createQuestAction.clearUrl());
                }}
                width="100%"
                height="100%"
                // single_active={true}
                controls={true} // Hide player controls
                muted={false} // Unmute audio
                playing={false} // Do not autoplay
                // loop={true} // Enable looping
                loop={!getMediaStates.url?.includes(soundcloudUnique)}
                config={{
                  soundcloud: {
                    options: {
                      auto_play: false, // Disable auto play
                      hide_related: true, // Hide related tracks
                      show_comments: false, // Hide comments
                      show_user: false, // Hide user information
                      show_reposts: false, // Hide reposts
                      show_teaser: false, // Hide track teasers
                      visual: false, // Disable visual mode
                      show_playcount: false, // Hide play count
                      sharing: false, // Disable sharing
                      buying: false, // Disable buying options
                      download: false, // Disable download option
                    },
                  },
                  youtube: {
                    playerVars: {
                      modestbranding: 1, // Hide YouTube logo
                      showinfo: 0, // Hide video title and uploader info
                      autoplay: 0, // Disable autoplay
                      loop: 1, // Enable looping
                    },
                  },
                }}
                onEnded={handleVideoEnded}
              />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
