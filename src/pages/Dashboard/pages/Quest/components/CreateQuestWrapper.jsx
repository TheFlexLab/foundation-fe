import { Tooltip } from '../../../../../utils/Tooltip';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '../../../../../components/ui/Button';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import * as createQuestAction from '../../../../../features/createQuest/createQuestSlice';
import * as pictureMediaAction from '../../../../../features/createQuest/pictureMediaSlice';
import AddMedia from './AddMedia';
import AddPictureUrls from './AddPictureUrls';
import { POST_QUESTION_CHAR_LIMIT } from '../../../../../constants/Values/constants';
import { dyk } from '../../../../../constants/dyk';
import SystemNotificationCard from '../../../../../components/posts/SystemNotificationCard';
import AddGif from './AddGif';
import { useEffect } from 'react';

export default function CreateQuestWrapper({ quest, type, handleTab, msg, children }) {
  const dispatch = useDispatch();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const createQuestSlice = useSelector(createQuestAction.getCreate);
  const questionStatus = useSelector(createQuestAction.questionStatus);
  const getMediaStates = useSelector(createQuestAction.getMedia);
  const getPicMediaStates = useSelector(pictureMediaAction.getPicsMedia);
  const getGifStates = useSelector(createQuestAction.getGif);

  const handleQuestionChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue.length <= POST_QUESTION_CHAR_LIMIT) {
      dispatch(createQuestAction.addQuestion(inputValue));
    }
  };

  const questionVerification = async (value) => {
    if (createQuestSlice.validatedQuestion === value) return;
    dispatch(createQuestAction.checkQuestion(value));
  };

  useEffect(() => {
    if (createQuestSlice?.question) {
      questionVerification(createQuestSlice.question);
    }
  }, []);

  return (
    <>
      {persistedUserInfo?.notificationSettings?.systemNotifications ? (
        <div className="mx-auto mb-4 max-w-[730px] px-4 tablet:px-0">
          <SystemNotificationCard post={dyk[0]} />
        </div>
      ) : null}

      <div className="mx-auto mb-[10px] max-w-[90%] rounded-[8.006px] bg-white px-[30px] py-3 dark:border dark:border-gray-100 dark:bg-gray-200 tablet:mb-[15px] tablet:max-w-[730px] tablet:rounded-[39px] tablet:px-[50px] tablet:py-[27px] laptop:px-4 laptop:py-[25px] desktop:px-[50px]">
        <h1 className="text-[10px] font-semibold leading-[10px] text-gray-1 dark:text-white-400 tablet:block tablet:text-[22.81px] tablet:leading-[22.81px] laptop:text-[25px] laptop:leading-[25px]">
          Add Media (optional)
        </h1>
        <h4 className="mt-2 text-[8px] font-medium leading-[8px] text-gray-800 tablet:mt-3 tablet:text-[16px] tablet:leading-[16px]">
          More ways to add media are coming soon.
        </h4>
        {getMediaStates?.isMedia?.isMedia === false &&
          getPicMediaStates?.isPicMedia === false &&
          getGifStates?.isGifMedia === false && (
            <div className="mt-2 flex items-center justify-between tablet:mt-3">
              <Button
                variant="addEmbeded"
                className="px-2 tablet:px-3.5"
                onClick={() => {
                  dispatch(createQuestAction.updateIsPicMedia(false));
                  dispatch(createQuestAction.updateIsGifMedia(false));

                  dispatch(
                    createQuestAction.updateIsMedia({
                      isMedia: true,
                      type: 'EmbedVideo',
                    })
                  );
                }}
              >
                + YouTube
              </Button>
              {getMediaStates?.isMedia.isMedia === false && (
                <Button
                  variant="addEmbeded"
                  className="px-2 tablet:px-3.5"
                  onClick={() => {
                    dispatch(createQuestAction.updateIsPicMedia(false));
                    dispatch(createQuestAction.updateIsGifMedia(false));

                    dispatch(
                      createQuestAction.updateIsMedia({
                        isMedia: true,
                        type: 'EmbedAudio',
                      })
                    );
                  }}
                >
                  + Soundcloud
                </Button>
              )}
              <Button
                variant="addEmbeded"
                className="px-2 tablet:px-3.5"
                onClick={() => {
                  dispatch(
                    createQuestAction.updateIsMedia({
                      isMedia: false,
                      type: '',
                    })
                  );
                  dispatch(createQuestAction.updateIsGifMedia(false));
                  dispatch(pictureMediaAction.updateIsPicMedia(true));
                }}
              >
                + Flickr
              </Button>
              {getMediaStates?.isMedia.isMedia === false && (
                <Button
                  variant="addEmbeded"
                  className="px-2 tablet:px-3.5"
                  onClick={() => {
                    dispatch(createQuestAction.updateIsPicMedia(false));
                    dispatch(createQuestAction.updateIsGifMedia(true));
                  }}
                >
                  + GIPHY
                </Button>
              )}
            </div>
          )}
        <AddMedia handleTab={handleTab} />
        <AddPictureUrls handleTab={handleTab} />
        <AddGif handleTab={handleTab} />
        <div className="mb-[10px] mt-4 tablet:mb-7 tablet:mt-12">
          <h1 className="text-[10px] font-semibold leading-[10px] text-gray-1 dark:text-white-400 tablet:block tablet:text-[22.81px] tablet:leading-[22.81px] laptop:text-[25px] laptop:leading-[25px]">
            {quest === 'M/R' || quest === 'OpenChoice'
              ? 'Make a statement or pose a question'
              : quest === 'Statement'
                ? 'Make a statement'
                : 'Pose a question'}
          </h1>
          <div className="w-[calc(100%-51.75px] mb-[10px] mt-2 flex tablet:mb-7 tablet:mt-[15px]">
            <TextareaAutosize
              id="input-2"
              aria-label="multiple choice question"
              onChange={handleQuestionChange}
              onBlur={(e) => e.target.value.trim() !== '' && questionVerification(e.target.value)}
              value={createQuestSlice.question}
              tabIndex={3}
              onKeyDown={(e) => e.key === 'Tab' || (e.key === 'Enter' && handleTab(2, 'Enter'))}
              className="w-full resize-none rounded-l-[5.128px] border-y border-l border-white-500 bg-white px-[9.24px] py-[7px] text-[10px] font-medium leading-3 tracking-wide text-gray-1 focus-visible:outline-none dark:border-gray-100 dark:bg-accent-100 dark:text-white-400 tablet:rounded-l-[10.3px] tablet:border-y-[3px] tablet:border-l-[3px] tablet:px-[18px] tablet:py-[11.6px] tablet:text-[1.296rem] tablet:leading-[23px] laptop:rounded-l-[0.625rem] laptop:py-[13px] laptop:text-[1.25rem]"
            />

            <button
              id="new"
              className={`relative rounded-r-[5.128px] border-y border-r border-white-500 bg-white text-[0.5rem] font-semibold leading-none dark:border-gray-100 dark:bg-accent-100 tablet:rounded-r-[10.3px] tablet:border-y-[3px] tablet:border-r-[3px] tablet:text-[1rem] laptop:rounded-r-[0.625rem] laptop:text-[1.25rem] ${questionStatus.color}`}
            >
              <div className="flex h-[75%] w-[50px] items-center justify-center border-l-[0.7px] border-white-500 dark:border-gray-100 tablet:w-[100px] tablet:border-l-[3px] laptop:w-[134px]">
                {createQuestSlice.questionTyping ? `${createQuestSlice.question.length}/350` : questionStatus.name}
              </div>
              <Tooltip optionStatus={questionStatus} />
            </button>
          </div>
        </div>
        <h1 className="mt-4 text-[10px] font-semibold leading-[10px] text-gray-1 dark:text-white-400 tablet:block tablet:text-[22.81px] tablet:leading-[22.81px] laptop:text-[25px] laptop:leading-[25px]">
          Options
        </h1>
        <h4 className="my-2 text-[8px] font-medium leading-normal text-gray-800 tablet:my-3 tablet:text-[16px] tablet:leading-[16px]">
          {msg}
        </h4>
        {children}
      </div>

      {persistedUserInfo?.notificationSettings?.systemNotifications ? (
        <div className="mx-auto mb-4 max-w-[730px] px-4 tablet:px-0">
          <SystemNotificationCard post={dyk[1]} />
        </div>
      ) : null}
    </>
  );
}
