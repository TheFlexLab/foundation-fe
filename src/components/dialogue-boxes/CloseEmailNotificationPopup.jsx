import PopUp from '../ui/PopUp';
import { Button } from '../ui/Button';
import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateUserSettings } from '../../services/api/userAuth';
import { useSelector } from 'react-redux';
import showToast from '../ui/Toast';

export default function CloseEmailNotificationPopup({
  handleClose,
  modalVisible,
  title,
  image,
  emailNotifications,
  setEmailNotifications,
}) {
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [loading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const { mutateAsync: handleUserSettings } = useMutation({
    mutationFn: updateUserSettings,
    onSuccess: () => {
      showToast('success', 'emailNotificationClosed');
      queryClient.invalidateQueries(['userInfo']);
      setEmailNotifications(!emailNotifications);
      setIsLoading(false);
      handleClose();
    },
    onError: (error) => {
      console.log(error);
      setIsLoading(false);
      showToast('error', 'error', {}, error.response.data.message);
    },
  });

  return (
    <PopUp logo={image} title={title} open={modalVisible} handleClose={handleClose}>
      <div className="space-y-2 px-[18px] py-[10px] tablet:space-y-[15px] tablet:px-[55px] tablet:py-[25px]">
        <h1 className="text-gray-1 text-[10px] font-medium leading-[12px] dark:text-gray-300 tablet:text-[20px] tablet:leading-[24.2px]">
          Please enter your email address to turn off your email notifications.
        </h1>
        <input
          type="email"
          placeholder="Enter email address"
          required
          onChange={(e) => setEmail(e.target.value)}
          className="verification_badge_input"
        />
        <div className="flex justify-end gap-[15px] tablet:gap-[34px]">
          <Button
            variant={'submit'}
            onClick={() => {
              if (email === '') return showToast('warning', 'emptyEmail');
              setIsLoading(true);
              handleUserSettings({ uuid: persistedUserInfo.uuid, email, emailNotifications: !emailNotifications });
            }}
          >
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
