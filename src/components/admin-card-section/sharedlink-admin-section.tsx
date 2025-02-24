import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as questUtilsActions from '../../features/quest/utilsSlice';
import { calculateTimeAgo } from '../../utils/utils';
import { Button } from '../ui/Button';
import UnHidePostPopup from '../dialogue-boxes/UnHidePostPopup';
import showToast from '../ui/Toast';
import DisabledLinkPopup from '../dialogue-boxes/DisabledLinkPopup';
import { useUpdateSpotLight } from '../../services/api/profile';
import { useRevealMyAnswers } from '../../services/api/sharedLinks';
import { Switch } from '@headlessui/react';

interface IAdminSectionProps {
  questStartData: any;
  postProperties: string;
  handleStartTest: (arg?: string) => void;
  handleViewResults: (arg?: any) => void;
  startTest: string;
}

export default function SharedLinkAdminSection(props: IAdminSectionProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { questStartData, postProperties, handleStartTest, handleViewResults, startTest } = props;
  const persistedTheme = useSelector((state: any) => state.utils.theme);
  const [modalVisible, setModalVisible] = useState({ state: false, type: '' });
  const [postLink, setPostLink] = useState(questStartData?.userQuestSetting?.link || '');
  const showHidePostClose = () => setModalVisible({ state: false, type: '' });
  const questUtils = useSelector(questUtilsActions.getQuestUtils);
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const [revealAnswer, setRevealAnswer] = useState(questStartData?.revealMyAnswers || false);

  const { mutateAsync: handleSpotLight } = useUpdateSpotLight();
  const { mutateAsync: revealMyAnswer } = useRevealMyAnswers();

  useEffect(() => {
    setRevealAnswer(questStartData?.startQuestData?.revealMyAnswers);
  }, [questStartData?.startQuestData?.revealMyAnswers]);

  const showEnableSharedLinkPopup = () => {
    dispatch(questUtilsActions.addEnablePostId(null));
    dispatch(
      questUtilsActions.updateDialogueBox({
        type: 'Enable',
        status: true,
        link: questStartData.userQuestSetting.link,
        id: questStartData._id,
      })
    );
  };

  const copyToClipboard = async () => {
    const { protocol, host } = window.location;
    const textToCopy = `${protocol}//${host}/p/` + postLink;

    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (err) {
      console.error('Unable to copy text to clipboard:', err);
    }
  };

  const handleDeleteSharedPost = () => {
    dispatch(questUtilsActions.updateDialogueBox({ type: null, status: false, link: null, id: null }));
  };

  const showDisableSharedLinkPopup = () => {
    dispatch(questUtilsActions.addDisabledPostId(null)),
      dispatch(
        questUtilsActions.updateDialogueBox({
          type: 'Disable',
          status: true,
          link: questStartData.userQuestSetting.link,
          id: questStartData._id,
        })
      );
  };

  const showDeleteSharedLinkPopup = () => {
    dispatch(
      questUtilsActions.updateDialogueBox({
        type: 'Delete',
        status: true,
        link: questStartData.userQuestSetting.link,
        id: questStartData._id,
      })
    );
  };

  return (
    <div className="border-t-2 border-gray-250 dark:border-gray-100">
      <div className="my-[15px] tablet:my-6">
        <div className="mx-10 my-[15px] flex justify-between gap-1 tablet:mx-5 tablet:my-6 laptop:mx-10">
          <div className="flex items-center gap-[1px] tablet:gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/clicks.svg' : 'assets/svgs/clicks.svg'}`}
              alt="clicks"
              className="h-2 w-2 tablet:h-6 tablet:w-6"
            />
            <h2 className="text-[8px] font-semibold leading-[9.68px] text-gray-1 dark:text-white-400 tablet:text-[18px] tablet:leading-[21.78px]">
              {questStartData?.userQuestSetting?.questImpression} Views{' '}
            </h2>
          </div>
          <div className="flex items-center gap-[1px] tablet:gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/group.svg' : 'assets/svgs/participants.svg'}`}
              alt="participants"
              className="h-2 w-3 tablet:h-[26px] tablet:w-[34px]"
            />
            <h2 className="text-[8px] font-semibold leading-[9.68px] text-gray-1 dark:text-white-400 tablet:text-[18px] tablet:leading-[21.78px]">
              {questStartData?.userQuestSetting?.questsCompleted} Engagements{' '}
            </h2>
          </div>
          {questStartData?.whichTypeQuestion !== 'ranked choise' ? (
            <div className="flex items-center gap-[1px] tablet:gap-2">
              <Switch
                checked={revealAnswer}
                onChange={(e) => {
                  setRevealAnswer(e);
                  revealMyAnswer({
                    questForeignKey: questStartData._id,
                    revealMyAnswers: e ? 'true' : 'false',
                    uuid: persistedUserInfo.uuid,
                  });
                }}
                className={`${revealAnswer ? 'bg-[#BEDEF4]' : 'bg-gray-250'} switch_basic_design`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`switch_base ${
                    revealAnswer
                      ? 'translate-x-[9px] bg-[#4A8DBD] tablet:translate-x-6'
                      : 'translate-x-[1px] bg-[#707175]'
                  }`}
                />
              </Switch>
              <h2 className="text-[8px] font-semibold leading-[9.68px] text-gray-1 dark:text-white-400 tablet:text-[18px] tablet:leading-[21.78px]">
                Reveal my answer
              </h2>
            </div>
          ) : (
            <div></div>
          )}
        </div>
        {/* Buttons */}
        <div className="flex w-full flex-col gap-2 px-[0.87rem] tablet:gap-4 tablet:px-10">
          {/* Row 1 */}
          {isProfilePage && !questStartData.spotLightType && (
            <div className="grid w-full grid-cols-2 gap-3 tablet:gap-[1.4rem]">
              <div></div>
              <Button
                variant="submit"
                onClick={() => {
                  const domain = persistedUserInfo.badges.find((badge: any) => badge.domain)?.domain.name;
                  handleSpotLight({ domain, type: 'posts', id: questStartData._id, status: 'set' });
                }}
                className="col-span-1 w-full max-w-full laptop:w-full"
              >
                Pin to spotlight
              </Button>
            </div>
          )}
          {/* Row 2 */}
          {startTest !== questStartData._id ? (
            <div className="grid w-full grid-cols-2 gap-3 tablet:gap-[1.4rem]">
              <Button
                variant={'submit-green'}
                onClick={() => {
                  navigate('/shared-links/result', {
                    state: { questId: questStartData._id, link: questStartData.userQuestSetting.link },
                  });
                }}
                className={'w-full tablet:w-full'}
              >
                View My Post Results
              </Button>
              <Button
                variant="submit"
                className="w-full min-w-full"
                onClick={() => {
                  copyToClipboard();
                  showToast('success', 'copyLink');
                }}
              >
                Copy Link
              </Button>
            </div>
          ) : (
            <div className="mb-[15px] flex w-full justify-end gap-2 pr-[14.4px] tablet:mb-6 tablet:gap-[0.75rem] tablet:pr-[3.44rem]">
              <Button
                variant="cancel"
                onClick={() => {
                  handleViewResults(null);
                  handleStartTest('');
                }}
              >
                Go Back
              </Button>
            </div>
          )}
          {/* Row 3 */}
          <div className="grid w-full grid-cols-2 gap-3 tablet:gap-[1.4rem]">
            <Button
              variant="danger"
              onClick={showDeleteSharedLinkPopup}
              className="col-span-1 w-full max-w-full tablet:w-full laptop:w-full"
            >
              Delete
            </Button>
            {questStartData?.userQuestSetting?.linkStatus === 'Enable' ? (
              <Button
                variant="danger"
                onClick={showDisableSharedLinkPopup}
                className={'w-full max-w-full bg-[#DC1010] tablet:w-full laptop:w-full'}
              >
                Disable Sharing
              </Button>
            ) : (
              <Button variant="submit" className={'w-full !px-0 laptop:!px-0'} onClick={showEnableSharedLinkPopup}>
                Enable Sharing
              </Button>
            )}
            <UnHidePostPopup
              handleClose={showHidePostClose}
              modalVisible={modalVisible}
              questStartData={questStartData}
            />
          </div>
        </div>
      </div>
      <div className="relative flex items-center justify-end border-t-2 border-gray-250 px-[0.57rem] py-[5px] dark:border-gray-100 tablet:px-5 tablet:py-[11px]">
        {/* <div className="flex w-full items-center justify-between"> */}
        {/* <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/trash.svg' : 'assets/svgs/dashboard/trash2.svg'}`}
            alt="trash"
            className="h-3 w-[9px] cursor-pointer tablet:h-[30px] tablet:w-[25px]"
            onClick={showDisableSharedLinkPopup}
          /> */}
        <div className="flex h-4 w-fit items-center gap-1 rounded-[0.625rem] md:h-[1.75rem] tablet:gap-2">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/clock.svg' : 'assets/svgs/dashboard/clock-outline.svg'}`}
            alt="clock"
            className="h-[8.64px] w-[8.64px] tablet:h-[20.5px] tablet:w-[20.4px]"
          />
          <h4 className="whitespace-nowrap text-[0.6rem] font-normal text-gray-1 dark:text-white tablet:text-[1.13531rem] laptop:text-[1.2rem]">
            {/* {postProperties === 'HiddenPosts' ? 'Hidden' : postProperties === 'SharedLinks' ? 'Shared' : null}{' '} */}
            Shared {calculateTimeAgo(questStartData.userQuestSetting?.sharedTime)}
          </h4>
        </div>
      </div>
      {/* Enable Disable and Delete Popup */}
      <DisabledLinkPopup
        handleClose={handleDeleteSharedPost}
        modalVisible={
          questUtils.sharedQuestStatus.id === questStartData._id ? questUtils.sharedQuestStatus.isDialogueBox : false
        }
      />
    </div>
  );
}
