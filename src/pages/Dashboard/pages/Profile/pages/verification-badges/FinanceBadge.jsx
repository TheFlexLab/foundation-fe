import { toast } from 'sonner';
import { useState } from 'react';
import { CanAdd } from './badgeUtils';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../../../../../components/ui/Button';
import { finance } from '../../../../../../constants/varification-badges';
import { setGuestSignUpDialogue } from '../../../../../../features/extras/extrasSlice';
import { getConstantsValues } from '../../../../../../features/constants/constantsSlice';
import { checkBadgeExists } from '../../../../../../utils/helper-function/badge-service';
import api from '../../../../../../services/api/Axios';
import ConnectPopup from '../../../../../../components/dialogue-boxes/ConnectPopup';
import showToast from '../../../../../../components/ui/Toast';

export default function FinanceBadge({ checkPseudoBadge, handleRemoveBadgePopup }) {
  const dispatch = useDispatch();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedContants = useSelector(getConstantsValues);
  const [isFinancePopup, setIsFinancePopup] = useState(false);
  const [selectedFinanceBadge, setSelectedFinanceBadge] = useState('');

  const handleClickFinanceBadges = async (type) => {
    if (persistedUserInfo?.role === 'guest' || persistedUserInfo?.role === 'visitor') {
      dispatch(setGuestSignUpDialogue(true));
      return;
    } else {
      const timeRemaining = CanAdd(persistedUserInfo, type, 'finance');
      if (timeRemaining === true || checkPseudoBadge()) {
        setIsFinancePopup(true);
        setSelectedFinanceBadge(type);
      } else {
        toast.warning(`You need to wait just ${timeRemaining} more days before you can unlock this badge.`);
      }
    }
  };

  const handleConnect = async (integrationType) => {
    switch (integrationType) {
      case 'stripe':
        const response = await api.get(`/connectStripe?uuid=${persistedUserInfo?.uuid}`);
        window.location.href = response.data.url;
      default:
        return null;
    }
  };

  const renderFinanceBadgesPopup = () => {
    if (!isFinancePopup) {
      return null;
    }

    switch (selectedFinanceBadge) {
      case 'stripe':
        return (
          <ConnectPopup
            isPopup={isFinancePopup}
            setIsPopup={setIsFinancePopup}
            title="Stripe"
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/stripe.svg`}
            accountName="Stripe"
            // handleSkip={handleSkip}
            // onboarding={true}
            // progress={50}
            summaryText="Connect your account to get started with personalized insights."
            handleConnect={() => handleConnect('stripe')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <h1 className="summary-text">Your Finance serves as a central hub for managing your finance.</h1>
      {renderFinanceBadgesPopup()}
      <div className="flex flex-col items-center justify-between gap-[5px] pt-[10px] tablet:gap-4 tablet:pt-[18.73px]">
        {finance.map((item, index) => (
          <div
            key={index + 1}
            className={`flex items-center justify-center gap-[10px] tablet:justify-start laptop:gap-5 ${item.disabled ? 'opacity-60' : ''}`}
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-[6.389vw] w-[6.389vw] rounded-full tablet:size-[50px]"
            />
            <div
              className={`${persistedTheme === 'dark' ? 'dark-shadow-input' : ''} flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-white-500 dark:border-gray-100 dark:bg-accent-100 tablet:h-[50px] tablet:w-[200px] tablet:rounded-[8px] tablet:border-[3px] laptop:rounded-[15px]`}
            >
              <h1 className="text-[2.11vw] font-medium leading-normal text-gray dark:text-gray-400 tablet:text-[20px]">
                {item.title}
              </h1>
            </div>
            <Button
              variant={checkBadgeExists(persistedUserInfo, item.type) ? 'verification-badge-remove' : item.ButtonColor}
              onClick={() => {
                if (item.type === 'stripe') {
                  showToast('info', 'featureComingSoon');
                  return;
                }
                if (checkBadgeExists(persistedUserInfo, item.type)) {
                  handleRemoveBadgePopup({
                    title: item.title,
                    image: item.image,
                    type: item.type,
                    badgeType: 'finance',
                  });
                } else {
                  handleClickFinanceBadges(item.type, checkBadgeExists(persistedUserInfo, item.type));
                }
              }}
              disabled={item.disabled}
            >
              {checkBadgeExists(persistedUserInfo, item.type) ? 'Remove Badge' : item.ButtonText}
              {!checkBadgeExists(persistedUserInfo, item.type) && (
                <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] tablet:text-[13px]">
                  (+{persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)
                </span>
              )}
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
