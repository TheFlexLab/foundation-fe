import { Button } from '../ui/Button';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUpdateSpotLight } from '../../services/api/profile';
import showToast from '../ui/Toast';
import { useRevealMyCollectionAnswers } from '../../services/api/listsApi';
import { Switch } from '@headlessui/react';
import { useEffect, useState } from 'react';

interface IAdminSectionProps {
  categoryItem: any;
  setSelectedItem: (arg?: any) => void;
  setCategoryId: (arg?: any) => void;
  listData: any;
  categoryIndex: any;
  setEnableDisableType: (arg?: any) => void;
  setEnableDisableModal: (arg?: any) => void;
  setCopyModal: (arg?: any) => void;
  copyToClipboard: (arg?: any) => void;
}

export default function SharedListAdminSection(props: IAdminSectionProps) {
  const navigate = useNavigate();
  const {
    categoryItem,
    setSelectedItem,
    setCategoryId,
    listData,
    categoryIndex,
    setEnableDisableType,
    setEnableDisableModal,
    setCopyModal,
    copyToClipboard,
  } = props;
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';
  const persistedTheme = useSelector((state: any) => state.utils.theme);
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const [revealAnswer, setRevealAnswer] = useState(categoryItem?.revealMyAnswers || false);

  const { mutateAsync: handleSpotLight } = useUpdateSpotLight();
  const { mutateAsync: revealMyCollectionAnswer } = useRevealMyCollectionAnswers();

  useEffect(() => {
    setRevealAnswer(categoryItem?.revealMyAnswers);
  }, [categoryItem?.revealMyAnswers]);

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
            <h2 className="text-[8px] font-semibold leading-[9.68px] text-gray-1 dark:text-gray-300 tablet:text-[18px] tablet:leading-[21.78px]">
              {categoryItem.clicks === null ? 0 : categoryItem.clicks} Views{' '}
            </h2>
          </div>
          <div className="flex items-center gap-[1px] tablet:gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/group.svg' : 'assets/svgs/participants.svg'}`}
              alt="participants"
              className="h-2 w-3 tablet:h-[26px] tablet:w-[34px]"
            />
            <h2 className="text-[8px] font-semibold leading-[9.68px] text-gray-1 dark:text-gray-300 tablet:text-[18px] tablet:leading-[21.78px]">
              {categoryItem.participents === null ? 0 : categoryItem.participents} Engagements{' '}
            </h2>
          </div>
          <div className="flex items-center gap-[1px] tablet:gap-2">
            <Switch
              checked={revealAnswer}
              onChange={(e) => {
                setRevealAnswer(e);
                revealMyCollectionAnswer({
                  userUuid: persistedUserInfo.uuid,
                  categoryId: categoryItem._id,
                  revealMyAnswers: e ? 'true' : 'false',
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
        </div>
        {/* Button Row 1 */}
        <div className="flex w-full flex-col gap-2 px-[0.87rem] tablet:gap-4 tablet:px-10">
          {isProfilePage && !categoryItem?.spotLight && (
            <div className="grid w-full grid-cols-2 gap-3 tablet:gap-[1.4rem]">
              <div></div>
              <Button
                variant={'submit'}
                className={'w-full tablet:w-full'}
                onClick={() => {
                  const domain = persistedUserInfo.badges.find((badge: any) => badge.domain)?.domain.name;
                  handleSpotLight({ domain, type: 'lists', id: categoryItem._id, status: 'set' });
                }}
              >
                Pin to Spotlight
              </Button>
            </div>
          )}
          {/* Buttons Row 2 */}
          <div className="grid w-full grid-cols-2 gap-3 tablet:gap-[1.4rem]">
            <Button
              variant={'submit-green'}
              className={'w-full tablet:w-full'}
              onClick={() => {
                if (listData[categoryIndex]?.post?.length > 0) {
                  navigate('/shared-collection-link/result', {
                    state: { categoryItem: categoryItem._id },
                  });
                } else {
                  showToast('warning', 'noPostsInList');
                }
              }}
            >
              View Collection Results
            </Button>
            <Button
              variant="submit"
              className="w-full min-w-full"
              onClick={() => {
                if (categoryItem.link === null) {
                  showToast('warning', 'noListLink');
                } else {
                  copyToClipboard(categoryItem.link);
                  showToast('success', 'copyLink');
                }
              }}
            >
              Copy Link
            </Button>
          </div>
          {/* Buttons Row 3 */}
          <div className="grid w-full grid-cols-2 gap-3 tablet:gap-[1.4rem]">
            <Button
              variant="danger"
              className="w-full max-w-[320px] bg-[#A3A3A3] tablet:w-full laptop:w-full"
              onClick={() => {
                setEnableDisableType('delete-shared-data');
                setCategoryId(categoryItem._id);
                setEnableDisableModal(true);
              }}
            >
              Delete
            </Button>
            <Button
              variant={categoryItem.isEnable && categoryItem.link !== null ? 'danger' : 'submit'}
              onClick={() => {
                if (categoryItem.link !== null) {
                  setEnableDisableType(categoryItem.isEnable && categoryItem.link !== null ? 'disable' : 'enable');
                  setCategoryId(categoryItem._id);
                  setEnableDisableModal(true);
                } else {
                  setSelectedItem(categoryItem);
                  setCopyModal(true);
                }
              }}
              className={
                categoryItem.isEnable
                  ? 'w-full max-w-full bg-[#DC1010] tablet:w-full laptop:w-full'
                  : 'w-full !px-0 laptop:!px-0'
              }
            >
              {categoryItem.isEnable && categoryItem.link !== null ? 'Disable Sharing' : 'Enable Sharing'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
