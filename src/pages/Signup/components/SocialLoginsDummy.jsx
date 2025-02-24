import { useSelector } from 'react-redux';
import Button from '../../../components/Button';

const SocialLoginsDummy = () => {
  const persistedTheme = useSelector((state) => state.utils.theme);

  return (
    <div className="my-5 flex w-full gap-2 rounded-[6.043px] md:mb-6 md:mt-[37.8px] 2xl:mb-[41.75px] 2xl:rounded-[11.703px] laptop:w-[35.2vw] laptop:justify-between laptop:gap-10 5xl:mb-9 tall:my-4 ">
      <Button size="login-btn" color="gray">
        <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/google.svg`}
          className="mr-2 h-[22px] w-[22px] md:h-12 md:w-[32px] "
        />{' '}
        Continue with Google
      </Button>
      <button className="flex h-[36px] w-full items-center justify-center whitespace-nowrap rounded-[6.043px] border-[1px] border-gray-200 bg-white px-2 text-center text-[2.3vw] font-[500] text-black sm:h-[50px] sm:text-[2.1vw] lg:h-[60px] lg:text-[.98vw] 2xl:rounded-[11.703px] 2xl:px-4 dark:border-white dark:bg-dark-gray dark:text-white ">
        {persistedTheme === 'dark' ? (
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/facebook.svg`}
            className="mr-[0.5rem] h-[22px] w-[22px] md:h-12 md:w-[32px] 2xl:mr-3"
          />
        ) : (
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/facebook-white.svg`}
            className="mr-[0.5rem] h-[22px] w-[22px] md:h-12 md:w-[32px] 2xl:mr-3"
          />
        )}
        <span className="inline-block align-middle">Continue with Facebook</span>
      </button>
    </div>
  );
};

export default SocialLoginsDummy;
