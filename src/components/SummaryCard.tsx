type Props = {
  headerIcon: string;
  headerTitle: string;
  headerRight?: string;
  isPublicProfile?: boolean;
  children: React.ReactNode;
};

export default function SummaryCard({ headerIcon, headerTitle, headerRight, isPublicProfile, children }: Props) {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between rounded-t-[10px] border-x-[1.85px] border-t-[1.85px] border-blue-200 bg-blue-200 px-5 py-[10px] dark:border-gray-100 dark:bg-accent-100">
        <div className="flex items-center gap-2">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}${headerIcon}`}
            alt={'badge'}
            className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
          />
          <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">{headerTitle}</h1>
        </div>
        <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">{headerRight}</h1>
      </div>
      {!isPublicProfile && (
        <div className="rounded-b-[10px] border-x-[1.85px] border-b-[1.85px] border-gray-250 bg-[#FDFDFD] px-5 py-[10px] text-gray-1 dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:py-[18.73px]">
          {children}
        </div>
      )}
    </div>
  );
}
