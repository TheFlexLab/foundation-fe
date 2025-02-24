// import { toast } from 'sonner';
import { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player/lazy';
import { useDispatch, useSelector } from 'react-redux';

// // import { soundcloudUnique, youtubeBaseURLs } from '../../constants/addMedia';
// import { useDispatch } from 'react-redux';
// import { useSelector } from 'react-redux';
import { getQuestUtils, setIsShowPlayer, setPlayingPlayerId, toggleMedia } from '../../features/quest/utilsSlice';
import * as questUtilsActions from '../../features/quest/utilsSlice';
import { FaSpinner } from 'react-icons/fa';

// import { suppressPost } from '../../services/api/questsApi';
// import YouTubePlayer from './YoutubePlayer';
// import SoundcloudWidget from './SoundcloudWidget';

export const EmbededVideo = ({
  description,
  url,
  questId,
  // setPlayingPlayerId,
  playing,
  // setIsShowPlayer,
  // setIsPlaying,
  // isPlaying,
}) => {
  const playerRef = useRef(null);
  const [mediaURL, setMediaURL] = useState(url[0]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const questUtilsState = useSelector(getQuestUtils);

  const handleVideoEnded = () => {
    if (questUtilsState.loop === true) {
      if (playerRef.current) {
        playerRef.current.seekTo(0);
        playerRef.current.getInternalPlayer().play(); // Resume playback
      }
    } else {
      const index = questUtilsState.playingIds.findIndex((mediaId) => mediaId === questUtilsState.playerPlayingId);
      if (index !== -1 && index + 1 < questUtilsState.playingIds.length) {
        dispatch(questUtilsActions.setPlayingPlayerId(questUtilsState.playingIds[index + 1]));
      } else if (
        index !== -1 &&
        index + 1 >= questUtilsState.playingIds.length &&
        questUtilsState.hasNextPage === false
      ) {
        dispatch(questUtilsActions.setPlayingPlayerId(questUtilsState.playingIds[0]));
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 744) {
        setMediaURL(`${url[0]}&show_artwork=false`);
      } else {
        setMediaURL(url[0]);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [url[0]]);

  function getYouTubeId(url) {
    const regex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  function identifyMediaUrl(url) {
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/(?:shorts\/)?|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const soundcloudRegex = /soundcloud\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/;

    if (youtubeRegex.test(url)) {
      return 'YouTube';
    } else if (soundcloudRegex.test(url)) {
      return 'SoundCloud';
    } else {
      return 'Unknown';
    }
  }

  return (
    <div className={`relative flex flex-col justify-start`}>
      {/* <h2 className="mb-1 ml-2 text-[8px] font-medium text-gray-1 tablet:mb-2 tablet:ml-3 tablet:text-[14.692px]">
        {description}
      </h2> */}
      {loading && (
        <div
          className={`flex h-full w-full flex-col items-center justify-center ${identifyMediaUrl(url[0]) === 'YouTube' ? 'max-h-[195.75px] min-h-[195.75px] tablet:max-h-[408.38px] tablet:min-h-[408.38px]' : 'max-h-[128px] min-h-[128px] tablet:max-h-[195.75px] tablet:min-h-[195.75px]'}`}
        >
          <FaSpinner className="size-5 animate-spin tablet:size-6" />
          <h1>{identifyMediaUrl(url[0]) === 'YouTube' ? 'Loading video...' : 'Loading audio...'}</h1>
        </div>
      )}
      <div className={`relative ${loading ? 'invisible h-0' : ''}`}>
        <ReactPlayer
          ref={playerRef}
          url={mediaURL}
          onReady={() => setLoading(false)}
          className={`react-player`}
          onError={(e) => {
            console.log('hamza', e);
            // toast.error('Invalid URL');
            console.log('Invalid URl', questId);
            // suppressPost(questId);
          }}
          onStart={() => {
            dispatch(setPlayingPlayerId(questId));
            // setPlayingPlayerId(questId);
            if (!playing) {
              dispatch(toggleMedia(true));
              // setIsPlaying(true);
            }
            dispatch(setIsShowPlayer(true));
            // setIsShowPlayer(true);
          }}
          onPlay={() => {
            dispatch(setPlayingPlayerId(questId));
            // setPlayingPlayerId(questId);
            if (!playing) {
              // setIsPlaying(true);
              dispatch(toggleMedia(true));
            }
            dispatch(setIsShowPlayer(true));
            // setIsShowPlayer(true);
          }}
          width="100%"
          height="100%"
          onPause={() => {
            if (playing) {
              // setIsPlaying(false);
              dispatch(toggleMedia(false));
            }
          }}
          // single_active={true}
          controls={true} // Hide player controls
          muted={false} // Unmute audio
          playing={playing} // Do not autoplay
          // loop={true} // Enable looping
          // loop={!url.includes(soundcloudUnique)}
          config={{
            soundcloud: {
              options: {
                auto_play: false, // Disable auto play
                hide_related: true, // Hide related tracks
                show_comments: false, // Hide comments
                show_user: false, // Hide user information
                show_reposts: false, // Hide reposts
                show_teaser: false, // Hide track teasers
                visual: true, // Disable visual mode
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
                // loop: 1, // Enable looping
              },
            },
          }}
          onEnded={() => handleVideoEnded()} // handleVideoEnded={handleVideoEnded}
        />
      </div>
      {/* {identifyMediaUrl(url[0]) === 'YouTube' && (
        <YouTubePlayer YTid={getYouTubeId(url[0])} playing={playing} questId={questId} />
        )}
        {identifyMediaUrl(url[0]) === 'SoundCloud' && (
          <SoundcloudWidget SCurl={mediaURL} playing={playing} questId={questId} />
          )} */}
    </div>
  );
};
