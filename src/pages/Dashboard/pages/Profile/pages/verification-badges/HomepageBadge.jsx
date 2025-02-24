import { toast } from 'sonner';
import { useState } from 'react';
import { CanAdd } from './badgeUtils';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../../../../../components/ui/Button';
import {
  domainHomepageBadges,
  homepageBadges,
  profileHomepageBadges,
} from '../../../../../../constants/varification-badges';
import { setGuestSignUpDialogue } from '../../../../../../features/extras/extrasSlice';
import { getConstantsValues } from '../../../../../../features/constants/constantsSlice';
import HomepageBadgePopup from '../../../../../../components/dialogue-boxes/HomepageBadgePopup';
import LinkHubPopup from '../../../../../../components/dialogue-boxes/LinkHubPopup';

export default function HomepageBadge({ checkPseudoBadge, isProfile, isDomain }) {
  const dispatch = useDispatch();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedContants = useSelector(getConstantsValues);
  const [isPersonalPopup, setIsPersonalPopup] = useState(false);
  const [selectedPersonalBadge, setSelectedPersonalBadge] = useState('');
  const [edit, setEdit] = useState(false);

  const checkAlready = (type) => {
    if (type === 'domainBadge') {
      return persistedUserInfo?.badges?.some((badge) => !!badge?.domain) || false;
    } else if (type === 'linkHub') {
      return persistedUserInfo?.badges?.some((badge) => badge?.personal?.hasOwnProperty(type) || false) || false;
    }
  };

  const handleClickPesonalBadges = async (type, edit) => {
    if (persistedUserInfo?.role === 'guest' || persistedUserInfo?.role === 'visitor') {
      dispatch(setGuestSignUpDialogue(true));
      return;
    } else {
      const timeRemaining = CanAdd(persistedUserInfo, type, 'personal');
      if (timeRemaining === true || checkPseudoBadge()) {
        if (edit) {
          setEdit(true);
        } else {
          setEdit(false);
        }
        setIsPersonalPopup(true);
        setSelectedPersonalBadge(type);
      } else {
        toast.warning(`You need to wait just ${timeRemaining} more days before you can unlock this badge.`);
      }
    }
  };

  const renderPersonalBadgesPopup = () => {
    if (!isPersonalPopup) {
      return null;
    }

    switch (selectedPersonalBadge) {
      case 'domainBadge':
        return (
          <HomepageBadgePopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="Domain"
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/domain.svg`}
            edit={edit}
            setIsPersonalPopup={setIsPersonalPopup}
          />
        );
      case 'linkHub':
        return (
          <LinkHubPopup
            isPopup={isPersonalPopup}
            setIsPopup={setIsPersonalPopup}
            title="Link Hub"
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/linkhub.svg`}
            edit={edit}
            type={'linkHub'}
            setIsPersonalPopup={setIsPersonalPopup}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {!isProfile && !isDomain && (
        <h1 className="summary-text">
          Your Home Page serves as a central hub for sharing and connecting with your audience.
        </h1>
      )}
      {renderPersonalBadgesPopup()}
      <div className="flex flex-col items-center justify-between gap-[5px] pt-[10px] tablet:gap-4 tablet:pt-[18.73px]">
        {(isProfile ? profileHomepageBadges : isDomain ? domainHomepageBadges : homepageBadges).map((item, index) => (
          <div
            key={index + 1}
            className={`flex items-center justify-center gap-[10px] tablet:justify-start laptop:gap-5 ${item.disabled ? 'opacity-60' : ''}`}
          >
            <img src={item.image} alt={item.title} className="h-[6.389vw] w-[6.389vw] tablet:size-[50px]" />
            <div
              className={`${persistedTheme === 'dark' ? 'dark-shadow-input' : ''} flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-white-500 dark:border-gray-100 dark:bg-accent-100 tablet:h-[50px] tablet:w-[200px] tablet:rounded-[8px] tablet:border-[3px] laptop:rounded-[15px]`}
            >
              <h1 className="text-[2.11vw] font-medium leading-normal text-gray dark:text-gray-400 tablet:text-[20px]">
                {item.title}
              </h1>
            </div>
            <Button
              variant={checkAlready(item.type) ? 'verification-badge-edit' : item.ButtonColor}
              onClick={() => {
                handleClickPesonalBadges(item.type, checkAlready(item.type));
              }}
              disabled={item.disabled}
            >
              {checkAlready(item.type) ? 'Edit' : item.ButtonText}
              {!checkAlready(item.type) && (
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
