import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '../../../../../../components/ui/Button';
import { calculateTimeAgo } from '../../../../../../utils/utils';
import showToast from '../../../../../../components/ui/Toast';
import DeleteShareArticleLink from '../../../../../../components/dialogue-boxes/DeleteShareArticleLink';
// import SharedArticleAdminSection from '../../../../../../components/admin-card-section/sharedarticle-admin-section';
// import NewsFeedCard from '../../../../../features/news-feed/components/NewsFeedCard';
import { useUpdateSpotLight } from '../../../../../../services/api/profile';
import { useLocation } from 'react-router-dom';

export default function ShareArticleCard({ data, innerRef }) {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [deleteModal, setDeleteModal] = useState(false);
  const [type, setType] = useState('');
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const { mutateAsync: handleSpotLight } = useUpdateSpotLight();

  const { protocol, host } = window.location;
  let sharedPostUrl = `${protocol}//${host}/r/${data?.articleSetting?.uniqueLink}`;

  const copyToClipboard = async () => {
    const textToCopy = sharedPostUrl;

    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (err) {
      console.error('Unable to copy text to clipboard:', err);
    }
  };

  return (
    <div
      ref={innerRef}
      className="h-full max-w-[730px] rounded-b-[12.3px] border-t-2 border-gray-250 bg-white dark:border-gray-100 dark:bg-gray-200 tablet:rounded-b-[15px]"
    >
      {/* Header */}
      {/* <div className="flex items-center justify-between border-b-2 border-gray-250 px-[0.57rem] py-[5px] dark:border-gray-100 tablet:px-5 tablet:py-[11px]">
        <div className="flex w-full justify-between">
          <div className="max-w-48 tablet:max-w-[18rem] lgTablet:max-w-[28rem] laptop:max-w-fit">
            <h1 className="truncate text-wrap text-[10px] font-semibold text-gray-1 dark:text-white-200 tablet:text-[20px] tablet:font-medium">
              {sharedPostUrl}
            </h1>
          </div>
          <div
            className="flex cursor-pointer items-center gap-[4.8px] tablet:gap-3"
            onClick={() => {
              copyToClipboard();
              showToast('success', 'copyLink');
            }}
          >
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/copylinkblue.png`}
              alt="eye-cut"
              className="h-3 w-3 tablet:h-[22.92px] tablet:w-[19.79px]"
            />
            <h1 className="text-[10.45px] font-semibold text-[#6BA5CF] tablet:text-[20px]">Copy Link</h1>
          </div>
        </div>
      </div> */}
      {/* Body */}

      {/* <div className="flex flex-col justify-between border-gray-250 px-[0.87rem] tablet:px-6">
          <h4 className="text-[0.75rem] font-semibold leading-[15px] text-gray-1 dark:text-white-400 tablet:text-[1.25rem] tablet:leading-[23px]">
          {data?.title}
          </h4>
          </div> */}
      <div className="my-[15px] tablet:my-6">
        <div className="my-[15px] ml-10 flex gap-1 tablet:my-6 tablet:ml-16 tablet:gap-20">
          <div className="flex items-center gap-[1px] tablet:gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/clicks.svg' : 'assets/svgs/clicks.svg'}`}
              alt="clicks"
              className="h-2 w-2 tablet:h-6 tablet:w-6"
            />
            <h2 className="text-gray-1 text-[8px] font-semibold leading-[9.68px] dark:text-white-400 tablet:text-[18px] tablet:leading-[21.78px]">
              {data?.articleSetting?.viewCount} Views{' '}
            </h2>
          </div>
          <div className="flex items-center gap-[1px] tablet:gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/group.svg' : 'assets/svgs/participants.svg'}`}
              alt="participants"
              className="h-2 w-3 tablet:h-[26px] tablet:w-[34px]"
            />
            <h2 className="text-gray-1 text-[8px] font-semibold leading-[9.68px] dark:text-white-400 tablet:text-[18px] tablet:leading-[21.78px]">
              {data?.articleSetting?.submitEngagementsOfArticleSharedByUniqueLink.length} Engagements{' '}
            </h2>
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 px-[0.87rem] tablet:gap-4 tablet:px-10">
          {isProfilePage && !data?.spotLightType && (
            <div className="grid w-full grid-cols-2 gap-3 tablet:gap-[1.4rem]">
              <div></div>
              <Button
                variant="submit"
                onClick={() => {
                  const domain = persistedUserInfo.badges.find((badge) => badge.domain)?.domain.name;
                  handleSpotLight({ domain, type: 'news', id: data._id, status: 'set' });
                }}
                className={'w-full max-w-full bg-[#DC1010] tablet:w-full laptop:w-full'}
              >
                Pin to Spotlight
              </Button>
            </div>
          )}
          <div className="grid w-full grid-cols-2 gap-3 tablet:gap-[1.4rem]">
            <div></div>
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
          <div className="grid w-full grid-cols-2 gap-3 tablet:gap-[1.4rem]">
            <div className="w-full">
              <Button
                variant="danger"
                onClick={() => {
                  setType('delete');
                  setDeleteModal(true);
                }}
                className={'w-full max-w-full bg-[#DC1010] tablet:w-full laptop:w-full'}
              >
                Delete
              </Button>
            </div>
            {data?.articleSetting?.isEnable ? (
              <Button
                variant="danger"
                onClick={() => {
                  setType('disable');
                  setDeleteModal(true);
                }}
                className={'w-full max-w-full bg-[#DC1010] tablet:w-full laptop:w-full'}
              >
                Disable Sharing
              </Button>
            ) : (
              <Button
                variant="submit"
                className={'w-full !px-0 laptop:!px-0'}
                onClick={() => {
                  setType('enable');
                  setDeleteModal(true);
                }}
              >
                Enable Sharing
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* Footer */}
      {/* Share */}
      <div className="relative flex items-center justify-end border-t-2 border-gray-250 px-[0.57rem] py-[5px] dark:border-gray-100 tablet:px-5 tablet:py-3">
        {/* <button
          className={`flex w-fit items-center gap-1 tablet:gap-2`}
          onClick={() => {
            setType('delete');
            setDeleteModal(true);
          }}
        >
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/trash.svg' : 'assets/svgs/dashboard/trash2.svg'}`}
            alt="trash"
            className="h-3 w-[9px] cursor-pointer tablet:h-[30px] tablet:w-[25px]"
          />
        </button> */}
        {/* Created At */}
        <p className="text-gray-1 text-[10px] font-normal dark:text-white tablet:text-[20px]">
          Shared {calculateTimeAgo(data?.articleSetting?.createdAt)}
        </p>
      </div>
      <DeleteShareArticleLink
        handleClose={() => setDeleteModal(false)}
        modalVisible={deleteModal}
        articleData={data}
        type={type}
      />
    </div>
  );
}
