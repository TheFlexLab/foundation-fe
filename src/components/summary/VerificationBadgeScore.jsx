import { Button } from '../ui/Button';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { badgesTotalLength } from '../../constants/varification-badges';
import ProgressBar from '../ProgressBar';

export default function VerificationBadgeScore({ isMobile, children }) {
  const navigate = useNavigate();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const location = useLocation();
  const checkPseudoBadge = () => persistedUserInfo?.badges?.some((badge) => (badge?.pseudo ? true : false));

  const progress = Math.floor(
    ((checkPseudoBadge() ? persistedUserInfo?.badges.length - 1 : persistedUserInfo?.badges.length) /
      badgesTotalLength) *
      100
  );

  return (
    <div className={`${isMobile ? 'mx-4 tablet:mx-6' : ''}`}>
      <div
        className={`flex items-center justify-between rounded-t-[10px] border-blue-200 bg-blue-200 px-5 py-[10px] dark:border-x-[1.85px] dark:border-t-[1.85px] dark:border-gray-100 dark:bg-accent-100 ${isMobile ? 'tablet:hidden' : ''}`}
      >
        <div className="flex items-center gap-2">
          {persistedUserInfo?.uuid && persistedUserInfo.role === 'user' ? (
            <div className="relative h-fit w-fit">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/MeBadge.svg`}
                alt={'badge'}
                className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
              />
              <p className="absolute left-1/2 top-[41%] z-50 -translate-x-1/2 -translate-y-1/2 text-[7.3px] font-normal leading-none text-[#7A7016] tablet:top-[40%] tablet:text-[13px]">
                {persistedUserInfo.badges.length}
              </p>
            </div>
          ) : (
            <div className="relative z-50 h-fit w-fit">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/badge.svg`}
                alt={'badge'}
                className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
              />
              <p className="absolute left-1/2 top-[41%] z-50 -translate-x-1/2 -translate-y-1/2 text-[7.3px] font-normal leading-none text-[#F6F6F6] tablet:top-[40%] tablet:text-[13px]">
                {persistedUserInfo.badges.length}
              </p>
            </div>
          )}
          <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">
            Verification Badge Score
          </h1>
        </div>
        <h1 className="text-[14px] font-normal leading-[114%] text-white tablet:text-[18px] tablet:leading-[88%]">
          {persistedUserInfo.badges.length}/{badgesTotalLength}
        </h1>
      </div>
      <div
        className={`border-x-[1.85px] border-b-[1.85px] border-gray-250 bg-[#FDFDFD] px-5 py-[10px] dark:border-gray-100 dark:bg-gray-200 tablet:py-[18.73px] ${isMobile ? 'rounded-[10px]' : 'rounded-b-[10px]'}`}
      >
        <h1 className={`summary-text ${isMobile ? 'tablet:hidden' : ''}`}>
          Enhance your profile by adding verification badges. These badges not only increase your credibility but also
          unlock more earning opportunities within the Foundation community.
        </h1>
        <div className="pt-[10px] tablet:pt-[18.73px]">
          <ProgressBar />
        </div>
        {location.pathname === '/profile' && (
          <div className="flex w-full justify-center">
            <Button variant={'submit'} onClick={() => navigate('/profile/verification-badges')}>
              Add badge
            </Button>
          </div>
        )}
        {location.pathname === '/profile/verification-badges' && isMobile && children}
      </div>
    </div>
  );
}
