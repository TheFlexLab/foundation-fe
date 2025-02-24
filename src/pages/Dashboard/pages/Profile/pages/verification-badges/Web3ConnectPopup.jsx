import { useState } from 'react';
import { CanAdd } from './badgeUtils';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { useQueryClient } from '@tanstack/react-query';
import { MetaMaskProvider, useSDK } from '@metamask/sdk-react';
import { Button } from '../../../../../../components/ui/Button';
import api from '../../../../../../services/api/Axios';
import PopUp from '../../../../../../components/ui/PopUp';
import showToast from '../../../../../../components/ui/Toast';
import ProgressBar from '../../../../../../components/ProgressBar';

const Web3Content = ({ type, handleSkip, onboarding, page, handleClose, selectedBadge }) => {
  const { sdk } = useSDK();
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [loading, setIsLoading] = useState(false);

  const checkPseudoBadge = () => persistedUserInfo?.badges?.some((badge) => (badge?.pseudo ? true : false));

  const handleWeb3 = async (accounts) => {
    setIsLoading(true);
    try {
      const payload = {
        web3: {
          ['etherium-wallet']: accounts,
        },
        uuid: persistedUserInfo.uuid,
      };
      if (localStorage.getItem('legacyHash')) {
        payload.infoc = localStorage.getItem('legacyHash');
      }

      const addBadge = await api.post(`/addBadge/web3/add`, payload);
      if (addBadge.status === 200) {
        showToast('success', 'badgeAdded');
        if (onboarding) {
          handleSkip();
          return;
        }
        queryClient.invalidateQueries({ queryKey: ['userInfo', persistedUserInfo.uuid] }, { exact: true });
        setIsLoading(false);
        handleClose();
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      if (!accounts || accounts.length === 0) {
        console.warn('No accounts returned from SDK.');
        return;
      }
      handleWeb3(accounts[0]);
    } catch (err) {
      console.warn('Failed to connect..', err);
    }
  };

  const handleConnect = () => {
    const timeRemaining = CanAdd(persistedUserInfo, type, 'etherium-wallet');
    if (timeRemaining === true || checkPseudoBadge()) {
      connect();
    } else {
      toast.warning(`You need to wait just ${timeRemaining} more days before you can unlock this badge.`);
    }
  };

  return (
    <>
      {page === 'badgeHub' ? (
        <div className="flex flex-col gap-[10px] px-5 py-[15px] tablet:gap-4 tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
          <h1 className="summary-text">Ethereum Wallet:</h1>
          <h1 className="verification_badge_input">{selectedBadge.web3['etherium-wallet']}</h1>
          <div className="flex justify-end">
            <Button variant={'cancel'} onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-[10px] px-5 py-[15px] tablet:gap-4 tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
          <h1 className="summary-text">
            Your verified Ethereum address unlocks deposits and withdrawals to and from your Foundation wallet to your
            wallet on the Base network.
          </h1>
          <div className="flex justify-end">
            <Button variant="submit" className="w-fit" onClick={handleConnect}>
              {loading ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Connect'}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

const Web3ConnectPopup = (props) => {
  const { isPopup, setIsPopup, title, logo, onboarding, handleSkip } = props;

  const handleClose = () => setIsPopup(false);

  return (
    <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
      {onboarding && <ProgressBar handleSkip={handleSkip} />}
      <MetaMaskProvider
        debug={false}
        sdkOptions={{
          checkInstallationImmediately: true,
          dappMetadata: {
            name: 'Foundation',
            url: window.location.href,
          },
        }}
      >
        <Web3Content {...props} handleClose={handleClose} />
      </MetaMaskProvider>{' '}
    </PopUp>
  );
};

export default Web3ConnectPopup;
