// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getConstants } from '../../../../../services/api/userAuth';
import { saveConstants } from '../../../../../features/constants/constantsSlice';

const LedgerTableTopbar = ({
  isTreasury,
  sort,
  setsort,
  filterText,
  setFilterText,
  selectedOption,
  setSelectedOption,
  fromPage,
}) => {
  const dispatch = useDispatch();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const { data: constants, error: constantsError } = useQuery({
    queryKey: ['constants'],
    queryFn: getConstants,
  });

  if (constantsError) {
    console.log(constantsError);
  }

  useEffect(() => {
    if (constants) {
      dispatch(saveConstants(constants));
    }
  }, [constants]);

  const handleDropdown = () => {
    setSelectedOption(!selectedOption);
  };

  const handleOptionClick = (option) => {
    setsort(option);
    setSelectedOption(false);
  };

  let x = 10000000000000;

  return (
    <div className="relative mb-[10.27px] flex w-full justify-between tablet:mb-8">
      {!isTreasury ? (
        <div className="flex gap-[10.97px] tablet:gap-5 laptop:gap-[63px]">
          {/* profile */}
          {/* <div className="flex gap-[5.51px] tablet:gap-[13px]">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/person.svg`}
              alt="person icon"
              className="h-[18.5px] w-[18.5px] tablet:h-[36px] tablet:w-[36px] laptop:h-[44.2px] laptop:w-[44.2px]"
            />
            <div>
              <h1 className="whitespace-nowrap text-[8.6px] font-semibold leading-normal -tracking-[0.207px] text-[#ACACAC] tablet:text-[14px] laptop:text-[20.7px]">
                My Profile
              </h1>
              <div className="flex gap-[2px] text-[5.79px] font-normal leading-normal text-[#616161] tablet:text-[9px] laptop:text-[13.824px]">
                <p>{persistedUserInfo?.balance ? persistedUserInfo?.balance.toFixed(2) : 0} FDX</p>
              </div>
            </div>
          </div> */}

          {/* treasury */}
          {fromPage !== 'withdrawals' && (
            <div className="flex gap-[5.51px] tablet:gap-[13px]">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/treasure.png`}
                alt="person icon"
                className="h-[18.5px] w-[18.5px] tablet:h-[36px] tablet:w-[36px] laptop:h-[44.2px] laptop:w-[44.2px]"
              />
              <div>
                <h1 className="text-[8.6px] font-semibold leading-normal -tracking-[0.207px] text-gray-1 dark:text-gray-300 tablet:text-[14px] laptop:text-[20.7px]">
                  Treasury
                </h1>
                <div className="flex gap-[2px] text-[5.79px] font-normal leading-normal text-gray-1 dark:text-gray-300 tablet:text-[9px] laptop:text-[13.824px]">
                  <p>{constants ? (constants.TREASURY_BALANCE * 1)?.toFixed(2) : 0} FDX</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div></div>
      )}
      <div className="flex items-center gap-[5.4px] tablet:gap-[8.5px] laptop:gap-[23.5px]">
        {/* search */}
        <div className="relative flex h-[12.6px] tablet:h-[32px] laptop:h-[43px]">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/search2.svg`}
            alt="search icon"
            className="absolute left-1 top-[48%] h-2 w-2 -translate-y-[50%] transform tablet:left-[9.22px] tablet:h-[16px] tablet:w-[16px] laptop:h-[27px] laptop:w-[27px]"
          />
          <input
            type="text"
            onChange={(e) => setFilterText(e.target.value)}
            value={filterText}
            placeholder="Search"
            className="w-[72px] rounded-[3.34px] border-[1.153px] border-gray-1 bg-white py-[2.3px] pl-[13.34px] text-[5.79px] font-normal leading-[5.79px] -tracking-[0.2px] text-gray-1 dark:bg-gray-200 dark:text-gray-300 tablet:w-[130px] tablet:rounded-[11.526px] tablet:py-1 tablet:pl-8 tablet:text-[10px] laptop:w-[248px] laptop:py-[8.07px] laptop:pl-[46px] laptop:text-[20px]"
          />
        </div>
        {/* sort */}
        <div className="relative h-[12.6px] w-[40%] rounded-[3.34px] border-[1.153px] border-gray-1 bg-white dark:bg-gray-200 dark:text-gray-300 tablet:h-[32px] tablet:w-[130px] tablet:rounded-[11.526px] laptop:h-[43.3px] laptop:w-[240px]">
          <button
            onClick={handleDropdown}
            className="h-full w-[54px] gap-1 whitespace-nowrap px-[2px] tablet:w-full tablet:px-[10px] laptop:px-[17px]"
          >
            <h1 className="relative -top-[10.4px] whitespace-nowrap text-[5.77px] font-normal leading-normal -tracking-[0.2px] text-gray-1 dark:text-gray-300 tablet:top-[1px] tablet:text-[10px] laptop:text-[20.021px]">
              Sort by : <span className="font-semibold capitalize text-gray dark:text-gray-300">{sort}</span>
            </h1>
          </button>
          <div
            className={`${
              selectedOption ? 'flex duration-200 ease-in-out' : 'hidden'
            } absolute z-50 -mt-3 w-10 flex-col gap-1 rounded-md bg-silver-100 px-1 py-[5px] text-left text-black tablet:mt-1 tablet:w-20 laptop:mt-2 laptop:w-32 laptop:gap-2 laptop:py-2`}
          >
            <p
              className="cursor-pointer rounded-md text-[7px] duration-200 ease-in-out hover:bg-white tablet:text-[10px] laptop:px-2 laptop:text-[16px]"
              onClick={() => handleOptionClick('newest')}
            >
              Newest
            </p>
            <p
              className="cursor-pointer rounded-md text-[7px] duration-200 ease-in-out hover:bg-white tablet:text-[10px] laptop:px-2 laptop:text-[16px]"
              onClick={() => handleOptionClick('oldest')}
            >
              Oldest
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LedgerTableTopbar;
