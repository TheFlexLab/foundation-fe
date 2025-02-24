import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../../../components/ui/Button';
import { getConstantsValues } from '../../../../../features/constants/constantsSlice';
import SummaryCard from '../../../../../components/SummaryCard';

const rewardAndFeesList = ['Post participation', 'Giving Feedback', 'Creating a post', 'My post engagement'];

const TreasurySummary = () => {
  const navigate = useNavigate();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedConstants = useSelector(getConstantsValues);

  return (
    <div className="mx-auto mb-4 flex max-w-[778px] flex-col gap-3 px-4 tablet:mb-8 tablet:gap-6 tablet:px-6">
      <SummaryCard headerIcon="/assets/svgs/your-fdx.svg" headerTitle="Your FDX">
        <div className="flex items-center justify-between tablet:px-[45.27px]">
          <div className="space-y-2">
            <h1 className="text-[12px] font-semibold leading-[113%] tablet:text-[18px] tablet:leading-normal">
              FDX balance
            </h1>
            <p className="text-[12px] font-normal leading-[113%] tablet:text-[16px] tablet:leading-normal">
              FDX earned:
            </p>
            <p className="text-[12px] font-normal leading-[113%] tablet:text-[16px] tablet:leading-normal">
              FDX spent:
            </p>
            {/* <p className="text-[12px] font-normal leading-[113%] tablet:text-[16px] tablet:leading-normal">
              FDX redeemed:
            </p> */}
          </div>
          <div className="space-y-2 text-end">
            <h1 className="text-[12px] font-semibold leading-[113%] tablet:text-[18px] tablet:leading-normal">
              {persistedUserInfo?.balance?.toFixed(2)} FDX
            </h1>
            <p className="text-[12px] font-normal leading-[113%] tablet:text-[16px] tablet:leading-normal">
              {persistedUserInfo?.fdxEarned?.toFixed(2)} FDX
            </p>
            <p className="text-[12px] font-normal leading-[113%] tablet:text-[16px] tablet:leading-normal">
              {persistedUserInfo?.fdxSpent?.toFixed(2)} FDX
            </p>
            {/* <p className="text-[12px] font-normal leading-[113%] tablet:text-[16px] tablet:leading-normal">
              {persistedUserInfo?.redemptionStatistics?.codeRedeemedFdxEarned?.toFixed(2)} FDX
            </p> */}
          </div>
        </div>
      </SummaryCard>
      {/* Rewards & Fees */}
      <SummaryCard headerIcon="/assets/svgs/reward-and-fees.svg" headerTitle="Rewards & Fees">
        <div className="flex flex-col justify-between">
          <h1 className="text-[12px] font-normal leading-[133%] tablet:text-[16px] tablet:leading-normal">
            Below, you'll find the latest values for rewards and fees associated with your activities.
          </h1>
          <p className="mt-1 text-[10px] font-normal leading-[160%] tablet:text-[16px] tablet:leading-normal">
            *Values subject to change.
          </p>
          <div className="flex w-full items-center justify-between rounded-b-[10px] pt-3 tablet:px-11 tablet:pt-5">
            <div className="space-y-2">
              {rewardAndFeesList.map((item, index) => (
                <p
                  key={index + 1}
                  className="text-[12px] font-normal leading-[113%] tablet:text-[16px] tablet:leading-normal"
                >
                  {item}
                </p>
              ))}
            </div>
            <div className="space-y-2 text-end">
              <p className="text-[12px] font-normal leading-[113%] tablet:text-[16px] tablet:leading-normal">
                +{persistedConstants?.QUEST_COMPLETED_AMOUNT} FDX
              </p>
              <p className="text-[12px] font-normal leading-[113%] tablet:text-[16px] tablet:leading-normal">
                +{persistedConstants?.QUEST_COMPLETED_AMOUNT} FDX
              </p>
              <p className="text-[12px] font-normal leading-[113%] tablet:text-[16px] tablet:leading-normal">
                +{persistedConstants?.QUEST_CREATED_AMOUNT} FDX
              </p>
              <p className="text-[12px] font-normal leading-[113%] tablet:text-[16px] tablet:leading-normal">
                {persistedConstants?.MY_POST_ENGAGEMENT} FDX
              </p>
            </div>
          </div>
        </div>
        <div className="mt-3 flex w-full justify-center tablet:mt-5">
          <Button variant={'submit'} onClick={() => navigate('/treasury/reward-schedule')}>
            View all
          </Button>
        </div>
      </SummaryCard>
      {/* FDX Value */}
      {/* <div>
        <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
          <div className="flex items-center gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/fdx-value.svg`}
              alt={'fdx value'}
              className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
            />
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">FDX Value</h1>
          </div>
        </div>
        <div className="rounded-b-[10px] border-gray-250 bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:py-[18.73px]">
          <h1 className="text-[12px] font-normal leading-[133%] text-gray-1 tablet:text-[16px] tablet:font-medium tablet:leading-normal">
            Need more FDX? You can purchase more FDX from the Foundation treasury.
          </h1>
          <p className="mt-1 text-[10px] font-normal leading-[160%] text-gray-1 tablet:text-[16px] tablet:leading-normal">
            *Values subject to change.
          </p>
          <div className="flex justify-between pt-3 tablet:px-11 tablet:pt-5">
            <p className="text-[12px] font-normal leading-[113%] text-gray-1 tablet:text-[16px] tablet:leading-normal">
              1 FDX
            </p>
            <p className="text-[12px] font-normal leading-[113%] text-gray-1 tablet:text-[16px] tablet:leading-normal">
              ${persistedConstants?.FDX_CONVERSION_RATE_WRT_USD} USD
            </p>
          </div>
          <div className="mt-3 flex w-full justify-center tablet:mt-5 ">
            <Button variant={'submit'} onClick={() => navigate('/treasury/buy-fdx')}>
              Buy more FDX
            </Button>
          </div>
        </div>
      </div> */}
      {/* Redemption Code Activity */}
      {/* <div>
        <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
          <div className="flex items-center gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/redemption-code-activity.svg`}
              alt={'redemption-code-activity'}
              className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
            />
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">
              Redemption Code Activity
            </h1>
          </div>
        </div>
        <div className="rounded-b-[10px] border-gray-250 bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:py-[18.73px]">
          <div className="rounded-[7.546px] border-[2.792px] border-gray-250">
            <div className="grid grid-cols-8 border-b-[2.792px] border-gray-250 pl-2 tablet:pl-8">
              <h1 className="col-span-6 py-2 text-[12px] font-semibold leading-[113%] text-gray-1 tablet:py-3 tablet:text-[16px] tablet:leading-normal">
                Total codes I’ve created
              </h1>
              <h1 className="col-span-2 border-l-[2.792px] border-gray-250 py-2 text-center text-[12px] font-medium leading-[113%] text-gray-1 tablet:py-3 tablet:text-[16px] tablet:leading-normal">
                {persistedUserInfo?.redemptionStatistics?.myTotalRedemptionCodeCreationCount}
              </h1>
            </div>
            <div className="grid grid-cols-8 border-b-[2.792px] border-gray-250 pl-2 tablet:pl-8">
              <h1 className="col-span-6 py-2 text-[12px] font-normal leading-[113%] text-gray-1 tablet:py-3 tablet:text-[16px] tablet:leading-normal">
                FDX spent to create codes
              </h1>
              <h1 className="col-span-2 border-l-[2.792px] border-gray-250 py-2 text-center text-[12px] font-normal leading-[113%] text-gray-1 tablet:py-3 tablet:text-[16px] tablet:leading-normal">
                {persistedUserInfo?.redemptionStatistics?.createCodeFdxSpent?.toFixed(2)} FDX
              </h1>
            </div>
            <div className="grid grid-cols-8 pl-2 tablet:pl-8">
              <h1 className="col-span-6 py-2 text-[12px] font-normal leading-[113%] text-gray-1 tablet:py-3 tablet:text-[16px] tablet:leading-normal">
                FDX earned from codes redeemed
              </h1>
              <h1 className="col-span-2 border-l-[2.792px] border-gray-250 py-2 text-center text-[12px] font-normal leading-[113%] text-gray-1 tablet:py-3 tablet:text-[16px] tablet:leading-normal">
                {persistedUserInfo?.redemptionStatistics?.codeRedeemedFdxEarned?.toFixed(2)} FDX
              </h1>
            </div>
          </div>
          <div className="mt-3 flex w-full justify-center tablet:mt-5 ">
            <Button variant={'submit'} onClick={() => navigate('/treasury/redemption-center')}>
              Redemption Center
            </Button>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default TreasurySummary;
