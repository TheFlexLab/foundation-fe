import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { contacts, legacy } from '../../../../../../constants/varification-badges';
import VerificationPopups from '../../components/VerificationPopups';

import AddCellPhonePopup from '../../../../../../components/dialogue-boxes/AddCellPhonePopup';
import { getConstantsValues } from '../../../../../../features/constants/constantsSlice';
import LegacyBadgePopup from '../../../../../../components/dialogue-boxes/LegacyBadgePopup';
import { Button } from '../../../../../../components/ui/Button';
import { CanAdd } from './badgeUtils';
import { setGuestSignUpDialogue } from '../../../../../../features/extras/extrasSlice';

export default function Contact({
  fetchUser,
  handleRemoveBadgePopup,
  handleOpenPasswordConfirmation,
  checkLegacyBadge,
  getAskPassword,
  checkPseudoBadge,
}) {
  const [isPersonalPopup, setIsPersonalPopup] = useState(false);

  checkLegacyBadge();
  const dispatch = useDispatch();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedContants = useSelector(getConstantsValues);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [isPopup, setIsPopup] = useState(false);
  const [seletedBadge, setSelectedBadge] = useState('');
  const handleClose = () => {
    setIsPopup(false);
  };

  const checkContact = (itemType) => fetchUser?.badges?.some((i) => i.type === itemType);
  const checkPrimary = (itemType) => fetchUser?.badges?.some((i) => i.type === itemType && i.primary === true);

  const handleGuestBadgeAdd = () => {
    dispatch(setGuestSignUpDialogue(true));
    return;
  };
  const handleClickContactBadgeEmail = async (type, title, image) => {
    if (persistedUserInfo?.role === 'guest' || persistedUserInfo?.role === 'visitor') {
      handleGuestBadgeAdd();
    } else {
      if ((checkLegacyBadge() && !localStorage.getItem('legacyHash')) || (checkLegacyBadge() && getAskPassword)) {
        const timeRemaining = CanAdd(persistedUserInfo, type, 'contact');
        if (timeRemaining === true || checkPseudoBadge()) {
          await handleOpenPasswordConfirmation();
        } else {
          toast.warning(`You need to wait just ${timeRemaining} more days before you can unlock this badge.`);
        }
      }
      if (!checkContact(type)) {
        const timeRemaining = CanAdd(persistedUserInfo, type, 'contact');

        if (timeRemaining === true || checkPseudoBadge()) {
          setIsPopup(true);
          setSelectedBadge(type);
        } else {
          toast.warning(`You need to wait just ${timeRemaining} more days before you can unlock this badge.`);
        }
      } else if (checkContact(type) && !checkPrimary(type)) {
        handleRemoveBadgePopup({
          title: title,
          image: image,
          type: type,
          badgeType: 'contact',
        });
      }
    }
  };

  const ContactItem = ({ item, index, persistedTheme, checkContact, checkPrimary, handleClickContactBadgeEmail }) => {
    return (
      <div
        className={`relative flex items-center justify-center gap-[10px] tablet:justify-start laptop:justify-center laptop:gap-5 desktop:justify-start ${item.disabled && 'opacity-[60%]'}`}
        key={index}
      >
        <div className="absolute -left-5 tablet:-left-[42px] laptop:-left-[33px] desktop:-left-[42px]">
          {checkPrimary(item.type) && (
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/primary.svg`}
              alt="primary"
              className="size-[15px] tablet:size-[30px]"
            />
          )}
        </div>
        <img src={item.image} alt={item.title} className="h-[6.389vw] w-[6.389vw] tablet:size-[50px]" />
        <div
          className={`${
            persistedTheme === 'dark' ? 'dark-shadow-input' : ''
          } flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-white-500 dark:border-gray-100 dark:bg-accent-100 tablet:h-[50px] tablet:w-[200px] tablet:rounded-[8px] tablet:border-[3px] laptop:rounded-[15px]`}
        >
          <h1 className="text-gray text-[2.11vw] font-medium leading-normal dark:text-gray-400 tablet:text-[20px]">
            {item.title}
          </h1>
        </div>
        <Button
          variant={
            checkContact(item.type)
              ? checkPrimary(item.type)
                ? 'verification-badge-edit'
                : 'verification-badge-remove'
              : item.ButtonColor
          }
          // color={checkContact(item.type) ? (checkPrimary(item.type) ? 'yellow' : 'red') : item.ButtonColor}
          onClick={() => item.ButtonColor !== 'gray' && handleClickContactBadgeEmail(item.type, item.title, item.image)}
          disabled={checkPrimary(item.type)}
        >
          {checkContact(item.type) ? (checkPrimary(item.type) ? 'Added' : 'Remove Badge') : item.ButtonText}
          <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] tablet:text-[13px]">
            {checkContact(item.type) ? '' : `(+${persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)`}
          </span>
        </Button>
      </div>
    );
  };

  // useEffect(() => {
  //   if (localStorage.getItem('isOtpSent') === 'true') {
  //     const timeout = setTimeout(() => {
  //       localStorage.removeItem('isOtpSent');
  //     }, 10000);

  //     return () => clearTimeout(timeout);
  //   }
  // }, [localStorage.getItem('isOtpSent')]);

  const renderContactBadgesPopup = () => {
    if (!isPopup) {
      return null;
    }

    switch (seletedBadge) {
      case 'personal':
        return (
          <VerificationPopups
            isPopup={isPopup}
            setIsPopup={setIsPopup}
            title="Personal Email"
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Personal-Email-2xa.png`}
            placeholder="Personal email here"
            selectedBadge={seletedBadge}
          />
        );

      case 'work':
        return (
          <VerificationPopups
            isPopup={isPopup}
            setIsPopup={setIsPopup}
            title="Work Email"
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Work-Email-2xa.png`}
            placeholder="Work email here"
            selectedBadge={seletedBadge}
          />
        );

      case 'education':
        return (
          <VerificationPopups
            isPopup={isPopup}
            setIsPopup={setIsPopup}
            title="Education Email"
            logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Education-Email-2xa.png`}
            placeholder="Educational Email here"
            selectedBadge={seletedBadge}
          />
        );

      case 'cell-phone':
        return (
          <>
            <AddCellPhonePopup
              isPopup={isPopup}
              setIsPopup={setIsPopup}
              title="Phone Number"
              logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/cellphone-1.png`}
              selectedBadge={seletedBadge}
              type={'cell-phone'}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <LegacyBadgePopup
        isPopup={isPersonalPopup}
        setIsPopup={setIsPersonalPopup}
        title="Password"
        type={'password'}
        logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/wallet.svg`}
        placeholder="Answer Here"
        fetchUser={fetchUser}
        setIsPersonalPopup={setIsPersonalPopup}
      />
      <h1 className="summary-text">
        Contact badges enhance your verification status and improve your account security, ensuring you have reliable
        options for recovery when needed.
      </h1>
      <div className="flex flex-col items-center justify-between pt-[10px] tablet:pt-[18.73px]">
        {renderContactBadgesPopup()}

        <div className="flex flex-col gap-[5px] tablet:gap-4">
          {contacts.map((item, index) => (
            <ContactItem
              item={item}
              index={index}
              persistedTheme={persistedTheme}
              checkContact={checkContact}
              checkPrimary={checkPrimary}
              handleClickContactBadgeEmail={handleClickContactBadgeEmail}
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
