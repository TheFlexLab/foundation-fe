import { toast } from 'sonner';
import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { LoginSocialGoogle } from 'reactjs-social-login';
import { Button } from '../../../../../components/ui/Button';
import api from '../../../../../services/api/Axios';
import PopUp from '../../../../../components/ui/PopUp';
import { useQueryClient } from '@tanstack/react-query';
import showToast from '../../../../../components/ui/Toast';
import { isWebview } from '../../../../../utils/helper';
import ProgressBar from '../../../../../components/ProgressBar';

const VerificationPopups = ({
  isPopup,
  setIsPopup,
  title,
  logo,
  placeholder,
  selectedBadge,
  onboarding,
  handleSkip,
  progress,
  page,
}) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleClose = () => {
    setIsPopup(false);
  };

  // Handle Add Contact Badge
  const handleAddContactBadge = async ({ provider, data, legacy }) => {
    setLoading(true);
    try {
      let addBadge;
      if (legacy) {
        if (email === '') return showToast('warning', 'emptyEmail');
        addBadge = await api.post(`/addBadge/contact`, {
          legacy,
          email,
          uuid: localStorage.getItem('uuid'),
          type: selectedBadge,
        });
      } else {
        data['provider'] = provider;
        data['type'] = selectedBadge;
        data['uuid'] = localStorage.getItem('uuid');
        if (localStorage.getItem('legacyHash')) {
          data['infoc'] = localStorage.getItem('legacyHash');
        }
        addBadge = await api.post(`/addBadge/contact`, {
          ...data,
        });
      }
      if (addBadge.status === 200) {
        showToast('success', 'badgeAdded');
        if (onboarding) {
          handleSkip();
          return;
        }
        queryClient.invalidateQueries(['userInfo']);
        handleClose();
        setEmail('');
      }
      if (addBadge.status === 201) {
        showToast('success', 'verifyEmail');
        if (onboarding) {
          handleSkip();
          return;
        }
        queryClient.invalidateQueries(['userInfo']);
        handleClose();
        setEmail('');
      }
    } catch (error) {
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
      handleClose();
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
      {page === 'badgeHub' ? (
        <div className="px-5 py-[15px] tablet:px-[60px] tablet:pb-5 tablet:pt-[30px] laptop:px-[80px]">
          <h1 className="summary-text verification_badge_input mb-[10px] tablet:mb-5">
            {selectedBadge?.details?.emails[0]?.value}
          </h1>
          <div className="flex justify-end gap-[15px] tablet:gap-[35px]">
            <Button variant={'cancel'} onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      ) : (
        <div className="px-5 py-[15px] tablet:px-[60px] tablet:pb-5 tablet:pt-[30px] laptop:px-[80px]">
          <h1 className="summary-text mb-[10px] tablet:mb-5">
            {title === 'Work Email'
              ? 'Your professional identity is more credible with a work email.'
              : 'Your education email strengthens your academic credentials.'}
          </h1>
          {!isWebview() && (
            <div className="flex w-full justify-center">
              <Button
                variant="social-btn"
                onClick={() => {
                  localStorage.setItem('selectedBadge', selectedBadge);
                  localStorage.setItem('target-url', `${window.location.href}`);
                  window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
                }}
                className={'dark:bg-accent-100'}
              >
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/google.svg`}
                  className="mr-2 h-[22px] w-[22px] md:h-12 md:w-[32px]"
                />
                Continue with Google
              </Button>
            </div>
          )}

          <div>
            {!isWebview() && (
              <h1 className="my-2 text-center text-[10px] font-medium leading-[12.1px] text-[#707175] tablet:my-[15px] tablet:text-[25px] tablet:leading-[30px]">
                -OR-
              </h1>
            )}
            <p
              htmlFor="email"
              className="text-[9.28px] font-medium leading-[11.23px] text-gray-1 tablet:text-[20px] tablet:leading-[24.2px]"
            >
              {title}
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className="verification_badge_input mb-[10px] mt-1 tablet:mb-5 tablet:mt-[15px]"
            />
            <div className="flex justify-end" onClick={() => handleAddContactBadge({ legacy: true })}>
              <Button variant="submit" disabled={loading}>
                {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Verify Email'}
              </Button>
            </div>
          </div>
        </div>
      )}
      {onboarding && <ProgressBar handleSkip={handleSkip} />}
    </PopUp>
  );
};

export default VerificationPopups;
