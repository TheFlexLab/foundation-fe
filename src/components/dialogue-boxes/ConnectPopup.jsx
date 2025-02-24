import { useEffect, useState } from 'react';
import PopUp from '../ui/PopUp';
import { Button } from '../ui/Button';
import { FaSpinner } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const ConnectPopup = ({
  isPopup,
  setIsPopup,
  title,
  logo,
  accountName,
  // handleSkip,
  // onboarding,
  // progress,
  summaryText,
  handleConnect,
  selectedBadge,
  page,
}) => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const stripeBadge = persistedUserInfo?.badges?.find((badge) => badge.type === 'stripe');

  const handleClose = () => setIsPopup(false);
  const [loading, setLoading] = useState({ state: false, badge: '' });

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Tab became visible
        if (loading.state) {
          // If loading state was true, clear it
          setLoading({ state: false, badge: '' });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loading.state]);

  return (
    <>
      <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
        {page === 'badgeHub' ? (
          <div className="flex flex-col gap-[10px] px-5 py-[15px] tablet:gap-4 tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
            <h1>Stripe QR Code</h1>
            <div className="flex flex-col items-center justify-center">
              {stripeBadge.data?.qrCode ? (
                <img src={stripeBadge.data.qrCode} alt="Stripe QR Code" className="size-[150px] tablet:size-[200px]" />
              ) : (
                <p>QR Code not available</p>
              )}
              <a
                href={stripeBadge.data.url}
                target="_blank"
                className="bg-stripe w-fit rounded-md px-4 py-2 text-xs text-white tablet:text-base"
              >
                Pay now
              </a>
            </div>
            <div className="flex justify-end">
              <Button variant={'cancel'} onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-[10px] px-5 py-[15px] tablet:gap-4 tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
            <h1 className="summary-text">{summaryText}</h1>
            <div className="flex justify-end">
              <Button variant="submit" className="w-fit" onClick={handleConnect}>
                {loading.state === true && loading.badge === accountName ? (
                  <FaSpinner className="animate-spin text-[#EAEAEA]" />
                ) : (
                  'Connect'
                )}
              </Button>
            </div>
          </div>
        )}
        {/* {onboarding && <ProgressBar handleSkip={handleSkip} />} */}
      </PopUp>
    </>
  );
};

export default ConnectPopup;
