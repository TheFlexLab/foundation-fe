import { useState } from 'react';
import { socials } from '../../../../../../constants/varification-badges';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../../../../../components/ui/Button';
import { getConstantsValues } from '../../../../../../features/constants/constantsSlice';
import { getAskPassword } from '../../../../../../features/profile/userSettingSlice';
import { toast } from 'sonner';
import { CanAdd } from './badgeUtils';
import { setGuestSignUpDialogue } from '../../../../../../features/extras/extrasSlice';
import SocialConnectPopup from './SocialConnectPopup';
import showToast from '../../../../../../components/ui/Toast';

const Social = ({
  handleRemoveBadgePopup,
  handleOpenPasswordConfirmation,
  checkLegacyBadge,
  checkSocial,
  checkPrimary,
  checkPseudoBadge,
  handleSkip,
  onboarding,
}) => {
  const dispatch = useDispatch();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedContants = useSelector(getConstantsValues);
  const getAskPasswordFromRedux = useSelector(getAskPassword);
  const [isPopup, setIsPopup] = useState(false);
  const [popupData, setPopupData] = useState(null);

  const filteredSocials = socials.filter((item) => {
    // Check if the user is limited and if the item is Facebook
    if ('test@foundation-io.com' !== persistedUserInfo.email && item.accountName === 'facebook') {
      return false;
    }
    return true;
  });

  const handleGuestBadgeAdd = () => {
    dispatch(setGuestSignUpDialogue(true));
    return;
  };

  return (
    <>
      <SocialConnectPopup
        isPopup={isPopup}
        setIsPopup={setIsPopup}
        title={popupData?.title}
        logo={popupData?.logo}
        accountName={popupData?.accountName}
        type={popupData?.type}
        link={popupData?.link}
        handleSkip={handleSkip}
        onboarding={onboarding}
      />
      <h1 className="summary-text">
        Linking your social media accounts boosts your credibility and verifies your identity within the Foundation
        community.
      </h1>

      <div className="flex flex-col items-center justify-between rounded-[16.068px] pt-[10px] tablet:pt-[18.73px]">
        <div className="flex flex-col gap-[5px] tablet:gap-4">
          {socials.map((item, index) => (
            <div
              className="relative flex items-center justify-center gap-[10px] tablet:justify-start laptop:gap-5"
              key={index}
            >
              <div className="absolute -left-5 tablet:-left-[42px] laptop:-left-[33px] desktop:-left-[42px]">
                {checkPrimary(item.accountName) && (
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/primary.svg`}
                    alt="primary"
                    className="size-[15px] tablet:size-[30px]"
                  />
                )}
              </div>
              <img src={item.image} alt={item.title} className="h-[6.389vw] w-[6.389vw] tablet:size-[50px]" />
              <div className="flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-white-500 dark:border-gray-100 dark:bg-accent-100 tablet:h-[50px] tablet:w-[200px] tablet:rounded-[8px] tablet:border-[3px] laptop:rounded-[15px]">
                <h1 className="text-[2.11vw] font-medium leading-normal text-gray dark:text-gray-400 tablet:text-[20px]">
                  {item.title}
                </h1>
              </div>
              <Button
                disabled={checkPrimary(item.accountName)}
                variant={
                  checkSocial(item.accountName)
                    ? checkPrimary(item.accountName)
                      ? 'verification-badge-edit'
                      : 'verification-badge-remove'
                    : 'submit'
                }
                onClick={async () => {
                  if (persistedUserInfo?.role === 'guest' || persistedUserInfo?.role === 'visitor') {
                    handleGuestBadgeAdd();
                    return;
                  }
                  // if (item.type === 'youtube') {
                  //   showToast('info', 'featureComingSoon');
                  //   return;
                  // }

                  if (checkSocial(item.accountName)) {
                    handleRemoveBadgePopup({
                      title: item.title,
                      image: item.image,
                      type: item.type,
                      badgeType: item.type,
                      accountName: item.accountName,
                    });
                  } else {
                    const timeRemaining = CanAdd(persistedUserInfo, item.type, 'social');
                    if (timeRemaining === true || checkPseudoBadge()) {
                      if (
                        (checkLegacyBadge() && !localStorage.getItem('legacyHash')) ||
                        (checkLegacyBadge() && getAskPasswordFromRedux)
                      ) {
                        await handleOpenPasswordConfirmation();
                      }
                      setPopupData({
                        title: item.title,
                        logo: item.image,
                        accountName: item.accountName,
                        type: item.type,
                        link: item.link,
                      });
                      setIsPopup(true);
                    } else {
                      toast.warning(
                        `You need to wait just ${timeRemaining} more days before you can unlock this badge.`
                      );
                    }
                  }
                }}
              >
                <>
                  {checkSocial(item.accountName)
                    ? checkPrimary(item.accountName)
                      ? 'Added'
                      : 'Remove Badge'
                    : 'Add Badge'}
                  <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] tablet:text-[13px]">
                    {checkSocial(item.accountName) ? '' : `(+${persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)`}
                  </span>
                </>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Social;
