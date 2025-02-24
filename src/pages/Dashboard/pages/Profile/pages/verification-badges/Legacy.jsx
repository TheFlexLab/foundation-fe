import React, { useState } from 'react';
import { legacy } from '../../../../../../constants/varification-badges';
import Button from '../../components/Button';
import LegacyBadgePopup from '../../../../../../components/dialogue-boxes/LegacyBadgePopup';
import { getConstantsValues } from '../../../../../../features/constants/constantsSlice';
import { useSelector } from 'react-redux';

const Legacy = ({ fetchUser, handleRemoveBadgePopup, checkLegacyBadge }) => {
  const [isPersonalPopup, setIsPersonalPopup] = useState(false);
  const persistedContants = useSelector(getConstantsValues);

  checkLegacyBadge();

  return (
    <>
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
      <h1 className="font-Inter text-[9.74px] font-medium text-black dark:text-white tablet:text-[22px] tablet:leading-[18px]">
        Legacy
      </h1>
      <div className="flex flex-col items-center gap-[5px] rounded-[16.068px] border-white-500 bg-[#FDFDFD] tablet:gap-4 tablet:border-[3px] tablet:py-[22px]">
        {legacy.map((item, index) => (
          <div className="relative flex items-center gap-[8.5px] laptop:gap-2 desktop:gap-5" key={index}>
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
            <div
              className={`flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-white-500 tablet:h-[50px] tablet:w-[200px] tablet:rounded-[8px] tablet:border-[3px] laptop:w-[180px] laptop:rounded-[15px] desktop:w-[200px]`}
            >
              <h1 className="text-[2.11vw] font-medium leading-normal text-[#000] dark:text-[#CACACA] tablet:text-[20px]">
                {item.title}
              </h1>
            </div>
            <Button
              color={checkLegacyBadge() ? 'red' : 'blue'}
              disabled={item.disabled}
              onClick={() => {
                checkLegacyBadge()
                  ? handleRemoveBadgePopup({
                      title: 'Password',
                      type: 'password',
                      image: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/wallet.svg`,
                      badgeType: 'password',
                    })
                  : setIsPersonalPopup(true);
              }}
            >
              {checkLegacyBadge() ? 'Remove Badge' : 'Add Badge'}
              <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] tablet:text-[13px]">
                {checkLegacyBadge() ? '' : `(+ ${persistedContants?.ACCOUNT_BADGE_ADDED_AMOUNT} FDX)`}
              </span>
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Legacy;
