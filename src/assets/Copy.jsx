import { useSelector } from 'react-redux';

const Copy = () => {
  const persistedTheme = useSelector((state) => state.utils.theme);

  return (
    <div className="text-gray-1 flex cursor-pointer items-center justify-end gap-1 dark:text-[#ACACAC] tablet:gap-[0.66rem]">
      <img
        src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/share.svg' : 'assets/svgs/sharelink.svg'}`}
        alt="copy"
        className="h-3 w-[13.84px] tablet:h-[23px] tablet:w-[23px]"
      />
      {/* <svg
        className="h-3 w-3 md:h-[1.024rem] md:w-[1.024rem] tablet:h-[23px] tablet:w-5 "
        style={{ height: h, width: w }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 23 23"
        fill="none"
      >
        <path
          d="M18.3271 21.5625H8.26465C7.40684 21.5625 6.58416 21.2218 5.9776 20.6152C5.37104 20.0086 5.03027 19.186 5.03027 18.3281V8.26564C5.03027 7.40783 5.37104 6.58516 5.9776 5.97859C6.58416 5.37203 7.40684 5.03127 8.26465 5.03127H18.3271C19.185 5.03127 20.0076 5.37203 20.6142 5.97859C21.2208 6.58516 21.5615 7.40783 21.5615 8.26564V18.3281C21.5615 19.186 21.2208 20.0086 20.6142 20.6152C20.0076 21.2218 19.185 21.5625 18.3271 21.5625Z"
          fill={color ? color : '#A3A3A3'}
        />
        <path
          d="M7.18823 3.59422H17.7844C17.5608 2.96408 17.1477 2.41856 16.6017 2.03251C16.0558 1.64646 15.4038 1.43878 14.7351 1.43797H4.67261C3.8148 1.43797 2.99212 1.77874 2.38556 2.3853C1.779 2.99186 1.43823 3.81454 1.43823 4.67235V14.7348C1.43904 15.4035 1.64671 16.0555 2.03277 16.6015C2.41882 17.1474 2.96434 17.5605 3.59448 17.7841V7.18797C3.59448 6.23485 3.97311 5.32077 4.64707 4.64681C5.32103 3.97285 6.23511 3.59422 7.18823 3.59422Z"
          fill={color ? color : '#A3A3A3'}
        />
      </svg> */}
      {/* <p className="text-nowrap text-[9px] font-normal tablet:text-[1.125rem] laptop:text-[1.25rem]">Share</p> */}
    </div>
  );
};

export default Copy;
