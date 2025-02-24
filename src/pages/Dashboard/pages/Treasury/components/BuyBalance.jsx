import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../../../../../components/ui/Button';
import BuyBalancePopup from '../../../../../components/dialogue-boxes/BuyBalancePopup';
import showToast from '../../../../../components/ui/Toast';
import { getConstantsValues } from '../../../../../features/constants/constantsSlice';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'sonner';
import { setGuestSignUpDialogue } from '../../../../../features/extras/extrasSlice';

const BuyBalance = ({ triggerPulse }) => {
  const location = useLocation();
  const [fdx, setFdx] = useState('');
  const [dollar, setDollar] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const persistedContants = useSelector(getConstantsValues);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const conversionRate = persistedContants?.FDX_CONVERSION_RATE_WRT_USD;

  const handleClose = () => {
    localStorage.removeItem('scs');
    localStorage.removeItem('paymentMethod');
    setModalVisible(false);
  };

  const handleFdxChange = (e) => {
    const fdxValue = e.target.value;
    setFdx(fdxValue);
    if (fdxValue !== '' && fdxValue != 0) {
      setDollar((fdxValue * conversionRate).toFixed(2));
    } else {
      setDollar('');
    }
  };

  const handleDollarChange = (e) => {
    const dollarValue = e.target.value;
    setDollar(dollarValue);
    if (dollarValue !== '' && dollarValue != 0) {
      setFdx((dollarValue / conversionRate).toFixed(2));
    } else {
      setFdx('');
    }
  };

  const handleCreate = () => {
    if (persistedUserInfo?.role === 'guest' || persistedUserInfo?.role === 'visitor') {
      dispatch(setGuestSignUpDialogue(true));
      return;
    }
    if (dollar < 0.5) return toast.warning(`Minimum amount is 0.5$`);
    setModalVisible(true);
  };

  const getQueryParams = (query) => {
    return new URLSearchParams(query);
  };

  const queryParams = getQueryParams(location.search);
  const redirectStatus = queryParams.get('redirect_status');

  useEffect(() => {
    if (redirectStatus === 'succeeded') {
      setModalVisible(true);
    }
  }, [redirectStatus]);

  return (
    <>
      {modalVisible && (
        <BuyBalancePopup
          handleClose={handleClose}
          modalVisible={modalVisible}
          title={'Buy Balance'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/buyBalancelogo.svg`}
          dollar={dollar}
          triggerPulse={triggerPulse}
        />
      )}
      <div>
        <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
          <div className="flex items-center gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/your-fdx.svg`}
              alt={'your-fdx'}
              className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
            />
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">My Balance</h1>
          </div>
          <h1 className="text-[14px] font-normal leading-[114%] text-white tablet:text-[18px] tablet:leading-[88%]">
            {persistedUserInfo?.balance?.toFixed(2)}
          </h1>
        </div>
        <div className="rounded-b-[10px] border-gray-250 bg-[#FDFDFD] px-5 py-[10px] tablet:border-[1.85px] tablet:py-[18.73px]">
          <h1 className="text-gray-1 text-[12px] font-semibold leading-[113%] tablet:text-[16px] tablet:leading-normal">
            Need more FDX?
          </h1>
          <p className="text-gray-1 mt-[10px] text-[9px] font-normal leading-[113%] tablet:text-[16px] tablet:font-medium tablet:leading-normal">
            You can purchase more FDX from the Foundation treasury.
          </p>
          <div className="mt-3 flex flex-col items-center justify-center gap-[6px] tablet:mt-5 tablet:gap-3">
            <div className="flex w-full items-center justify-center gap-2 tablet:gap-6">
              <h1 className="text-gray-1 text-[9px] font-semibold leading-[113%] tablet:text-[20px] tablet:leading-normal">
                FDX
              </h1>
              <input
                type="number"
                placeholder="e.g 10"
                value={fdx}
                onChange={handleFdxChange}
                className="w-full max-w-[217px] rounded-[3.204px] border-[1.358px] border-white-500 bg-[#F9F9F9] px-2 py-[4.5px] text-[9.053px] font-semibold leading-normal focus:outline-none tablet:max-w-[480px] tablet:rounded-[7px] tablet:border-[3px] tablet:px-4 tablet:py-[10px] tablet:text-[20px]"
              />
            </div>
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/buy-fdx-swap-icon.svg`}
              alt="buy-fdx-swap-icon"
              className="h-[10px] w-[14px] tablet:h-[26px] tablet:w-[36px]"
            />
            <div className="flex w-full items-center justify-center gap-2 tablet:gap-6">
              <h1 className="text-gray-1 w-[3ch] text-[9px] font-semibold leading-[113%] tablet:text-[20px] tablet:leading-normal">
                $
              </h1>
              <input
                type="number"
                placeholder="e.g 1"
                value={dollar}
                onChange={handleDollarChange}
                className="w-full max-w-[217px] rounded-[3.204px] border-[1.358px] border-white-500 bg-[#F9F9F9] px-2 py-[4.5px] text-[9.053px] font-semibold leading-normal focus:outline-none tablet:max-w-[480px] tablet:rounded-[7px] tablet:border-[3px] tablet:px-4 tablet:py-[10px] tablet:text-[20px]"
              />
            </div>
          </div>
          <div className="mt-3 flex w-full justify-center tablet:mb-2 tablet:mt-6">
            {/* <Button variant={'submit'} onClick={handleCreate}>
              Buy More FDX
            </Button> */}
            {dollar * 1 < 0.5 ? (
              <Button variant="submit-hollow" onClick={handleCreate}>
                Buy More FDX
              </Button>
            ) : (
              <Button variant="submit" onClick={handleCreate}>
                {/* {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Add'} */}
                Buy More FDX
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BuyBalance;
