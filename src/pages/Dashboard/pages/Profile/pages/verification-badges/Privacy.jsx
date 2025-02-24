import { useSelector } from 'react-redux';
import { Button } from '../../../../../../components/ui/Button';
import { useState } from 'react';
import { toast } from 'sonner';
import { CanAdd } from './badgeUtils';
import { FaSpinner } from 'react-icons/fa';
import { useQueryClient } from '@tanstack/react-query';
import { pseudo, legacy } from '../../../../../../constants/varification-badges';
import { getConstantsValues } from '../../../../../../features/constants/constantsSlice';
import LegacyBadgePopup from '../../../../../../components/dialogue-boxes/LegacyBadgePopup';
import showToast from '../../../../../../components/ui/Toast';
import api from '../../../../../../services/api/Axios';

export const allowedUsers = [
  'malikhamza1619619@gmail.com',
  'mmahad913@gmail.com',
  'dmh1974@gmail.com',
  'wamiqakram@gmail.com',
  'justinleffew@gmail.com',
  'saba01chaudhary@gmail.com',
  'k201857@nu.edu.pk',
  'techflow805@gmail.com',
];

const Privacy = ({ checkLegacyBadge, checkPseudoBadge, handleRemoveBadgePopup }) => {
  const persistedContants = useSelector(getConstantsValues);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [isPersonalPopup, setIsPersonalPopup] = useState(false);
  const [pseudoLoading, setPseudoLoading] = useState(false);
  const queryClient = useQueryClient();

  const addPseudoBadge = async () => {
    setPseudoLoading(true);

    try {
      const resp = await api.post('/addPseudoBadge', {
        uuid: localStorage.getItem('uuid'),
      });
      if (resp.status === 200) {
        showToast('success', 'badgeAdded');
        queryClient.invalidateQueries(['userInfo']);
        setPseudoLoading(false);
      }
    } catch (err) {
      console.log(err);
      setPseudoLoading(false);
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
        fetchUser={persistedUserInfo}
        setIsPersonalPopup={setIsPersonalPopup}
      />
      <h1 className="summary-text">
        Enhance your data security to ensure that only you have access to your personal information.
      </h1>
      <div className="flex flex-col items-center justify-between pt-[10px] tablet:pt-[18.73px]">
        <div className="flex flex-col gap-[5px] tablet:gap-4">
          {legacy.map((item, index) => (
            <div
              className="relative flex items-center justify-center gap-[10px] tablet:justify-start laptop:gap-5"
              key={index}
            >
              <div className="absolute -left-5 tablet:-left-[42px] laptop:-left-[33px] desktop:-left-[42px]">
                {checkLegacyBadge() && (
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/secondary.svg`}
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
                variant={checkLegacyBadge() ? 'verification-badge-remove' : 'submit'}
                // color={checkLegacyBadge() ? 'red' : 'blue'}
                disabled={item.disabled}
                onClick={() => {
                  if (checkLegacyBadge()) {
                    handleRemoveBadgePopup({
                      title: 'Password',
                      type: 'password',
                      image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/wallet.svg`,
                      badgeType: 'password',
                    });
                  } else {
                    const timeRemaining = CanAdd(persistedUserInfo, 'password', 'password');
                    if (timeRemaining === true || checkPseudoBadge()) {
                      setIsPersonalPopup(true);
                    } else {
                      toast.warning(
                        `You need to wait just ${timeRemaining} more days before you can unlock this badge.`
                      );
                    }
                  }
                }}
              >
                {checkLegacyBadge() ? 'Remove Badge' : 'Add Badge'}
                <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] tablet:text-[13px]">
                  {checkLegacyBadge() ? '' : `(+${persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)`}
                </span>
              </Button>
            </div>
          ))}
          {allowedUsers.includes(persistedUserInfo.email) &&
            pseudo.map((item, index) => (
              <div
                className="relative flex items-center justify-center gap-[10px] tablet:justify-start laptop:gap-5"
                key={index}
              >
                <div className="absolute -left-5 tablet:-left-[42px] laptop:-left-[33px] desktop:-left-[42px]"></div>
                <img src={item.image} alt={item.title} className="h-[6.389vw] w-[6.389vw] tablet:size-[50px]" />
                <div className="flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-white-500 dark:border-gray-100 dark:bg-accent-100 tablet:h-[50px] tablet:w-[200px] tablet:rounded-[8px] tablet:border-[3px] laptop:rounded-[15px]">
                  <h1 className="text-[2.11vw] font-medium leading-normal text-[#000] dark:text-gray-400 tablet:text-[20px]">
                    {item.title}
                  </h1>
                </div>
                <Button
                  variant={checkPseudoBadge() ? 'verification-badge-remove' : 'submit'}
                  disabled={item.disabled}
                  className="w-full max-w-[103px] tablet:max-w-[207px]"
                  onClick={() => {
                    if (checkPseudoBadge()) {
                      handleRemoveBadgePopup({
                        title: 'Pseudo',
                        type: 'pseudo',
                        image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/pseudo.svg`,
                        badgeType: 'pseudo',
                      });
                    } else {
                      addPseudoBadge();
                    }
                  }}
                >
                  {pseudoLoading ? (
                    <FaSpinner className="animate-spin text-[#EAEAEA]" />
                  ) : checkPseudoBadge() ? (
                    'Remove Badge'
                  ) : (
                    'Add Badge'
                  )}
                </Button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Privacy;
