import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/Button';
import { useGenerateArticleLink } from '../../../../services/api/articles';
import { getConstantsValues } from '../../../../features/constants/constantsSlice';
import Copy from '../../../../assets/optionbar/Copy';
import showToast from '../../../../components/ui/Toast';
import PopUp from '../../../../components/ui/PopUp';

const ShareNewsArticle = ({ handleClose, modalVisible, title, image, questStartData }) => {
  const navigate = useNavigate();
  const persistedContants = useSelector(getConstantsValues);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const { protocol, host } = window.location;
  const [createCustom, setCreateCustom] = useState(false);
  const [link, setLink] = useState('');
  const [postLink, setPostLink] = useState(questStartData?.articleSetting?.uniqueLink || '');
  let url = `${protocol}//${host}/r/`;

  const copyToClipboard = async () => {
    const textToCopy = url + postLink;

    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (err) {
      console.error('Unable to copy text to clipboard:', err);
    }
  };

  const { mutateAsync: handleGenerateLink, isPending } = useGenerateArticleLink(setPostLink);

  useEffect(() => {
    if (questStartData.articleSetting?.uniqueLink === '' || !questStartData?.articleSetting?.uniqueLink) {
      handleGenerateLink({
        id: questStartData._id,
        uuid: persistedUserInfo.uuid,
      });
    }
  }, []);

  return (
    <PopUp logo={image} title={title} open={modalVisible} handleClose={handleClose}>
      <div className="flex flex-col justify-center py-[15px] dark:rounded-b-[0.5rem] dark:border dark:border-gray-100 tablet:py-[25px] dark:tablet:rounded-b-[1.5rem]">
        <div className="px-[20px] laptop:px-[80px]">
          <p className="text-gray-1 mb-[10px] text-[12px] font-medium leading-[13.56px] dark:text-gray-300 tablet:mb-5 tablet:text-[16px] tablet:leading-normal">
            {createCustom
              ? 'Custom Link Address'
              : 'Copy the link below to share this article across other platforms and expand its reach. Shared articles will also appear on your Home Page.'}
          </p>
          <div className="flex rounded-[9.42px] border border-white-500 dark:border-gray-100 dark:bg-accent-100 tablet:rounded-[15px] tablet:border-[3px]">
            {/* Generate Link || Custom Link Input */}
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
                    if (questStartData?.articleSetting.uniqueCustomizedLinkGenerated) return;
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
                  {isPending ? <span className="italic">Generating link..</span> : url + postLink}
                </p>
              </div>
            )}

            {/* Copy Button */}
            {!createCustom && (
              <button
                className="rounded-r-[9px] bg-white-500 px-[11px] py-[6px] dark:bg-gray-100 tablet:rounded-r-[10px] tablet:px-5 tablet:py-[14px]"
                onClick={() => {
                  copyToClipboard();
                  showToast('success', 'copyLink');
                }}
                disabled={isPending}
              >
                <Copy color={persistedTheme === 'dark' ? '#293138' : '#8BAAC0'} />
              </button>
            )}
          </div>
        </div>
        <div className={'mx-[10px] mt-[10px] flex justify-end gap-4 tablet:mx-[40px] tablet:mt-6 tablet:gap-8'}>
          {!createCustom ? (
            <div className="flex items-center justify-between gap-3">
              <Button
                variant={'submit'}
                className={'w-fit min-w-fit whitespace-nowrap'}
                onClick={() => {
                  setCreateCustom(true);
                  if (
                    questStartData?.articleSetting.uniqueLink &&
                    questStartData?.articleSetting.uniqueCustomizedLinkGenerated
                  ) {
                    setLink(questStartData.articleSetting.uniqueLink);
                  } else {
                    setLink('');
                  }
                }}
              >
                Create Custom Link
              </Button>
              <Button
                variant={'submit'}
                className={'w-fit min-w-fit whitespace-nowrap'}
                onClick={() => navigate('/profile/shared-articles')}
              >
                Manage Shared Articles
              </Button>
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
                onClick={() => {
                  handleGenerateLink({
                    id: questStartData._id,
                    customLink: link,
                    uuid: persistedUserInfo.uuid,
                  });
                }}
                disabled={isPending || questStartData?.articleSetting.uniqueCustomizedLinkGenerated}
              >
                {isPending ? (
                  <FaSpinner className="animate-spin text-[#EAEAEA]" />
                ) : (
                  <>
                    Create{' '}
                    <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[10px] tablet:text-[13px]">
                      (-{persistedContants?.USER_LIST_LINK_CUSTOMIZATION_DEDUCTION_AMOUNT} FDX)
                    </span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </PopUp>
  );
};

export default ShareNewsArticle;
