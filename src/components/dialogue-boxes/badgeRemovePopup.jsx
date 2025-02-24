import PopUp from '../ui/PopUp';
import { Button } from '../ui/Button';
import api from '../../services/api/Axios';
import { FaSpinner } from 'react-icons/fa';
import { useQueryClient } from '@tanstack/react-query';
import showToast from '../ui/Toast';
import { useSelector } from 'react-redux';

export default function BadgeRemovePopup({
  handleClose,
  modalVisible,
  title,
  image,
  accountName,
  type,
  badgeType,
  setIsPersonalPopup,
  setIsLoading,
  loading,
}) {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const queryClient = useQueryClient();

  const handleRemoveBadge = async () => {
    setIsLoading(true);
    try {
      let removeBadge;
      if (badgeType === 'contact') {
        removeBadge = await api.post(`/removeContactBadge`, {
          type: type,
          uuid: persistedUserInfo.uuid,
          badgeName: type,
        });
      } else if (badgeType === 'personal' || badgeType === 'identity') {
        if (persistedUserInfo?.isPasswordEncryption) {
          removeBadge = await api.post(`/removePersonalBadge`, {
            type: type,
            uuid: persistedUserInfo.uuid,
            badgeName: type,
            infoc: localStorage.getItem('legacyHash')
          });
        } else {
          removeBadge = await api.post(`/removePersonalBadge`, {
            type: type,
            uuid: persistedUserInfo.uuid,
            badgeName: type,
          });
        }
      } else if (badgeType === 'web3') {
        removeBadge = await api.post(`/removeWeb3Badge`, {
          type: type,
          uuid: persistedUserInfo.uuid,
          badgeName: type,
        });
      } else if (type === 'password') {
        removeBadge = await api.post('/addPasswordBadgesUpdate', {
          uuid: persistedUserInfo.uuid,
          eyk: localStorage.getItem('legacyHash'),
          badgeName: type,
        });
      } else if (type === 'pseudo') {
        removeBadge = await api.post('/removePseudoBadge', {
          uuid: persistedUserInfo.uuid,
          badgeName: type,
        });
      } else if (badgeType === 'passkey') {
        removeBadge = await api.post(`/removePasskey`, {
          type: type,
          accountName: accountName,
          uuid: persistedUserInfo.uuid,
          badgeName: type,
        });
      } else if (badgeType === 'farcaster') {
        removeBadge = await api.post(`/removeFarCasterBadge`, {
          type: type,
          accountName: accountName,
          uuid: persistedUserInfo.uuid,
          badgeName: type,
        });
      } else if (badgeType === 'finance') {
        removeBadge = await api.post(`/removeFinance`, {
          type: type,
          uuid: persistedUserInfo.uuid,
        });
      } else if (badgeType === 'homepage') {
        removeBadge = await api.post(`/removeDomainBadge`, {
          type: type,
          uuid: persistedUserInfo.uuid,
        });
      } else {
        const findBadge = persistedUserInfo.badges.filter((item) => {
          if (item.accountName === accountName) {
            return item;
          }
        });

        removeBadge = await api.post(`/removeBadge`, {
          badgeAccountId: findBadge[0].accountId,
          uuid: persistedUserInfo.uuid,
          badgeName: type,
        });
      }

      if (removeBadge.status === 200) {
        if (type === 'password') {
          localStorage.removeItem('legacyHash');
        }
        showToast('success', 'badgeRemoval');
        queryClient.invalidateQueries(['userInfo']);
        {
          (badgeType === 'personal' || badgeType === 'homepage') && setIsPersonalPopup(false);
        }
        setIsLoading(false);
        handleClose();
      }
    } catch (error) {
      setIsLoading(false);
      console.log('error', error);
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
    }
  };

  return (
    <PopUp logo={image} title={title} open={modalVisible} handleClose={handleClose} remove={true}>
      <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
        <h1 className="text-[10px] font-medium leading-[12px] text-gray-1 dark:text-gray-300 tablet:text-[20px] tablet:leading-[24.2px]">
          Are you sure you want to remove this badge? If you remove this badge, you will not be able to add it again for
          30 days.
        </h1>
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
          <Button variant={'submit'} onClick={handleRemoveBadge}>
            {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Yes'}
          </Button>
          <Button variant={'cancel'} onClick={handleClose}>
            No
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
