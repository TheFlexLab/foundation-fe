import { useState } from 'react';
import { useDispatch } from 'react-redux';
import SocialLogins from '../../components/SocialLogins';
import { setGuestSignUpDialogue } from '../../features/extras/extrasSlice';
import '../../index.css';

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

export default function Signin() {
  const dispatch = useDispatch();
  const [clickedButtonName, setClickedButtonName] = useState('');

  const triggerLogin = async (value) => {
    if (!value) {
      value = clickedButtonName;
    }

    switch (value) {
      case 'google':
        // if (isWebview()) {
        //   showToast('info', 'webViewLogin');
        // } else {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
        // }
        break;
      case 'linkedin':
        // if (!isWebview()) {
        //   showToast('info', 'webViewLogin');
        // } else {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/linkedin`;
        // }
        break;
      case 'github':
        // if (!isWebview()) {
        //   showToast('info', 'webViewLogin');
        // } else {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
        // }
        break;
      case 'facebook':
        // if (!isWebview()) {
        //   showToast("info", "webViewLogin");
        // } else {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/facebook`;
        // }
        break;
      case 'instagram':
        // if (isWebview()) {
        //   showToast("info", "webViewLogin");
        // } else {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/instagram`;
        // }
        break;
      case 'twitter':
        // if (!isWebview()) {
        //   showToast("info", "webViewLogin");
        // } else {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/twitter`;
        // }
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex w-full flex-col rounded-b-[9.76px] bg-white text-white dark:bg-black lg:flex-row tablet:rounded-b-[26px]">
      <div className="dark:bg-dark flex w-full flex-col items-center rounded-b-[9.76px] bg-white py-4 dark:bg-gray-200 md:justify-center tablet:rounded-b-[26px] tablet:py-7">
        <p className="dark:text-gray text-[11.21px] font-[500] text-gray-100 dark:text-gray-300 tablet:text-[20px] laptop:text-[22px]">
          Login
        </p>
        <SocialLogins setClickedButtonName={setClickedButtonName} isLogin={true} triggerLogin={triggerLogin} />
        <div className="flex justify-center gap-3">
          <p className="dark:text-gray text-[11.21px] font-[500] text-gray-100 dark:text-gray-300 tablet:text-[20px] laptop:text-[22px]">
            Don’t have an account?
          </p>
          <button
            className="text-[11.21px] font-[500] text-blue-200 tablet:text-[20px] laptop:text-[22px]"
            onClick={() => {
              dispatch(setGuestSignUpDialogue(true));
            }}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
