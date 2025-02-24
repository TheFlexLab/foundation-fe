import PopUp from '../../../../../../components/ui/PopUp';
import { FaSpinner } from 'react-icons/fa';
import { Button } from '../../../../../../components/ui/Button';

type ClearAllAnalyticsProps = {
  handleClose: () => void;
  modalVisible: boolean;
  title: string;
  image: string;
  handleWithdraw: () => void;
  amount: number;
  remainingAmount: number;
  txFee: boolean;
  address: string;
};

export default function ConfirmWithdrawDialogue({
  handleClose,
  modalVisible,
  title,
  image,
  handleWithdraw,
  address,
  amount,
  remainingAmount,
  txFee,
}: ClearAllAnalyticsProps) {
  return (
    <PopUp
      logo={image}
      title={title}
      open={modalVisible}
      handleClose={handleClose}
      autoSize={false}
      closeIcon={null}
      customClasses={''}
      customStyle={''}
      remove={false}
      isBackground={false}
    >
      <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
        <h1 className="text-[10px] leading-[12px] text-gray-1 dark:text-gray-300 tablet:text-[18px] tablet:leading-[25px]">
          Please carefully review all your details. Once confirmed, no further changes can be made. Click "Confirm
          Withdrawal" to finalize your action.
        </h1>
        <div className="mb-[15px] mt-10 flex justify-between">
          <div className="flex-col">
            <h1 className="text-[10px] leading-[12px] text-gray-1 dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
              Address
            </h1>
            <h1 className="text-[10px] leading-[12px] text-gray-1 dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
              Network
            </h1>
            <h1 className="text-[10px] leading-[12px] text-gray-1 dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
              Withdrawal Amount
            </h1>
            <h1 className="text-[10px] leading-[12px] text-gray-1 dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
              Remaining Amount
            </h1>
            <h1 className="text-[10px] leading-[12px] text-gray-1 dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
              Transaction Fee
            </h1>
            {/* <h1 className="text-gray-1 text-[10px] leading-[12px] dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
              Source
            </h1> */}
          </div>
          <div className="flex-col">
            <h1 className="text-[10px] leading-[12px] text-gray-1 dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
              {address}
            </h1>
            <h1 className="text-[10px] leading-[12px] text-gray-1 dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
              Base
            </h1>
            <h1 className="text-[10px] leading-[12px] text-gray-1 dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
              {amount}
            </h1>
            <h1 className="text-[10px] leading-[12px] text-gray-1 dark:text-gray-300 tablet:text-[18px] tablet:leading-normal">
              {remainingAmount}
            </h1>

            <h1
              className={`${txFee ? 'text-green-200' : 'text-[#F93838]'} text-gray-150 text-[10px] leading-[12px] dark:text-gray-300 tablet:text-[18px] tablet:leading-normal`}
            >
              {txFee ? 'No fee applied' : 'Applied'}
            </h1>
          </div>
        </div>
        <p className="text-start text-[10px] font-medium italic leading-[12px] text-[#F93838] tablet:text-[15px] tablet:leading-[25px]"></p>
        <p className="text-center text-[10px] font-medium italic leading-[12px] text-[#F93838] tablet:text-[15px] tablet:leading-[25px]">
          Note: Please verify that the wallet address is correct and on the same network. If the information is
          incorrect, your payment could be permanently lost.
        </p>
        <div className="mt-[25px] flex justify-center">
          {/* disabled={isPending} */}
          {/* {isPending ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Yes'} */}
          <Button variant={'submit'} onClick={handleWithdraw}>
            Confirm Withdrawal
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
