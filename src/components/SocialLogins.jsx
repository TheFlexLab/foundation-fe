import { Button } from './ui/Button';
import { authMethods } from '../constants/authentication';
import { useLocation, useNavigate } from 'react-router-dom';
import { isWebview } from '../utils/helper';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentialLogin, setCredentialRegister } from '../features/extras/extrasSlice';

const SocialLogins = ({ handleReferralOpen, setClickedButtonName, isLogin, triggerLogin }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const guestSignUpDialogue = useSelector((state) => state.extras.guestSignUpDialogue);

  const filteredAuthMethods = authMethods.filter((item) => {
    if (isWebview()) {
      // If isWebview() is true, exclude items with title 'Google'
      return item.title !== 'Google';
    }
    // If isWebview() is false, include all items
    return true;
  });

  return (
    <div className="my-5 flex min-w-[145px] flex-col gap-2 rounded-[6.043px] 2xl:rounded-[11.703px] tablet:my-11 tablet:min-w-[220px] laptop:min-w-[305px] laptop:justify-between laptop:gap-[1.56rem]">
      {isWebview() && (
        <Button
          variant="auth"
          onClick={() => {
            if (location.pathname === '/signin') {
              navigate('/signin/credentials');
            } else if (location.pathname === '/signup') {
              navigate('/signup/credentials');
            } else {
              navigate('/guest-signup/credentials');
            }
          }}
        >
          <div className="flex min-w-[67px] items-center whitespace-nowrap tablet:min-w-[115px]">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/email-login.svg`}
              className="mr-2 w-[22px] md:w-8 lg:mr-3"
            />
            Email
          </div>
        </Button>
      )}
      {filteredAuthMethods.map((item) => (
        <Button
          variant="auth"
          key={item.id}
          onClick={() => {
            localStorage.setItem('target-url', `${window.location.href}`);
            if (isLogin) {
              triggerLogin(item.provider);
              localStorage.setItem('authMode', 'Login');
            } else {
              setClickedButtonName(item.provider);
              handleReferralOpen(item.provider);
              localStorage.setItem('authMode', 'Register');
            }
          }}
        >
          <div className="flex min-w-[67px] items-center whitespace-nowrap tablet:min-w-[115px]">
            <img src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${item.img}`} className="mr-2 w-[22px] md:w-8 lg:mr-3" />
            {item.title}
          </div>
        </Button>
      ))}
      {!isWebview() && (
        <Button
          variant="auth"
          onClick={() => {
            if (guestSignUpDialogue) {
              dispatch(setCredentialRegister(true));
            } else {
              dispatch(setCredentialLogin(true));
            }
          }}
        >
          <div className="flex min-w-[67px] items-center whitespace-nowrap tablet:min-w-[115px]">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/email-login.svg`}
              className="mr-2 w-[22px] md:w-8 lg:mr-3"
            />
            Email
          </div>
        </Button>
      )}
    </div>
  );
};

export default SocialLogins;
