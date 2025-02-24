import { useSelector } from 'react-redux';

export default function EmbedStatusBar() {
  const persistedUserInfo = useSelector((state) => state.auth.user);

  return (
    <div className="rounded-t-[10.1px] border-blue-100 border-b-blue-100 bg-blue-100 p-2 tablet:rounded-t-[14.5px] tablet:border-b-[1.85px] tablet:p-4">
      <div className="relative flex items-center justify-center">
        <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/foundation_logo.svg`}
          alt="foundation_logo"
          className="h-[10px] w-auto tablet:h-auto"
        />
        {/* <div className="dark:bg-gray-200">
          {persistedUserInfo?.role !== 'user' ? (
            <div className="flex cursor-pointer items-center gap-[15px]">
              <div className="relative h-fit w-fit">
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/guestBadge.svg`}
                  alt="badge"
                  className="h-[28px] w-[23px] tablet:h-[47px] tablet:w-[38px]"
                />
                <p className="transform-center absolute z-50 pb-2 text-[14px] font-medium leading-[14px] text-white tablet:pb-3 tablet:text-[20px] tablet:leading-normal">
                  G
                </p>
              </div>
              <div className="flex h-[28px] flex-col justify-between tablet:h-[47px]">
                <h4 className="w-fit border-b-2 text-[12px] font-semibold leading-[12px] text-white-100 2xl:text-[30px] tablet:text-[18px] tablet:leading-[18px]">
                  My Balance (Guest)
                </h4>
                <p className="font-inter text-[10.79px] font-medium text-white-100 tablet:text-[18px] tablet:leading-[18px]">
                  {persistedUserInfo?.balance ? persistedUserInfo?.balance.toFixed(2) : 0} FDX
                </p>
              </div>
            </div>
          ) : (
            <div
              className="flex cursor-pointer items-center gap-[15px]"
              onClick={() => {
                navigate('/profile');
              }}
            >
              <div className="relative flex items-center justify-center tablet:size-[47px]">
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/MeBadge.svg`}
                  alt="badge"
                  className="h-[28px] w-[23px] tablet:h-[47px] tablet:w-[38px]"
                />
                <p className="transform-center absolute z-50 pb-2 text-[14px] font-medium leading-[14px] text-[#7A7016] tablet:pb-3 tablet:text-[20px] tablet:leading-normal">
                  {persistedUserInfo?.badges?.length}
                </p>
              </div>
              <div className="flex h-[28px] flex-col justify-between tablet:h-[47px]">
                <h4 className="w-fit border-b-2 text-[12px] font-semibold leading-[12px] text-white-100 2xl:text-[30px] tablet:text-[18px] tablet:leading-[18px]">
                  My Balance
                </h4>
                <p className="font-inter text-[10.79px] font-medium text-white-100 tablet:text-[18px] tablet:leading-[18px]">
                  {persistedUserInfo?.balance ? persistedUserInfo?.balance.toFixed(2) : 0} FDX
                </p>
              </div>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}
