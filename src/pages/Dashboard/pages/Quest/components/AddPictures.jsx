import { useSelector, useDispatch } from 'react-redux';
import { Tooltip } from '../../../../../utils/Tooltip';
// import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import * as createQuestAction from '../../../../../features/createQuest/createQuestSlice';
import { useRef } from 'react';

export default function AddPictures({ handleTab }) {
  const textareaRef = useRef(null);
  const dispatch = useDispatch();
  const getMediaStates = useSelector(createQuestAction.getPicsMedia);

  const autoGrow = () => {
    const element = textareaRef.current;
    element.style.height = '5px';
    element.style.height = `${element.scrollHeight}px`;
  };

  const urlVerification = async (value) => {
    if (getMediaStates.validatedPicUrl === value) return;

    dispatch(createQuestAction.checkPictureUrl({ url: getMediaStates.picUrl }));

    // if (youtubeBaseURLs.some((baseURL) => value?.includes(baseURL))) {
    //   const videoId = extractYouTubeVideoId(value);

    //   dispatch(createQuestAction.checkIsUrlAlreayExists({ id: videoId, url: getMediaStates.url }));
    // } else if (value?.includes(soundcloudUnique)) {
    //   const urlId = extractPartFromUrl(value);
    //   dispatch(createQuestAction.checkIsUrlAlreayExists({ id: urlId, url: getMediaStates.url }));
    // } else {
    //   toast.warning('YouTube and SoundCloud links are supported.');
    // }
  };

  // const handleDescChange = (e) => {
  //   const inputValue = e.target.value;

  //   if (inputValue.length <= 350) {
  //     dispatch(createQuestAction.addPicsMediaDesc(inputValue));
  //   }
  // };

  // const descVerification = async (value) => {
  //   if (getMediaStates.validatedDescription === value) return;
  //   dispatch(createQuestAction.checkPicsDescription(value));
  // };

  return (
    <div>
      {getMediaStates?.isPicMedia && (
        <div className="w-[calc(100%-51.75px] relative mx-[15px] mt-3 flex flex-col gap-[6px] rounded-[7.175px] border border-white-500 p-[15px] px-[5px] py-[10px] dark:border-gray-250 tablet:mx-11 tablet:mt-[25px] tablet:gap-[15px] tablet:border-[2.153px] tablet:px-[15px] tablet:py-[25px]">
          <h1 className="absolute -top-[5.5px] left-5 bg-white text-[10px] font-semibold leading-[10px] text-[#707175] dark:bg-gray-200 dark:text-white-400 tablet:-top-[11px] tablet:left-9 tablet:text-[20px] tablet:leading-[20px]">
            Image
          </h1>
          <div
            className="absolute -right-[7px] -top-[5px] z-0 cursor-pointer tablet:-right-5 tablet:-top-[26px]"
            onClick={() => {
              dispatch(createQuestAction.clearPicsMedia());
              dispatch(createQuestAction.clearPicsUrl());
            }}
          >
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/mediaCloseIcon.svg`}
              alt="mediaCloseIcon"
              className="size-[15px] tablet:size-[41px]"
            />
          </div>
          {/* <div className="flex">
            <TextareaAutosize
              id="input-0"
              tabIndex={1}
              onChange={handleDescChange}
              onBlur={(e) => e.target.value.trim() !== '' && descVerification(e.target.value.trim())}
              value={getMediaStates.picDesctiption}
              placeholder="Please describe this pictures..."
              onKeyDown={(e) => e.key === 'Tab' || (e.key === 'Enter' && handleTab(0, 'Enter'))}
              className="w-full resize-none rounded-l-[5.128px] border-y border-l border-white-500 bg-white px-[9.24px] pb-2 pt-[7px] text-[0.625rem] font-medium leading-[13px] text-gray-1 focus-visible:outline-none tablet:rounded-l-[10.3px] tablet:border-y-[3px] tablet:border-l-[3px] tablet:px-[18px] tablet:py-[11.6px] tablet:text-[1.296rem] tablet:leading-[23px] laptop:rounded-l-[0.625rem] laptop:py-[13px] laptop:text-[1.25rem] dark:border-[#0D1012] dark:bg-[#0D1012] dark:text-gray-1"
            />
            <button
              className={`relative rounded-r-[5.128px] border-y border-r border-white-500 bg-white text-[0.5rem] font-semibold leading-none tablet:rounded-r-[10.3px] tablet:border-y-[3px] tablet:border-r-[3px] tablet:text-[1rem] laptop:rounded-r-[0.625rem] laptop:text-[1.25rem] dark:border-[#0D1012] dark:bg-[#0D1012] ${getMediaStates.picDescStatus.color}`}
            >
              <div className="flex h-[75%] w-[50px] items-center justify-center border-l-[0.7px] border-white-500 tablet:w-[100px] tablet:border-l-[3px] laptop:w-[134px]">
                {getMediaStates.picDescStatus.name}
              </div>
              <Tooltip optionStatus={getMediaStates.picDescStatus} type="media" />
            </button>
          </div> */}
          {getMediaStates.picUrlStatus.tooltipName !== 'Question is Verified' && (
            <div className="flex">
              {/* <TextareaAutosize
                id="input-1"
                tabIndex={2}
                onKeyDown={(e) => e.key === 'Tab' || (e.key === 'Enter' && handleTab(1, 'Enter'))}
                onChange={(e) => {
                  dispatch(createQuestAction.addPicUrl(e.target.value));
                }}
                onBlur={(e) => e.target.value.trim() !== '' && urlVerification(e.target.value.trim())}
                value={getMediaStates.picUrl}
                placeholder="Paste Flickr share link or url here..."
                className="w-full resize-none rounded-l-[5.128px] border-y border-l border-white-500 bg-white px-[9.24px] pb-2 pt-[7px] text-[0.625rem] font-medium leading-[13px] text-gray-1 focus-visible:outline-none tablet:rounded-l-[10.3px] tablet:border-y-[3px] tablet:border-l-[3px] tablet:px-[18px] tablet:py-[11.6px] tablet:text-[1.296rem] tablet:leading-[23px] laptop:rounded-l-[0.625rem] laptop:py-[13px] laptop:text-[1.25rem] dark:border-[#0D1012] dark:bg-[#0D1012] dark:text-gray-1"
              /> */}
              <textarea
                ref={textareaRef}
                onInput={autoGrow}
                id="input-1"
                tabIndex={2}
                onKeyDown={(e) => e.key === 'Tab' || (e.key === 'Enter' && handleTab(1, 'Enter'))}
                onChange={(e) => {
                  dispatch(createQuestAction.addPicUrl(e.target.value));
                }}
                onBlur={(e) => e.target.value.trim() !== '' && urlVerification(e.target.value.trim())}
                value={getMediaStates.picUrl}
                placeholder="Paste Flickr share link or url here..."
                className="text-gray-1 dark:text-gray-1 w-full resize-none rounded-l-[5.128px] border-y border-l border-white-500 bg-white px-[9.24px] pb-2 pt-[7px] text-[0.625rem] font-medium leading-[13px] focus-visible:outline-none dark:border-[#0D1012] dark:bg-[#0D1012] tablet:rounded-l-[10.3px] tablet:border-y-[3px] tablet:border-l-[3px] tablet:px-[18px] tablet:py-[11.6px] tablet:text-[1.296rem] tablet:leading-[23px] laptop:rounded-l-[0.625rem] laptop:py-[13px] laptop:text-[1.25rem]"
              />
              <button
                className={`relative rounded-r-[5.128px] border-y border-r border-white-500 bg-white text-[0.5rem] font-semibold leading-none dark:border-[#0D1012] dark:bg-[#0D1012] tablet:rounded-r-[10.3px] tablet:border-y-[3px] tablet:border-r-[3px] tablet:text-[1rem] laptop:rounded-r-[0.625rem] laptop:text-[1.25rem] ${getMediaStates.picUrlStatus.color}`}
              >
                <div className="flex h-[75%] w-[50px] items-center justify-center border-l-[0.7px] border-white-500 tablet:w-[100px] tablet:border-l-[3px] laptop:w-[134px]">
                  {getMediaStates.picUrlStatus.name}
                </div>
                <Tooltip optionStatus={getMediaStates.picUrlStatus} type="mediaURL" />
              </button>
            </div>
          )}
          {getMediaStates.picUrlStatus.tooltipName === 'Question is Verified' && (
            <div className="relative mt-1 cursor-pointer rounded-[10px] tablet:mt-[10px]">
              {/* <div
                onClick={() => {
                  dispatch(createQuestAction.clearPicsUrl());
                }}
                className={`absolute -right-1 -top-[6px] z-20 tablet:-right-4 tablet:-top-4 ${getMediaStates.picUrl ? 'block' : 'hidden'}`}
              >
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/mediaCloseIcon.svg`}
                  alt="mediaCloseIcon"
                  className="size-[15px] tablet:size-[41px]"
                />
              </div> */}

              <img
                src={getMediaStates.validatedPicUrl}
                alt="embedded-photo"
                className="max-h-[134.456px] w-full rounded-[3.875px] object-contain tablet:max-h-[371px] tablet:rounded-[10px]"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
