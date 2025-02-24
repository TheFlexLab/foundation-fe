import { useEffect, useState } from 'react';
import PopUp from '../../../../../../components/ui/PopUp';
import { Button } from '../../../../../../components/ui/Button';
import { FaSpinner } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { AuthKitProvider, SignInButton } from '@farcaster/auth-kit';
import showToast from '../../../../../../components/ui/Toast';
import { useQueryClient } from '@tanstack/react-query';
import '@farcaster/auth-kit/styles.css';
import api from '../../../../../../services/api/Axios';
import ProgressBar from '../../../../../../components/ProgressBar';

const getSummaryText = {
  twitter:
    'Your Twitter account helps to prove you are a real person. This verification helps enhance your value and credibility on the network.',
  linkedin:
    'Your LinkedIn account verifies your professional identity. This connection enhances your value and credibility on the network.',
  facebook: 'Your Facebook account helps verify your identity, enhancing your value and credibility.',
  github:
    'Your GitHub account showcases your coding skills and further verifies your identity, while enhancing your value.',
  farcaster: 'Earn rewards for participating in and sharing posts on Farcaster.',
  youtube: 'Strengthen your presence by adding your YouTube channels to your profile.',
};

const SocialConnectPopup = ({
  isPopup,
  setIsPopup,
  title,
  logo,
  accountName,
  type,
  link,
  handleSkip,
  onboarding,
  progress,
}) => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const queryClient = useQueryClient();

  const handleClose = () => setIsPopup(false);
  const [loading, setLoading] = useState({ state: false, badge: '' });

  const config = {
    rpcUrl: 'https://mainnet.optimism.io',
    domain: 'on.foundation',
    siweUri: 'https://example.com/login',
  };

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

  const triggerFarcaster = () => {
    setIsButtonClicked(true);
    const a = document.querySelector('._1n3pr301');
    a.click();
  };

  const handleConnect = () => {
    if (accountName === 'Farcaster') {
      triggerFarcaster();
      return;
    }
    setLoading({ state: true, badge: accountName });
    localStorage.setItem('target-url', `${window.location.href}`);
    window.location.href = `${import.meta.env.VITE_API_URL}${link}`;
  };

  const handleFarcaster = async (title, type, value) => {
    try {
      const payload = {
        uuid: persistedUserInfo.uuid,
        accountId: value.fid,
        accountName: title,
        isVerified: true,
        type: type,
        data: value,
      };
      if (localStorage.getItem('legacyHash')) {
        payload.eyk = localStorage.getItem('legacyHash');
      }
      const addBadge = await api.post(`/addBadge/addFarCasterBadge/add`, payload);
      setIsButtonClicked(false);
      if (addBadge?.status === 200) {
        showToast('success', 'badgeAdded');
        queryClient.invalidateQueries(['userInfo']);
        handleClose();
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'error', {}, error.response?.data.message.split(':')[1]);
    }
  };

  return (
    <>
      <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
        <AuthKitProvider config={config}>
          <div className="hidden">
            <SignInButton
              onClick={() => console.log('testing clicking....')}
              onSuccess={(data) => {
                isButtonClicked && handleFarcaster('Farcaster', 'farcaster', data);
              }}
            />
          </div>
          <div className="hidden"></div>
        </AuthKitProvider>
        <div className="flex flex-col gap-[10px] px-5 py-[15px] tablet:gap-4 tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
          <h1 className="summary-text">{getSummaryText[type]}</h1>
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
        {onboarding && <ProgressBar handleSkip={handleSkip} />}
      </PopUp>
    </>
  );
};

export default SocialConnectPopup;
