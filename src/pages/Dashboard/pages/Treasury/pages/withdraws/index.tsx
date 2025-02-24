import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { MetaMaskProvider } from '@metamask/sdk-react';
import WithdrawBalance from './WithdrawBalance';
import WithdrawHistory from './WithdrawHistory';
import Web3 from '../../../Profile/pages/verification-badges/Web3';
import { getAskPassword } from '../../../../../../features/profile/userSettingSlice';

export default function Withdraws() {
  const legacyPromiseRef = useRef<any>();
  const getAskPasswordFromRedux = useSelector(getAskPassword);
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const checkLegacyBadge = () => persistedUserInfo?.badges?.some((badge: any) => (badge?.legacy ? true : false));
  const checkPseudoBadge = () => persistedUserInfo?.badges?.some((badge: any) => (badge?.pseudo ? true : false));
  const [isPasswordConfirmation, setIsPasswordConfirmation] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const checkWeb3Badge = () =>
    persistedUserInfo?.badges?.some((badge: any) => badge?.web3?.hasOwnProperty('etherium-wallet') || false) || false;

  const handleRemoveBadgePopup = async (item: any) => {
    if (
      (checkLegacyBadge() && !localStorage.getItem('legacyHash')) ||
      (checkLegacyBadge() && getAskPasswordFromRedux) ||
      item.type === 'password'
    ) {
      await handleOpenPasswordConfirmation();
    }
    setDeleteModalState(item);
    setModalVisible(true);
  };

  const handleOpenPasswordConfirmation = () => {
    setIsPasswordConfirmation(true);
    return new Promise((resolve) => {
      legacyPromiseRef.current = resolve;
    });
  };

  return (
    <div className="mb-6 h-[calc(100dvh-174px)] overflow-y-auto px-4 no-scrollbar tablet:h-[calc(100dvh-173.63px)] tablet:px-6 laptop:h-[calc(100dvh-96px)]">
      {/* {checkWeb3Badge() ? (
        <div className="flex flex-col gap-3 tablet:gap-6">
          <MetaMaskProvider
            debug={false}
            sdkOptions={{
              checkInstallationImmediately: false,
              dappMetadata: {
                name: 'Foundation',
                url: window.location.href,
              },
            }}
          >
            <WithdrawBalance />
          </MetaMaskProvider>
          <WithdrawHistory />
        </div>
      ) : (
        <div className="flex flex-col gap-2 border-[1.85px] border-[#D9D9D9] bg-[#FDFDFD] dark:border-gray-100 dark:bg-gray-200 tablet:rounded-[10px] tablet:p-5">
          <h1 className="text-[18px] leading-normal text-gray-1 dark:text-gray-300">
            To continue using this wallet, you must <span className="font-semibold">“Add”</span> your{' '}
            <span className="font-semibold">“Ethereum Badge”</span> for secure and verified access. This ensures your
            identity is linked and helps safeguard your assets.
          </h1>
          <MetaMaskProvider
            debug={false}
            sdkOptions={{
              checkInstallationImmediately: false,
              dappMetadata: {
                name: 'Foundation',
                url: window.location.href,
              },
            }}
          >
            <Web3
              isVerificationBadge={false}
              handleRemoveBadgePopup={handleRemoveBadgePopup}
              handleOpenPasswordConfirmation={handleOpenPasswordConfirmation}
              checkLegacyBadge={checkLegacyBadge}
              checkPseudoBadge={checkPseudoBadge}
              getAskPassword={getAskPasswordFromRedux}
            />
          </MetaMaskProvider>
        </div>
      )} */}

      <p className="font-inter dark:text-gray-900 mt-[3.319vh] text-center text-[5.083vw] font-bold text-gray-1 dark:text-gray tablet:text-[4vw] laptop:text-[2.083vw]">
        🚀 Withdrawals will be opening soon!
      </p>
    </div>
  );
}
