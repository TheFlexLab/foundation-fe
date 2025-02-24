import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { Button } from '../../components/ui/Button';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const persistedTheme = useSelector((state) => state.utils.theme);

  useEffect(() => {
    if (location.state?.from === '/treasury/:code' && !localStorage.getItem('guestWelcome')) {
      localStorage.setItem('guestWelcome', 'true');
      toast.warning('To radeem this code, please create an account.');
    }
  }, []);

  return (
    <div className="flex h-screen w-full flex-col bg-blue text-white xl:flex-row dark:bg-black-200">
      <div
        className={`${
          persistedTheme === 'dark' ? 'bg-dark' : 'bg-blue'
        } flex h-[65px] w-full items-center justify-center bg-[#202329] xl:hidden`}
      >
        <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/logo.svg`}
          alt="logo"
          className="h-[45px] w-[58px]"
        />
      </div>
      <div className="hidden h-screen w-fit items-center px-[9.15vw] xl:flex">
        <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/logo.svg`}
          alt="logo"
          className="h-[20vh] w-[23vw]"
        />
      </div>

      <div className="flex h-screen w-full flex-col items-center bg-white md:justify-center xl:rounded-bl-[65px] xl:rounded-tl-[65px] dark:bg-dark">
        <div className="flex h-full flex-col items-center px-[30px]  pb-[174px] pt-5 tablet:justify-center tablet:px-[95px] tablet:pt-[94px]">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/welcomePage/welcome.svg`}
            alt="welcome logo"
            className="mb-[17px] h-20 w-20 tablet:mb-[39px] tablet:h-[178.2px] tablet:w-[178.2px]"
          />
          <h1 className="mb-[14px] text-[16px] font-bold leading-[19.36px] text-black tablet:text-[40px] tablet:leading-[48.41px]">
            Welcome to Foundation !
          </h1>

          <p className="font-Inter mb-[23px] max-w-[751px] text-center text-[12px] font-normal leading-[17.54px] text-[#707175] tablet:mb-[39px] tablet:text-[23px] tablet:leading-[33px]">
            You're about to embark on a journey where you can build and monetize an anonymous online identity that's
            entirely under your control. As you share your insights by participating and adding verification badges, you
            enhance your ability to monetize your data, all while contributing to a community that values genuine voices
            over trolls and bad actors. Our platform is designed to filter out noise, letting the world’s true insights
            shine without fear of social backlash.
          </p>

          <div className="flex w-[16rem] flex-col gap-[15px] tablet:h-[165px] tablet:w-[446px]">
            <Button variant="hollow-welcome" className={'max-w-[600px]'} onClick={() => navigate('/signin')}>
              Sign In
            </Button>
            <Button variant="submit-welcome" className={'max-w-[600px]'} onClick={() => navigate('/signup')}>
              Create an Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
