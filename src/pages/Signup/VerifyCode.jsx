import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { url } from '../../services/api/Axios';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../../features/auth/authSlice';
import { Button as UiButton } from '../../components/ui/Button';
import { setAskPassword } from '../../features/profile/userSettingSlice';
import showToast from '../../components/ui/Toast';
import { toast } from 'sonner';
import { setGuestSignInDialogue } from '../../features/extras/extrasSlice';
import GuestDialogueScreen from '../../components/GuestDialogueScreen';

const VerifyCode = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [urlQuery, seturlQuery] = useState('');
  const [showDialogBox, setShowDialogBox] = useState(false);
  const [verificationCode, setVerificationCode] = useState([]);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkUrlQuery = () => {
    setLoading(true);
    let urlQuery = window.location.search.slice(1);
    seturlQuery(urlQuery);

    fetch(`${url}/user/authenticateJWT`, {
      method: 'POST',
      headers: {
        Authorization: `${urlQuery}`,
        'Content-Type': 'application/json',
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (data.message === 'Continue') {
          setShowDialogBox(true);
          if (urlQuery.length > 120) {
            let verificationToken = urlQuery.substr(urlQuery.length - 6);
            setVerificationCode(Array.from(verificationToken)); // Create an array from the token
          } else {
            showToast('error', 'verifyCode');
          }

          // Attach the event listener to the whole document
          document.addEventListener('keypress', handleKeyPress);

          return () => {
            // Remove the event listener when the component unmounts
            document.removeEventListener('keypress', handleKeyPress);
          };
        }
        if (data.message === 'jwt expired') {
          setShowDialogBox(false);
          setMsg('It seems that your verification code has expired. Kindly log in to get a new verification code.');
        }
        if (data.message === 'Already Verified') {
          setMsg('You are already Verified.Please Proceed to Login');
        }
      })
      .catch((error) => {
        console.error('Error:', error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    checkUrlQuery();
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleVerify();
    }
  };

  const handleVerify = async (urlQuery) => {
    const apiUrl = `${url}/user/verify?${urlQuery}`;
    const verificationCode = urlQuery.substr(urlQuery.length - 6);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${urlQuery}`,
        },
        body: JSON.stringify({ verificationCode }),
      });

      if (response.status === 200) {
        showToast('success', 'emailVerified');
        const data = await response.json();
        // NOT TO BE REMOVED
        // if (!data.isLegacyEmailContactVerified && !data.isGoogleEmail) {
        //   localStorage.setItem('uuid', data.uuid);
        //   localStorage.setItem('email', data.email);
        //   navigate('/verify-phone');
        // } else {
        dispatch(setAskPassword(false));
        dispatch(addUser(data));
        localStorage.setItem('userData', JSON.stringify(data));
        localStorage.setItem('uuid', data.uuid);
        navigate('/');
        // }
      }

      if (response.status === 401) {
        checkUrlQuery();
      }
    } catch (error) {
      console.log('Error during API request:', error.message);
      throw error;
    }
  };

  return (
    <div className="bg-gray-50 relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#F2F3F5] px-4 py-12">
      <GuestDialogueScreen />
      {showDialogBox ? (
        <div className="relative mx-auto w-full max-w-lg rounded-2xl bg-white px-5 pb-9 pt-10 shadow-xl tablet:px-6">
          <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <div className="text-3xl font-semibold">
                <p>Verify your account</p>
              </div>
              <div className="flex flex-row text-sm font-medium text-gray-100">
                <p>Please check the verification code</p>
              </div>
            </div>
            <div>
              <div className="flex flex-col space-y-16">
                <div className="mx-auto flex w-full max-w-[25rem] flex-row items-center justify-between">
                  {verificationCode.map((code, index) => (
                    <div key={index} className="size-11 tablet:size-16">
                      <input
                        className="focus:bg-gray-50 flex h-full w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-1 !text-center text-lg outline-none ring-blue-700 focus:ring-1 tablet:px-5"
                        type="text"
                        id={`box${index + 1}`}
                        value={code}
                        readOnly
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col space-y-5">
                  <div>
                    <button
                      className="flex w-full flex-row items-center justify-center rounded-xl border border-none bg-[#389CE3] py-5 text-center text-sm text-white shadow-sm outline-none"
                      disabled={loading}
                      onClick={() => {
                        handleVerify(urlQuery);
                      }}
                    >
                      Verify Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative mx-auto w-full max-w-lg rounded-2xl bg-white px-5 pb-9 pt-10 shadow-xl tablet:px-6">
          <p className="text-[9px] font-medium text-black tablet:text-[20px]">{msg}</p>
          <div className="mt-[25px] flex w-full justify-end">
            <UiButton
              className="mt-[25px] flex w-full justify-end"
              onClick={() => {
                dispatch(setGuestSignInDialogue(true));
              }}
              variant={'submit'}
            >
              Login
            </UiButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyCode;
