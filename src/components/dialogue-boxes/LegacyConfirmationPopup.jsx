import { useState } from 'react';
import PopUp from '../ui/PopUp';
import { Button } from '../ui/Button';
import { FaSpinner } from 'react-icons/fa';
import api from '../../services/api/Axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import showToast from '../ui/Toast';

const LegacyConfirmationPopup = ({ isPopup, setIsPopup, title, logo, legacyPromiseRef, login, uuid }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    if (!localStorage.getItem('legacyHash')) {
      if (localStorage.getItem('target-url').toString().includes('/signin')) {
        window.location.href = localStorage.getItem('target-url');
      } else {
        navigate('/profile/verification-badges');
      }
    }
    setIsPopup(false);
  };

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputType = showPassword ? 'text' : 'password';
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = async () => {
    setIsLoading(true);
    setPassword('');
    if (login) {
      try {
        console.log('uuid', uuid);
        const infoc = await api.post('/user/runtimeSignInPassword', {
          infoc: password,
          userUuid: uuid,
        });
        if (infoc.status === 200) {
          localStorage.setItem('legacyHash', infoc.data.hash);
          localStorage.setItem('uuid', infoc.data.user.uuid);
          localStorage.setItem('userData', JSON.stringify(infoc.data.user));
          localStorage.removeItem('isGuestMode');
          dispatch(addUser(infoc.data.user));
          if (localStorage.getItem('shared-post') !== '' && localStorage.getItem('shared-post') !== null) {
            navigate(localStorage.getItem('shared-post'));
            localStorage.clearItem('shared-post');
          } else {
            navigate('/');
          }
          if (legacyPromiseRef.current) {
            setIsPopup(false);
            setIsLoading(false);
            legacyPromiseRef.current();
          }
        }
      } catch (error) {
        showToast('error', 'error', {}, error.response.data.message.split(':')[0]);
        setIsLoading(false);
      }
    } else {
      try {
        const infoc = await api.post('user/infoc', {
          infoc: password,
        });
        if (infoc.status === 200) {
          if (localStorage.getItem('legacyHash')) {
            if (infoc.data.data !== localStorage.getItem('legacyHash')) {
              showToast('error', 'wrongPassword');
              setIsLoading(false);
              return;
            }
          } else {
            localStorage.setItem('legacyHash', infoc.data.data);
          }
          if (legacyPromiseRef.current) {
            setIsPopup(false);
            setIsLoading(false);
            legacyPromiseRef.current();
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
      <div className="px-5 py-[15px] tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            validatePassword();
          }}
          className="flex flex-col gap-[14px] tablet:gap-[25px]"
        >
          <div className="relative grid w-full grid-cols-[1fr] items-center">
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type={inputType}
              className="verification_badge_input"
              placeholder="Password"
            />
            {!showPassword ? (
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/eye-white.svg`}
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

          <div className="flex justify-end gap-[15px] tablet:gap-[35px]">
            <Button variant="submit" type="submit">
              {isLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Submit'}
            </Button>
          </div>
        </form>
      </div>
    </PopUp>
  );
};

export default LegacyConfirmationPopup;
