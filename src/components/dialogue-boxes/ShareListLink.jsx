import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { generateCategoryShareLink } from '../../services/api/listsApi';
import { getConstantsValues } from '../../features/constants/constantsSlice';
import showToast from '../ui/Toast';
import Copy from '../../assets/optionbar/Copy';

const ShareListLink = ({ handleClose, selectedItem }) => {
  const navigate = useNavigate();
  const persistedContants = useSelector(getConstantsValues);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const { protocol, host } = window.location;
  const [postLink, setPostLink] = useState(selectedItem?.link || '');
  let url = `${protocol}//${host}/l/`;

  const [isLoading, setIsLoading] = useState(false);
  const [createCustom, setCreateCustom] = useState(false);
  const [link, setLink] = useState('');

  const copyToClipboard = async () => {
    const textToCopy = url + postLink;

    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (err) {
      console.error('Unable to copy text to clipboard:', err);
    }
  };

  const uniqueLinkQuestSetting = async () => {
    setIsLoading(true);
    if (selectedItem.link === null) {
      const resp = await generateCategoryShareLink(persistedUserInfo.uuid, selectedItem._id);

      if (resp.status === 200) {
        setPostLink(resp.data.link);
        setIsLoading(false);
        queryClient.invalidateQueries(['collection']);
      }
    } else {
      setPostLink(selectedItem?.link);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    uniqueLinkQuestSetting();
  }, []);

  const generateCustomLink = async () => {
    try {
      if (selectedItem.isLinkUserCustomized === false) {
        if (link === '') {
          showToast('error', 'emptyLink');
          return;
        }
        const res = await generateCategoryShareLink(persistedUserInfo.uuid, selectedItem._id, link);
        if (res?.status && res.status === 200) {
          setPostLink(res.data.link);
          setCreateCustom(false);
          queryClient.invalidateQueries(['userInfo']);
          // showToast('success', 'linkCreated');
        }
      } else {
        showToast('warning', 'linkAlready');
      }
    } catch (err) {
      console.log('err', err.response?.data?.message.split(':')[1]);
    }
  };

  return (
    <div className="relative w-[90vw] laptop:w-[52.6rem]">
      {/* Dialogue box header */}
      <div className="social-blue-gradiant relative flex items-center gap-[10px] rounded-t-[9.251px] from-accent-100 to-accent-100 px-[15px] py-1 dark:border dark:border-gray-100 dark:bg-gradient-to-tr tablet:gap-4 tablet:rounded-t-[26px] tablet:px-[30px] tablet:py-[8px]">
        <div className="w-fit rounded-full bg-white p-[5px] tablet:p-[10px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 31 30"
            fill="none"
            className="h-[14px] w-[14px] tablet:h-[31px] tablet:w-[31px]"
          >
            <path
              d="M24.7022 28.1248H11.1396C9.98347 28.1248 8.87465 27.6803 8.05711 26.8891C7.23956 26.0979 6.78027 25.0249 6.78027 23.906V10.781C6.78027 9.66213 7.23956 8.58907 8.05711 7.7979C8.87465 7.00673 9.98347 6.56226 11.1396 6.56226H24.7022C25.8583 6.56226 26.9672 7.00673 27.7847 7.7979C28.6022 8.58907 29.0615 9.66213 29.0615 10.781V23.906C29.0615 25.0249 28.6022 26.0979 27.7847 26.8891C26.9672 27.6803 25.8583 28.1248 24.7022 28.1248Z"
              fill="#707175"
            />
            <path
              d="M9.68847 4.68799H23.9703C23.6689 3.86606 23.112 3.15452 22.3762 2.65097C21.6404 2.14742 20.7616 1.87654 19.8603 1.87549H6.29785C5.14167 1.87549 4.03285 2.31996 3.21531 3.11113C2.39777 3.9023 1.93848 4.97536 1.93848 6.09424V19.2192C1.93956 20.0914 2.21947 20.9418 2.73981 21.6539C3.26014 22.366 3.9954 22.9049 4.84473 23.1966V9.37549C4.84473 8.13228 5.35505 6.94 6.26343 6.06092C7.17181 5.18185 8.40383 4.68799 9.68847 4.68799Z"
              fill="#707175"
            />
          </svg>
        </div>
        <p className="text-[12px] font-bold text-white tablet:text-[20px] tablet:font-medium">Share Collection</p>
        <div
          className="absolute right-[12px] top-1/2 -translate-y-1/2 cursor-pointer tablet:right-[26px]"
          onClick={handleClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 23 23"
            fill="none"
            className="h-[10px] w-[10px] tablet:h-[23px] tablet:w-[23px]"
          >
            <path
              d="M0.742781 4.71145C-0.210937 3.77788 -0.251625 2.22222 0.651895 1.23678C1.55542 0.251347 3.06101 0.209303 4.01472 1.14287L10.9221 7.9044L17.466 0.76724C18.3696 -0.218195 19.8751 -0.260239 20.8289 0.673332C21.7826 1.6069 21.8233 3.16257 20.9197 4.148L14.3759 11.2852L21.2833 18.0467C22.237 18.9803 22.2777 20.5359 21.3742 21.5213C20.4706 22.5068 18.9651 22.5488 18.0113 21.6153L11.1039 14.8537L4.56004 21.9909C3.65651 22.9763 2.15092 23.0184 1.19721 22.0848C0.243494 21.1512 0.202803 19.5956 1.10632 18.6101L7.65021 11.473L0.742781 4.71145Z"
              fill="#F3F3F3"
            />
          </svg>
        </div>
      </div>

      {/* Dialogue box body */}
      <div className="flex flex-col justify-center py-[15px] dark:rounded-b-[0.5rem] dark:border dark:border-gray-100 dark:bg-gray-200 tablet:py-[25px] dark:tablet:rounded-b-[1.5rem]">
        <div className="px-[20px] laptop:px-[80px]">
          <p className="text-gray-1 mb-[10px] text-[12px] font-medium leading-[13.56px] dark:bg-gray-200 dark:text-gray-300 tablet:mb-5 tablet:text-[16px] tablet:leading-normal">
            {createCustom
              ? 'Custom Link Address'
              : 'When people engage with posts in your Shared collection, you will earn FDX. Collections you share are displayed on your Home Page for everyone to see. '}
          </p>
          <p className="text-gray-1 mb-[10px] text-[12px] font-medium leading-[13.56px] dark:bg-gray-200 dark:text-gray-300 tablet:mb-5 tablet:text-[16px] tablet:leading-normal">
            Copy the link below to share this collection on other platforms.
          </p>
          <div className="flex rounded-[9.42px] border border-white-500 dark:border-gray-100 dark:bg-accent-100 tablet:rounded-[15px] tablet:border-[3px]">
            {createCustom ? (
              <div className="flex h-[28.38px] items-center tablet:h-[62.92px]">
                <p className="pl-[9.43px] text-[9.42px] font-normal leading-[9.42px] text-[#435059] dark:text-gray-300 tablet:pl-4 tablet:text-[26px] tablet:leading-[30px]">
                  {url}
                </p>
                <input
                  type="text"
                  className="w-full bg-transparent pr-[1.58rem] text-[9.42px] font-normal text-[#435059] [outline:none] dark:text-gray-300 tablet:text-[26px] tablet:leading-[30px]"
                  value={link}
                  onChange={(e) => {
                    if (selectedItem?.isLinkUserCustomized) return;
                    const inputValue = e.target.value;
                    if (inputValue.length <= 35) {
                      setLink(inputValue);
                    } else {
                      setLink(inputValue.slice(0, 35));
                    }
                  }}
                />
              </div>
            ) : (
              <div className="flex w-full items-center rounded-l-[9.42px] pl-[9.43px] pr-[1.58rem] tablet:pl-4 laptop:rounded-l-[26px] laptop:pr-[70px]">
                <p className="w-[48vw] truncate text-[9.42px] font-normal leading-normal text-[#435059] dark:text-gray-300 tablet:text-[26px] tablet:leading-[30px] laptop:w-[32.7vw] desktop:w-[32rem]">
                  {isLoading ? <p className="italic">Generating link..</p> : url + postLink}
                </p>
              </div>
            )}
            {!createCustom && (
              <button
                className="rounded-r-[9px] bg-white-500 px-[11px] py-[6px] dark:bg-gray-100 tablet:rounded-r-[10px] tablet:px-5 tablet:py-[14px]"
                onClick={() => {
                  copyToClipboard();
                  showToast('success', 'copyLink');
                }}
              >
                <Copy color={persistedTheme === 'dark' ? '#293138' : '#8BAAC0'} />
              </button>
            )}
          </div>
        </div>
        <div
          className={
            'mx-[10px] mt-[10px] flex justify-end gap-4 dark:bg-gray-200 tablet:mx-[40px] tablet:mt-6 tablet:gap-8'
          }
        >
          {!createCustom ? (
            <div className="flex items-center gap-[25px]">
              <Button
                variant={'submit'}
                className={'w-fit min-w-fit whitespace-nowrap'}
                onClick={() => {
                  setCreateCustom(true);
                  if (selectedItem?.isLinkUserCustomized) {
                    setLink(selectedItem?.link);
                  }
                }}
              >
                Create Custom Link
              </Button>
              {location.pathname !== '/profile/collections' && (
                <Button
                  variant={'submit'}
                  className={'w-fit min-w-fit whitespace-nowrap'}
                  onClick={() =>
                    navigate('/shared-collection-link/result', {
                      state: { categoryItem: selectedItem?._id },
                    })
                  }
                >
                  Manage Shared Collections
                </Button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4 tablet:gap-[25px]">
              <Button
                variant={'cancel'}
                className={'w-fit min-w-fit whitespace-nowrap px-2'}
                onClick={() => setCreateCustom(false)}
              >
                Go Back
              </Button>
              <Button
                variant={'submit'}
                className={'w-fit min-w-fit whitespace-nowrap'}
                onClick={generateCustomLink}
                disabled={selectedItem?.linkCustomized}
              >
                Create{' '}
                <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[10px] tablet:text-[13px]">
                  (-{persistedContants?.USER_QUEST_SETTING_LINK_CUSTOMIZATION_DEDUCTION_AMOUNT} FDX)
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareListLink;
