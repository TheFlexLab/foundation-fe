import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import PopUp from '../ui/PopUp';

export default function WelcomePopup({ modalVisible, handleClose }) {
  const navigate = useNavigate();

  return (
    <PopUp
      logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/welcomePage/logo_black.svg`}
      title={'Foundation'}
      open={modalVisible}
      handleClose={handleClose}
      isBackground={true}
    >
      <div className="flex w-full flex-col items-center rounded-b-[9.26px] bg-white md:justify-center xl:rounded-b-[65px] xl:rounded-tl-[65px] dark:bg-dark">
        <div className="flex h-full flex-col items-center px-4 pb-[17px] pt-3 tablet:justify-center tablet:px-20 tablet:pb-[52px] tablet:pt-8">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/welcomePage/welcome.svg`}
            alt="welcome logo"
            className="mb-1 h-[49px] w-[49px] tablet:mb-[10px] tablet:h-[105.932px] tablet:w-[105.932px]"
          />
          <h1 className="mb-[1px] text-[12px] font-semibold leading-[17.544px] tracking-[0.36px] text-[#707175] tablet:text-[40px] tablet:leading-[48.41px]">
            Welcome!
          </h1>

          <p className="font-Inter mb-3 max-w-[751px] text-center text-[10px] font-normal leading-[14.62px] text-[#707175] tablet:mb-[25px] tablet:text-[23px] tablet:leading-[33px]">
            Sign up to share your thoughts anonymously, guaranteeing utmost privacy. Unlock rewards by providing
            valuable insights, adding verification badges, and participating in posts. Customize your experience with
            our Filters & Preferences features, allowing you to tailor information and seek insights based on your
            preferences.
          </p>

          <div className="flex gap-[6.96px] tablet:gap-[15px]">
            <Button
              variant={'submit'}
              onClick={() => {
                navigate('/guest-signup');
              }}
            >
              Join Now
            </Button>
            <Button variant={'addOption'} onClick={handleClose}>
              Maybe Later
            </Button>
          </div>
        </div>
      </div>
    </PopUp>
  );
}
