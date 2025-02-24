import { useState } from 'react';
import { Button } from './ui/Button';
import { signUpGuest } from '../services/api/userAuth';
import { useMutation } from '@tanstack/react-query';
import { referral } from '../services/api/authentication';
import { FaSpinner } from 'react-icons/fa';
import showToast from './ui/Toast';

const ReferralCode = ({
  handleClose,
  isLoading,
  setIsLoading,
  password,
  reTypePassword,
  email,
  setEmail,
  setPassword,
  referralCode,
  setReferralCode,
  handlePopupOpen,
  setErrorMessage,
  triggerLogin,
  credential,
}) => {
  const [refLoading, setRefLoading] = useState(false);

  const handleInputChange = (e) => setReferralCode(e.target.value);

  const { mutateAsync: guestSignup } = useMutation({
    mutationFn: signUpGuest,
  });

  const handleGuestSignup = async () => {
    setIsLoading(true);

    try {
      if (password === reTypePassword) {
        const resp = await guestSignup({ email, password, uuid: localStorage.getItem('uuid') });
        if (resp.status === 200) {
          showToast('success', 'verificationEmailSent');

          setEmail('');
          setPassword('');
          setIsLoading(false);
        }
      } else {
        showToast('error', 'passwordMismatched');
        setIsLoading(false);
      }
    } catch (e) {
      setErrorMessage(e.response.data.message.split(':')[1]);
      console.log(
        e.response.data.message.split(':')[1],
        e.response.data.message.split(':')[1] === 'Email Already Exists'
      );
      if (
        e.response.data.message.split(':')[1].trim() === 'Email Already Exists' ||
        e.response.data.message.split(':')[1].includes('We have detected that this is a Google hosted e-mail')
      ) {
        handlePopupOpen();
      }
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const { mutateAsync: handleReferral } = useMutation({
    mutationFn: referral,
    onSuccess: () => {
      setIsLoading(false);
      showToast('success', 'referalVerified');
      setRefLoading(false);
      setEmail('');
      setPassword('');
      handleClose();
      if (!credential) {
        triggerLogin();
      } else {
        handleGuestSignup();
      }
    },
    onError: (err) => {
      console.log(err);
      setRefLoading(false);
      showToast('error', 'referalInvalid');
    },
  });

  return (
    <div className="relative w-[90vw] laptop:w-[52.6rem]">
      <div className="social-blue-gradiant relative flex items-center gap-[10px] rounded-t-[9.251px] px-[15px] py-1 dark:bg-gradient-to-tr dark:from-accent-100 dark:to-accent-100 tablet:gap-4 tablet:rounded-t-[26px] tablet:px-[30px] tablet:py-[8px]">
        <div className="w-fit rounded-full bg-white px-[6px] py-[8px] tablet:p-[15px]">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/referralicon.svg`}
            className="h-[9px] w-[13px] tablet:h-[19px] tablet:w-[19px]"
          />
        </div>
        <p className="text-[12px] font-bold text-white tablet:text-[20px] tablet:font-medium">Referral Code</p>
        <div
          className="absolute right-[12px] top-1/2 -translate-y-1/2 cursor-pointer tablet:right-[26px]"
          onClick={handleClose}
        >
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/preferences/close.png`}
            alt="close"
            className="h-[10px] w-[10px] cursor-pointer tablet:h-[22.7px] tablet:w-[22px]"
          />
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setRefLoading(true);
          const data = { code: referralCode.trim() };
          handleReferral(data);
        }}
        className="px-5 py-[14px] dark:bg-gray-200 tablet:px-[50px] tablet:py-[25px]"
      >
        <h2 className="text-[9px] font-normal leading-none tracking-[0.15px] text-[#828282] dark:text-gray-300 tablet:text-[20px] tablet:leading-6">
          Enter your registration code for completing registration process.
        </h2>
        <h1 className="text-gray-1 mt-1 text-[12px] font-medium leading-normal dark:text-gray-300 tablet:mb-7 tablet:mt-5 tablet:text-[25px]">
          Referral Code
        </h1>
        <input
          type="text"
          placeholder="Enter referral code"
          value={referralCode}
          onChange={handleInputChange}
          className="hide_number_input_arrows hide_number_input_arrows2 autofill_text_color dark:bg-dark peer w-full rounded-[2px] border-b-[1.4px] border-[#C0C0C0] bg-transparent pr-8 text-[10px] transition-colors focus:border-b-[1.4px] focus:border-[#C0C0C0] focus:outline-none dark:border-white dark:text-gray-300 dark:focus:border-white tablet:text-[22.9px] short:py-0"
        />
        <div className="mt-2 flex w-full justify-end tablet:mt-[25px]">
          <Button variant="submit" type="submit">
            {refLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Continue'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReferralCode;
