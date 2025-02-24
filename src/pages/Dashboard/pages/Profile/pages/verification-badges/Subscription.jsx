import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { subscription } from '../../../../../../constants/varification-badges';
import { toast } from 'sonner';
import api from '../../../../../../services/api/Axios';
import { getConstantsValues } from '../../../../../../features/constants/constantsSlice';
import { Button } from '../../../../../../components/ui/Button';
import { CanAdd } from './badgeUtils';
import { setGuestSignUpDialogue } from '../../../../../../features/extras/extrasSlice';
import SubscriptionBadgesPopup from '../../../../../../components/dialogue-boxes/SubscriptionBadgesPopup';

export default function Subscription({
  fetchUser,
  handleOpenPasswordConfirmation,
  checkLegacyBadge,
  handlePasskeyConfirmation,
  getAskPassword,
  checkPseudoBadge,
}) {
  const dispatch = useDispatch();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedContants = useSelector(getConstantsValues);

  const [isSubscriptionPopup, setIsSubscriptionPopup] = useState(false);
  const [seletedSubscriptionBadge, setSelectedSubscriptionBadge] = useState('');
  const [edit, setEdit] = useState(false);

  const checkSubscriptionBadge = (itemType) =>
    fetchUser?.badges?.some((badge) => badge?.subscription?.hasOwnProperty(itemType) || false) || false;

  const handleClickSubscriptionBadges = async (type, edit) => {
    if (persistedUserInfo?.role === 'guest' || persistedUserInfo?.role === 'visitor') {
      dispatch(setGuestSignUpDialogue(true));
      return;
    } else {
      const timeRemaining = CanAdd(persistedUserInfo, type, 'subscription');
      if (timeRemaining === true || checkPseudoBadge()) {
        if ((checkLegacyBadge() && !localStorage.getItem('legacyHash')) || (checkLegacyBadge() && getAskPassword))
          await handleOpenPasswordConfirmation();

        if (edit) {
          setEdit(true);
        } else {
          setEdit(false);
        }
        setIsSubscriptionPopup(true);
        setSelectedSubscriptionBadge(type);
      } else {
        toast.warning(`You need to wait just ${timeRemaining} more days before you can unlock this badge.`);
      }
    }
  };

  const renderSubscriptionBadgesPopup = () => {
    if (!isSubscriptionPopup) {
      return null;
    }

    switch (seletedSubscriptionBadge) {
      case 'currentTypeToBeBuilt':
        return (
          <SubscriptionBadgesPopup
            isPopup={isSubscriptionPopup}
            setIsPopup={setIsSubscriptionPopup}
            title="Identity"
            type={'identity'}
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/identity.svg`}
            placeholder="Identity Here"
            edit={edit}
            setEdit={setEdit}
            fetchUser={fetchUser}
            setIsSubscriptionPopup={setIsSubscriptionPopup}
          />
        );
      default:
        return null;
    }
  };

  const SubscriptionItem = ({ item, persistedTheme, checkSubscriptionBadge, handleClickSubscriptionBadges }) => (
    <div
      className={`flex items-center justify-center gap-[10px] tablet:justify-start laptop:gap-5 ${item.disabled ? 'opacity-60' : ''}`}
    >
      <img src={item.image} alt={item.title} className="h-[6.389vw] w-[6.389vw] tablet:size-[50px]" />
      <div
        className={`${persistedTheme === 'dark' ? 'dark-shadow-input' : ''} flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-white-500 dark:border-gray-100 dark:bg-accent-100 tablet:h-[50px] tablet:w-[200px] tablet:rounded-[8px] tablet:border-[3px] laptop:rounded-[15px]`}
      >
        <h1 className="text-gray text-[2.11vw] font-medium leading-normal dark:text-gray-400 tablet:text-[20px]">
          {item.title}
        </h1>
      </div>

      {item?.type === 'currentTypeToBeBuilt' ? (
        <Button
          variant={checkSubscriptionBadge(item.type) ? 'verification-badge-edit' : item.ButtonColor}
          onClick={() => {
            handleClickSubscriptionBadges(item.type, checkSubscriptionBadge(item.type) ? true : false);
          }}
          disabled={item.disabled}
        >
          {checkSubscriptionBadge(item.type) ? 'Edit' : item.ButtonText}
          {!checkSubscriptionBadge(item.type) && (
            <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] tablet:text-[13px]">
              (+{persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)
            </span>
          )}
        </Button>
      ) : (
        <Button
          onClick={() => handleClickSubscriptionBadges(item.type, checkSubscriptionBadge(item.type))}
          variant={'verification-badge-hollow'}
          disabled={item.disabled}
        >
          Coming Soon
        </Button>
      )}
    </div>
  );

  return (
    <>
      <h1 className="summary-text">Invest in your verification to boost your credibility and earning potential.</h1>
      {renderSubscriptionBadgesPopup()}
      <div className="flex flex-col items-center justify-between gap-[5px] pt-[10px] tablet:gap-4 tablet:pt-[18.73px]">
        {subscription.map((item, index) => (
          <SubscriptionItem
            key={index}
            item={item}
            persistedTheme={persistedTheme}
            checkSubscriptionBadge={checkSubscriptionBadge}
            handleClickSubscriptionBadges={handleClickSubscriptionBadges}
          />
        ))}
      </div>
    </>
  );
}
