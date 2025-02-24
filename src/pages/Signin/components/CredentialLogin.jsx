import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../../components/Input';
import ReCAPTCHA from 'react-google-recaptcha';
import { FaSpinner } from 'react-icons/fa';
import { useMutation } from '@tanstack/react-query';
import { signIn } from '../../../services/api/userAuth';
import { Link, useNavigate } from 'react-router-dom';
import { addUser } from '../../../features/auth/authSlice';
import LegacyConfirmationPopup from '../../../components/dialogue-boxes/LegacyConfirmationPopup';
import showToast from '../../../components/ui/Toast';
import { Button } from '../../../components/ui/Button';
import { setCredentialLogin, setGuestSignInDialogue } from '../../../features/extras/extrasSlice';

const CredentialLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPassword ? 'text' : 'password';
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [capthaToken, setCaptchaToken] = useState('');
  const [uuid, setUuid] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const [isPasswordConfirmation, setIsPasswordConfirmation] = useState();
  const legacyPromiseRef = useRef();

  const onPassChange = (e) => {
    setPassword(e.target.value);
  };

  const handleCancel = () => {
    setEmail('');
  };

  const { mutateAsync: userSignin, isPending } = useMutation({
    mutationFn: signIn,
  });

  const handleSignin = async () => {
    setIsLoading(true);
    try {
      // const recaptchaResp = await axios({
      //   url: `https://www.google.com/recaptcha/api/siteverify?secret=${
      //     import.meta.env.VITE_GOOGLE_RECAPTCH_SECRET_KEY
      //   }&response=${capthaToken}`,
      //   method: 'POST',
      // });

      // if (recaptchaResp.success) {
      // if (capthaToken !== '') {
      if (capthaToken === '') {
        const resp = await userSignin({ email, password });
        if (resp.status === 200) {
          // console.log(resp);
          // console.log(resp.data.isLegacyEmailContactVerified, email.includes('@gmail.com'));

          if (resp.data.message?.includes('Sent a verification email')) {
            showToast('success', 'verificationEmailSent');

            setEmail('');
            setPassword('');
            setIsLoading(false);
            return;
          }

          // NOT TO BE REMOVE
          // if (!resp.data.isLegacyEmailContactVerified && !email.includes('@gmail.com')) {
          //   localStorage.setItem('uuid', resp.data.uuid);
          //   localStorage.setItem('email', resp.data.email);
          //   navigate('/verify-phone');
          //   return;
          // }
          if (resp.data.isPasswordEncryption) {
            setIsLoading(false);
            setUuid(resp.data.uuid);
            await handleOpenPasswordConfirmation();
          } else {
            localStorage.removeItem('isGuestMode');
            setEmail('');
            setPassword('');
            localStorage.setItem('userData', JSON.stringify(resp.data));
            localStorage.setItem('uuid', resp.data.uuid);
            dispatch(addUser(resp.data));

            if (localStorage.getItem('shared-post') !== '' && localStorage.getItem('shared-post') !== null) {
              navigate(localStorage.getItem('shared-post'));
              localStorage.removeItem('shared-post');
            } else {
              navigate('/');
            }
          }
        }
      } else {
        showToast('warning', 'recaptaFailed');
      }
    } catch (e) {
      console.log(e);
      if (e.response.data === 'Wrong Password') {
        showToast('error', 'incorrectTypedPassword');
        setIsLoading(false);
      } else if (
        e.response.data.message === 'An error occurred while signInUser Auth: data and hash arguments required'
      ) {
        showToast('error', 'incorrectTypedPassword');
        setIsLoading(false);
      } else if (e.response.data.message === 'An error occurred while signInUser Auth: User not Found') {
        showToast('error', 'userNotFound');
        setIsLoading(false);
      } else {
        showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
        setIsLoading(false);
      }
    } finally {
      // setIsLoading(false);
      dispatch(setCredentialLogin(false));
      dispatch(setGuestSignInDialogue(false));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  function onChange(value) {
    console.log('Captcha value:', value);
    setCaptchaToken(value);
  }

  const handleOpenPasswordConfirmation = () => {
    setIsPasswordConfirmation(true);
    return new Promise((resolve) => {
      legacyPromiseRef.current = resolve;
    });
  };

  return (
    <div className="py-12">
      <LegacyConfirmationPopup
        isPopup={isPasswordConfirmation}
        setIsPopup={setIsPasswordConfirmation}
        title="Confirm Password"
        type={'password'}
        logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/wallet.svg`}
        legacyPromiseRef={legacyPromiseRef}
        login={true}
        uuid={uuid}
      />
      {isPending ? (
        <div className="my-5 flex flex-col items-center justify-center gap-4 tablet:my-10">
          <FaSpinner className="animate-spin text-[8vw] text-blue-200 tablet:text-[4vw]" />
        </div>
      ) : (
        <>
          <form className="text-gray mx-auto flex w-full max-w-[260px] flex-col gap-8 bg-white tablet:max-w-[512px] tablet:gap-11 5xl:gap-14 short:gap-[38px]">
            <div className="relative grid w-full grid-cols-[1fr] items-center">
              <Input
                type="email"
                id="email"
                label="Email Address"
                className="autofill_text_color peer w-full rounded-[2px] border-b-[1.4px] border-[#C0C0C0] bg-white py-1 pr-8 text-[12px] transition-colors focus:border-b-[1.4px] focus:border-[#C0C0C0] focus:outline-none dark:border-white dark:bg-transparent dark:text-white dark:focus:border-white md:text-[22.9px] short:py-0 taller:text-[16px]"
                autoComplete="sign-email"
                onChange={onEmailChange}
                value={email}
              />
              {email ? (
                persistedTheme === 'dark' ? (
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/cancelDark.svg`}
                    alt="blind"
                    className="absolute right-2 h-[17px] w-[17px] cursor-pointer 2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                    onClick={handleCancel}
                  />
                ) : (
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/cancelLight.svg`}
                    alt="blind"
                    className="absolute right-2 h-[17px] w-[17px] cursor-pointer 2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                    onClick={handleCancel}
                  />
                )
              ) : null}
            </div>
            <div className="relative grid w-full grid-cols-[1fr] items-center">
              <Input
                type={inputType}
                id="password"
                label="Password"
                className="autofill_text_color peer w-full rounded-[2px] border-b-[1.4px] border-[#C0C0C0] bg-white py-1 pr-8 text-[12px] transition-colors focus:border-b-[1.4px] focus:border-[#C0C0C0] focus:outline-none dark:border-white dark:bg-transparent dark:text-white dark:focus:border-white md:text-[22.9px] short:py-0 taller:text-[16px]"
                autoComplete="new-password"
                onChange={onPassChange}
              />
              {!showPassword ? (
                persistedTheme === 'dark' ? (
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/blind.svg`}
                    alt="blind"
                    className="absolute right-2 h-[17px] w-[17px] cursor-pointer 2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eye-white.svg`}
                    alt="blind"
                    className="absolute right-2 h-[17px] w-[17px] cursor-pointer 2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                    onClick={togglePasswordVisibility}
                  />
                )
              ) : persistedTheme === 'dark' ? (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eye.svg`}
                  alt="blind"
                  className="absolute right-2 h-[17px] w-[17px] cursor-pointer 2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eyeLight.svg`}
                  alt="blind"
                  className="absolute right-2 h-[17px] w-[17px] cursor-pointer 2xl:h-[24px] 2xl:w-[24px] 3xl:h-[30px] 3xl:w-[30px]"
                  onClick={togglePasswordVisibility}
                />
              )}
            </div>
            <Link className="text-light-blue cursor-pointer text-[8.158px] font-normal leading-[8.158px] dark:text-white md:text-[16px] tablet:leading-[22px] short:text-[12px]">
              Forgot Password?
            </Link>
            {/* <div className="mb-4 mt-4 w-full items-start md:mb-10 laptop:mb-[5.5rem] laptop:mt-[2.5rem] taller:mb-[30px] taller:mt-[35px]">
        {persistedTheme === 'dark' ? (
          <ReCAPTCHA sitekey={import.meta.env.VITE_GOOGLE_RECAPTCH_SITE_KEY} onChange={onChange} theme="dark" />
        ) : (
          <ReCAPTCHA sitekey={import.meta.env.VITE_GOOGLE_RECAPTCH_SITE_KEY} onChange={onChange} theme="light" />
        )}
      </div> */}
            <Button
              variant="submit"
              onClick={() => {
                handleSignin();
              }}
              disabled={(isLoading === true ? true : false) || !email || !password}
            >
              {isLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Sign in'}
            </Button>
          </form>
          <div className="mt-8 flex justify-center gap-3">
            <button
              className="text-[11.21px] font-[500] text-blue-200 tablet:text-[20px] laptop:text-[22px]"
              onClick={() => {
                dispatch(setCredentialLogin(false));
              }}
            >
              Go Back
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CredentialLogin;
