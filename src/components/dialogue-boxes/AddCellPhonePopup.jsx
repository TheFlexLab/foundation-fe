import { useState, useRef, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { Button } from '../ui/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resendOtp, sendOtp, verifyOtp } from '../../services/api/badgesApi';
import PopUp from '../ui/PopUp';
import api from '../../services/api/Axios';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import showToast from '../ui/Toast';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { setAskPassword } from '../../features/profile/userSettingSlice';
import ProgressBar from '../ProgressBar';

const AddCellPhonePopup = ({
  isPopup,
  title,
  logo,
  setIsPopup,
  type,
  verification,
  onboarding,
  handleSkip,
  progress,
  selectedBadge,
  page,
}) => {
  const queryClient = useQueryClient();
  const [phone, setPhone] = useState();
  const [otpResp, setOtpResp] = useState();
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const refs = Array.from({ length: 6 }).map(() => useRef());
  const [seconds, setSeconds] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const handleClose = () => {
    setIsPopup(false);
  };

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formattedTime = `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

  useEffect(() => {
    if (page === 'badgeHub') {
      setPhone(selectedBadge?.details?.data);
    }
  }, [page, selectedBadge]);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        if (seconds > 0) {
          setSeconds((prevSeconds) => prevSeconds - 1);
        }
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [seconds, isRunning]);

  const handleChange = (index, e) => {
    const { value } = e.target;
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);
    if (value === '') {
      if (index > 0) {
        refs[index - 1].current.focus();
      }
    } else {
      if (index < 5) {
        refs[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      refs[index - 1].current.focus();
    }
  };

  const { mutateAsync: verifyOtpCode } = useMutation({
    mutationFn: verifyOtp,
    onSuccess: async (response) => {
      showToast('success', 'otpVerified');

      if (verification) {
        dispatch(setAskPassword(false));
        dispatch(addUser(response.data.user));
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        localStorage.setItem('uuid', response.data.user.uuid);
        // handleAddContactBadge();
        navigate('/');
      } else {
        handleAddContactBadge();
      }
    },
    onError: (err) => {
      console.log(err);

      setLoading(false);
      showToast('error', 'error', {}, err.response.data.message.split(':')[1]);
    },
  });

  const { mutateAsync: generateOtp, isPending } = useMutation({
    mutationFn: sendOtp,
    onSuccess: (resp) => {
      setOtpResp(resp);
      localStorage.setItem('phoneNo', resp?.data?.data?.phoneNumber);
      showToast('success', 'otpSent');
      setIsRunning(true);
    },
    onError: (err) => {
      showToast('error', 'error', {}, err.response.data.message.split(':')[1]);
    },
  });

  const { mutateAsync: regenerateOtp } = useMutation({
    mutationFn: resendOtp,
    onSuccess: (resp) => {
      setOtpResp(resp);
      showToast('success', 'otpSent');
      setIsRunning(true);
    },
    onError: (err) => {
      showToast('error', 'error', {}, err.response.data.message.split(':')[1]);
    },
  });

  const handleAddContactBadge = async () => {
    try {
      const payload = {
        uuid: localStorage.getItem('uuid'),
        type: type,
        data: otpResp?.data?.data?.phoneNumber,
      };
      if (localStorage.getItem('legacyHash')) {
        payload.infoc = localStorage.getItem('legacyHash');
      }
      const addBadge = await api.post(`/addBadge/contact`, payload);

      if (addBadge.status === 200) {
        if (!verification) {
          showToast('success', 'badgeAdded');
        }
        setLoading(false);
        if (onboarding) {
          handleSkip();
          return;
        }
        queryClient.invalidateQueries(['userInfo']);
        handleClose();
      }
    } catch (error) {
      console.log(error);
      showToast('error', 'error', {}, err.response.data.message.split(':')[1]);
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
      {!otpResp ? (
        <div className="px-5 py-[15px] tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
          {page !== 'badgeHub' && (
            <h1 className="pb-[15px] text-[12px] font-medium leading-[13.56px] text-gray-1 dark:text-white-400 tablet:pb-[25px] tablet:text-[16px] tablet:leading-normal">
              Ensure you can recover your account easily if needed.
            </h1>
          )}
          <div>
            <p
              htmlFor="email"
              className="text-[9.28px] font-medium leading-[11.23px] text-gray-1 tablet:text-[20px] tablet:leading-[24.2px]"
            >
              {title}
            </p>
            <PhoneInput
              placeholder="Enter phone number"
              value={phone}
              defaultCountry="US"
              className="verification_badge_input mb-[10px] mt-1 tablet:mb-5 tablet:mt-[15px]"
              onChange={setPhone}
              style={{ color: '#707175' }}
              disabled={page === 'badgeHub'}
            />
            <div className="flex justify-end">
              {page === 'badgeHub' ? (
                <div className="flex justify-end gap-[15px] tablet:gap-[35px]">
                  <Button variant={'cancel'} onClick={handleClose}>
                    Close
                  </Button>
                </div>
              ) : (
                <Button
                  variant="submit"
                  disabled={isPending}
                  onClick={() => {
                    generateOtp(phone);
                  }}
                >
                  {isPending ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Send OTP'}
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="pb-[15px] pt-2 tablet:py-[25px]">
          <div className="px-5 tablet:px-[60px] laptop:px-[80px]">
            <h1 className="text-[9.278px] font-medium leading-[9.278px] text-[#707175] tablet:text-[20px] tablet:font-semibold tablet:leading-[20px]">
              OTP Verification
            </h1>
            <p className="my-[10px] text-[9.28px] font-normal leading-[9.28px] text-[#707175] tablet:my-[15px] tablet:text-[18px] tablet:leading-[20px]">
              We will send you a one time password on this{' '}
              <span className="font-semibold">{otpResp?.data?.data?.phoneNumber}</span>
            </p>
            <div className="flex flex-col space-y-16">
              <div className="flex w-full flex-row items-center gap-2 tablet:gap-[15px]">
                {otp.map((digit, index) => (
                  <div key={index} className="size-[26.7px] tablet:size-[57px]">
                    <input
                      ref={refs[index]}
                      className="flex h-full w-full flex-col items-center justify-center rounded-[6px] border border-white-500 bg-[#FBFBFB] text-center text-[14px] outline-none focus:ring-0 tablet:rounded-[15px] tablet:border-[3px] tablet:text-[26px]"
                      type="number"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                    />
                  </div>
                ))}
              </div>
            </div>
            <h1 className="mt-2 text-[9.278px] font-semibold leading-[9.278px] text-[#707175] tablet:text-[20px] tablet:leading-[20px]">
              {formattedTime}
            </h1>
            {seconds === 0 && (
              <p className="my-[6] text-[8px] font-normal leading-[20px] text-[#707175] tablet:my-[15px] tablet:text-[18px]">
                Do not Receive OTP ?{' '}
                <span
                  className="cursor-pointer font-semibold text-[#4A8DBD]"
                  onClick={() => {
                    regenerateOtp(otpResp?.data?.data?.phoneNumber);
                    setSeconds(60);
                    setIsRunning(true);
                  }}
                >
                  Resend OTP
                </span>
              </p>
            )}
            <div className="flex justify-end">
              <Button
                variant="submit"
                disabled={loading}
                onClick={() => {
                  const otpString = otp.join('');
                  if (otpString.length === 6) {
                    if (seconds > 0) {
                      setLoading(true);

                      const params = {
                        phone: otpResp?.data?.data?.phoneNumber,
                        otpString,
                      };
                      if (verification) {
                        params.userUuid = localStorage.getItem('uuid');
                        params.legacyEmail = localStorage.getItem('email');
                      }
                      verifyOtpCode(params);
                    } else {
                      showToast('error', 'otpExpired');
                    }
                  } else {
                    showToast('warning', 'otpEmptyBlock');
                  }
                }}
              >
                {loading ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Submit'}
              </Button>
            </div>
          </div>
        </div>
      )}
      {onboarding && <ProgressBar handleSkip={handleSkip} />}
    </PopUp>
  );
};

export default AddCellPhonePopup;
