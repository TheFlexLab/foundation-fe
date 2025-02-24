import { useSelector } from 'react-redux';

const GuestTopbar = ({ createdBy, badgeCount, QuestTopic, img }) => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  return (
    <div className="flex items-center justify-between border-b-2 border-gray-250 px-[10.4px] py-2 tablet:px-[22px] tablet:pb-[10px] tablet:pt-[17px]">
      {createdBy === persistedUserInfo?.uuid ? (
        <div className="relative h-fit w-fit">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/MeBadge.svg`}
            alt="Me Badge"
            className="h-[28.379px] w-[22.722px] tablet:h-[47px] tablet:w-[38px]"
          />
          <p className="transform-center absolute z-50 text-[11.3px] font-[400] leading-normal text-[#7A7016] tablet:pb-3 tablet:text-[17px]">
            Me
          </p>
        </div>
      ) : (
        <div className="relative h-fit w-fit">
          <img src={img} alt="badge" className="h-[28.379px] w-[22.722px] tablet:h-[47px] tablet:w-[38px]" />
          <p className="transform-center absolute z-50 text-[11.3px] font-[400] leading-normal text-[#F6F6F6] tablet:pb-3 tablet:text-[17px]">
            {badgeCount}
          </p>
        </div>
      )}
      <h1 className="text-center text-[10.414px] font-medium leading-normal text-[#9A9A9A] dark:text-[#9A9A9A] tablet:text-[1.51rem]">
        {QuestTopic}
      </h1>
    </div>
  );
};

export default GuestTopbar;
