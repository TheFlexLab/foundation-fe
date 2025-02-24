import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { referralModalStyle } from '../../constants/styles';
import showToast from '../../components/ui/Toast';
import SocialLogins from '../../components/SocialLogins';
import MyModal from './components/Modal';
import api from '../../services/api/Axios';
import BasicModal from '../../components/BasicModal';
import ReferralCode from '../../components/ReferralCode';
import { setGuestSignInDialogue } from '../../features/extras/extrasSlice';
import { FaSpinner } from 'react-icons/fa';
// const isWebview = () => {
//   const userAgent = window.navigator.userAgent.toLowerCase();

//   // Common webview identifiers or patterns
//   const webviewIdentifiers = [
//     'wv', // Common abbreviation for webview
//     'webview', // Webview identifier
//     'fbav', // Facebook App WebView
//     'instagram', // Instagram WebView
//     'twitter', // Twitter WebView
//   ];

//   // Check if any of the webview identifiers exist in the userAgent string
//   return webviewIdentifiers.some((identifier) => userAgent.includes(identifier));
// };

export default function Signup({ allowSignUp }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reTypePassword, setReTypePassword] = useState('');
  const [profile, setProfile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [resData, setResData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [isReferral, setIsReferral] = useState(false);
  const [isPopup, setIspopup] = useState(false);
  const [socialAccount, setSocialAccount] = useState({ isSocial: false, data: null });
  const [clickedButtonName, setClickedButtonName] = useState('');
  const persistedTheme = useSelector((state) => state.utils.theme);
  const text = useSelector((state) => state.extras.text);

  const handlePopupOpen = () => {
    // setIspopup(true);
  };
  // const handlePopupClose = () => setIspopup(false);

  const handleReferralOpen = (provider) => {
    // if (isWebview(window.navigator.userAgent)) {
    //   if (provider === 'google') {
    //     showToast('info', 'webViewSignUp');
    //   } else {
    //     setIsReferral(true);
    //   }
    // } else {
    // setIsReferral(true);
    // }
    triggerLogin(provider);
  };
  const handleReferralClose = () => {
    setIsReferral(false);
    setIsLoading(false);
  };

  const triggerLogin = async (clickedButtonName) => {
    if (clickedButtonName === 'google') {
      // if (isWebview(window.navigator.userAgent)) {
      //   showToast('info', 'webViewSignUp');
      // } else {
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
      // }
    }

    if (clickedButtonName === 'linkedin') {
      // if (isWebview(window.navigator.userAgent)) {
      //   showToast('info', 'webViewSignUp');
      // } else {
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/linkedin`;
      // }
    }

    if (clickedButtonName === 'github') {
      // if (isWebview(window.navigator.userAgent)) {
      //   showToast('info', 'webViewSignUp');
      // } else {
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
      // }
    }

    if (clickedButtonName === 'facebook') {
      // if (isWebview(window.navigator.userAgent)) {
      //   showToast('info', 'webViewSignUp');
      // } else {
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/facebook`;
      // }
    }

    if (clickedButtonName === 'twitter') {
      // if (isWebview(window.navigator.userAgent)) {
      //   showToast('info', 'webViewSignUp');
      // } else {
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/twitter`;
      // }
    }
  };

  const handleEmailType = async (value) => {
    try {
      if (!value) return showToast('warning', 'emailType');
      setModalVisible(false);
      const res = await api.patch(`/updateBadge/${resData.userId}/${resData.badgeId}`, {
        type: value,
        primary: true,
      });
      if (res.status === 200) {
        localStorage.setItem('uuid', res.data.uuid);
        localStorage.setItem('userLoggedIn', res.data.uuid);
        localStorage.removeItem('isGuestMode');
        localStorage.setItem('jwt', res.data.token);
        navigate('/');
      }
    } catch (error) {
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
    }
  };

  return (
    <div className="flex w-full flex-col rounded-b-[9.76px] bg-white text-white dark:bg-black lg:flex-row tablet:rounded-b-[26px]">
      <MyModal modalShow={modalVisible} email={profile?.email} handleEmailType={handleEmailType} />
      <div className="dark:bg-dark flex w-full flex-col items-center rounded-b-[9.76px] bg-white py-4 dark:bg-gray-200 md:justify-center tablet:rounded-b-[26px] tablet:py-7">
        <p className="dark:text-gray px-4 text-center text-[11.21px] font-[500] text-gray-100 dark:text-gray-300 tablet:text-[20px] laptop:text-[22px]">
          {text}
        </p>
        {/* {isLoadingSocial ? (
          <div className="my-5 flex flex-col items-center justify-center gap-4 tablet:my-10">
            <FaSpinner className="animate-spin text-[8vw] text-blue-200 tablet:text-[4vw]" />
          </div>
        ) : ( */}
        <SocialLogins handleReferralOpen={handleReferralOpen} setClickedButtonName={setClickedButtonName} />
        {/* )} */}
        <div className="flex gap-3">
          <p className="dark:text-gray text-[11.21px] font-[500] text-gray-100 dark:text-gray-300 tablet:text-[20px] laptop:text-[22px]">
            Already have an account?
          </p>
          <button
            className="text-[11.21px] font-[500] text-blue-200 tablet:text-[20px] laptop:text-[22px]"
            onClick={() => {
              dispatch(setGuestSignInDialogue(true));
            }}
          >
            Sign in
          </button>
        </div>
      </div>
      <BasicModal
        open={isReferral}
        handleClose={handleReferralClose}
        customStyle={referralModalStyle}
        customClasses="rounded-[10px] tablet:rounded-[26px]"
      >
        <ReferralCode
          handleClose={handleReferralClose}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          password={password}
          reTypePassword={reTypePassword}
          email={email}
          setEmail={setEmail}
          setPassword={setPassword}
          referralCode={referralCode}
          setReferralCode={setReferralCode}
          handlePopupOpen={handlePopupOpen}
          socialAccount={socialAccount}
          triggerLogin={triggerLogin}
        />
      </BasicModal>
    </div>
  );
}
