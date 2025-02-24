import { toast } from 'sonner';
import { Suspense, useState } from 'react';
import { CanAdd } from './badgeUtils';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../../../../../components/ui/Button';
import { personal } from '../../../../../../constants/varification-badges';
import { setGuestSignUpDialogue } from '../../../../../../features/extras/extrasSlice';
import { getConstantsValues } from '../../../../../../features/constants/constantsSlice';
import { personalBadgeData } from '../../../../../../constants/verification-badges';

export default function Personal({
  badges,
  handleOpenPasswordConfirmation,
  checkLegacyBadge,
  getAskPassword,
  checkPseudoBadge,
}) {
  const dispatch = useDispatch();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedConstants = useSelector(getConstantsValues);
  const [isPersonalPopup, setIsPersonalPopup] = useState(false);
  const [selectedPersonalBadge, setSelectedPersonalBadge] = useState('');
  const [edit, setEdit] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState({});

  const getPersonalBadge = (type) => badges?.find((badge) => badge?.personal?.hasOwnProperty(type)) || null;
  const checkPersonalBadge = (type) => badges?.some((badge) => badge?.personal?.hasOwnProperty(type) || false) || false;

  const handleClickPersonalBadges = async (type, edit) => {
    if (persistedUserInfo?.role === 'guest' || persistedUserInfo?.role === 'visitor') {
      dispatch(setGuestSignUpDialogue(true));
      return;
    } else {
      const timeRemaining = CanAdd(persistedUserInfo, type, 'personal');
      if (timeRemaining === true || checkPseudoBadge()) {
        if ((checkLegacyBadge() && !localStorage.getItem('legacyHash')) || (checkLegacyBadge() && getAskPassword))
          await handleOpenPasswordConfirmation();

        if (edit) {
          setEdit(true);
        } else {
          setEdit(false);
        }
        setIsPersonalPopup(true);
        setSelectedPersonalBadge(type);
        setSelectedBadge(getPersonalBadge(type));
      } else {
        toast.warning(`You need to wait just ${timeRemaining} more days before you can unlock this badge.`);
      }
    }
  };

  return (
    <>
      <h1 className="summary-text">
        The more personal information you provide, the stronger your data profile and the greater your opportunities for
        FDX earnings.
      </h1>
      <div className="flex flex-col items-center justify-between gap-[5px] pt-[10px] tablet:gap-4 tablet:pt-[18.73px]">
        {personal.map((item, index) => (
          <div
            key={index}
            className={`flex items-center justify-center gap-[10px] tablet:justify-start laptop:gap-5 ${item.disabled && 'opacity-60'}`}
          >
            <img src={item.image} alt={item.title} className="size-[6.389vw] tablet:size-[50px]" />
            <div
              className={`${persistedTheme === 'dark' && 'dark-shadow-input'} flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-white-500 dark:border-gray-100 dark:bg-accent-100 tablet:h-[50px] tablet:w-[200px] tablet:rounded-lg tablet:border-[3px] laptop:rounded-[15px]`}
            >
              <h1 className="text-[2.11vw] font-medium leading-normal text-gray dark:text-gray-400 tablet:text-[20px]">
                {item.title}
              </h1>
            </div>
            <Button
              variant={checkPersonalBadge(item.type) ? 'verification-badge-edit' : item.ButtonColor}
              onClick={() => {
                handleClickPersonalBadges(item.type, checkPersonalBadge(item.type) ? true : false);
              }}
              disabled={item.disabled}
            >
              {checkPersonalBadge(item.type) ? 'Edit' : item.ButtonText}
              {!checkPersonalBadge(item.type) && (
                <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] tablet:text-[13px]">
                  (+{persistedConstants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)
                </span>
              )}
            </Button>
          </div>
        ))}
      </div>
      {/* Edit Remove Popup */}

      {isPersonalPopup &&
        selectedPersonalBadge &&
        personalBadgeData[selectedPersonalBadge] &&
        (() => {
          const badgeProps = personalBadgeData[selectedPersonalBadge];
          const BadgeComponent = badgeProps?.component;
          return (
            <Suspense fallback={<div>Loading...</div>}>
              <BadgeComponent
                isPopup={isPersonalPopup}
                setIsPopup={setIsPersonalPopup}
                title={badgeProps.title}
                type={badgeProps.type}
                logo={badgeProps.logo}
                placeholder={badgeProps.placeholder}
                edit={edit}
                setEdit={setEdit}
                setIsPersonalPopup={setIsPersonalPopup}
                selectedBadge={selectedBadge}
              />
            </Suspense>
          );
        })()}
    </>
  );
}
