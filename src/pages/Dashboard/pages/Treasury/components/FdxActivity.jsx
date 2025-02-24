import { useQuery } from '@tanstack/react-query';
import { fetchPurchasedFdxHistory } from '../../../../../services/api/Treasury';
import { useSelector } from 'react-redux';
import { formatDate } from '../../../../../utils/utils';

const FdxActivity = ({ isPulse }) => {
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const {
    data: historyData,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryFn: () => fetchPurchasedFdxHistory(persistedUserInfo.uuid),
    queryKey: ['fdxPurchasedHistory'],
  });

  return (
    <div>
      <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
        <div className="flex items-center gap-2">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/buy-fdx-activity.svg`}
            alt={'buy-fdx-activity'}
            className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
          />
          <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">Buy FDX Activity</h1>
        </div>
      </div>
      <div className="rounded-b-[10px] border-gray-250 bg-[#FDFDFD] px-2 py-[10px] tablet:border-[1.85px] tablet:px-5 tablet:py-[18.73px]">
        <div className="flex flex-col gap-[5px] rounded-b-[10px] bg-[#FDFDFD] tablet:gap-[15px]">
          {!historyData?.history || historyData?.history?.length === 0 ? (
            <div className="rounded-[5.85px] border-[1.84px] border-gray-250 bg-white py-2 tablet:rounded-[15px] tablet:py-6">
              <p className="text-center text-[11px] font-medium leading-normal text-[#C9C8C8] tablet:text-[22px]">
                You have no records.
              </p>
            </div>
          ) : (
            <div>
              <div className="mx-3 mb-2 flex items-center justify-between tablet:mx-5 tablet:mb-[13px]">
                <div className="grid w-full grid-cols-4 gap-[10px] tablet:gap-5">
                  <p className="text-[10px] font-medium leading-normal text-[#707175] tablet:text-[18px] tablet:font-bold tablet:leading-[120%]">
                    Created
                  </p>
                  <p className="text-[10px] font-medium leading-normal text-[#707175] tablet:text-[18px] tablet:font-bold tablet:leading-[120%]">
                    Dollar Spent
                  </p>
                  <p className="text-[10px] font-medium leading-normal text-[#707175] tablet:text-[18px] tablet:font-bold tablet:leading-[120%]">
                    FDX Bought
                  </p>
                  <p className="text-[10px] font-medium leading-normal text-[#707175] tablet:text-[18px] tablet:font-bold tablet:leading-[120%]">
                    Provider
                  </p>
                </div>
              </div>
              <div className="rounded-[5.85px] border-[1.84px] border-gray-250 bg-white tablet:rounded-[15px]">
                {!isLoading &&
                  !isError &&
                  historyData?.history
                    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    ?.map((item, index) => (
                      <div
                        key={item._id}
                        className={`flex w-full justify-between gap-2 px-3 py-2 tablet:h-[112px] tablet:gap-4 tablet:px-5 tablet:py-5 laptop:h-[57px] laptop:flex-row laptop:items-center laptop:gap-0 ${index !== historyData?.history?.length - 1 && 'border-b-[1.84px] border-gray-250'} ${index === 0 && isPulse ? 'animate-pulse bg-[#EEF8EA] text-[#049952]' : 'text-[#707175]'}`}
                      >
                        <div className="grid w-full grid-cols-4 gap-[10px] tablet:gap-5">
                          <p className="text-[10px] font-medium leading-normal tablet:min-w-[152px] tablet:max-w-[152px] tablet:text-[16px]">
                            {formatDate(item.createdAt)}
                          </p>
                          <p className="text-[10px] font-medium leading-normal tablet:min-w-[152px] tablet:max-w-[152px] tablet:text-[16px]">
                            {item?.dollarSpent}
                          </p>
                          <p className="text-[10px] font-medium leading-normal tablet:min-w-[152px] tablet:max-w-[152px] tablet:text-[16px]">
                            {item?.fdxPurchased}
                          </p>
                          <p className="text-[10px] font-medium leading-normal tablet:min-w-[152px] tablet:max-w-[152px] tablet:text-[16px]">
                            {item?.providerName}
                          </p>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FdxActivity;
