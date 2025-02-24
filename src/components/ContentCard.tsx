import React from 'react';

type Props = {
  icon: string;
  title: string;
  badgeVal?: number;
  from?: number;
  outof?: number;
  children: React.ReactNode;
};

const ContentCard = ({ icon, title, badgeVal, from, outof, children }: Props) => {
  return (
    <div className="mx-4 mb-[15px] tablet:mx-6">
      <div className="flex items-center justify-between rounded-t-[10px] bg-blue-200 px-5 py-[10px] dark:border-x-[1.85px] dark:border-t-[1.85px] dark:border-gray-100 dark:bg-accent-100">
        <div className="flex items-center gap-2">
          <div className="relative h-fit w-fit">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${icon}`}
              alt={title}
              className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
            />
            {/* {badgeVal && (
              <p
                className={`absolute left-1/2 top-[41%] z-50 -translate-x-1/2 -translate-y-1/2 text-[7.3px] font-normal leading-none text-gold-100  tablet:top-[40%] tablet:text-[13px] ${title === 'Your Posts' ? '' : title === 'Other Posts' ? 'text-white' : ''}`}
              >
                {badgeVal}
              </p>
            )} */}
          </div>
          <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">{title}</h1>
        </div>
        {from && outof && (
          <h1 className="text-[14px] font-normal leading-[114%] text-white tablet:text-[18px] tablet:leading-[88%]">
            {from}/{outof}
          </h1>
        )}
      </div>
      <div className="rounded-b-[10px] border-x-[1.85px] border-b-[1.85px] border-gray-250 bg-[#FDFDFD] px-5 py-[10px] dark:border-x-[1.85px] dark:border-gray-100 dark:bg-gray-200 tablet:py-[18.73px]">
        {children}
      </div>
    </div>
  );
};

export default ContentCard;
