import { useEffect, useState } from 'react';
import { Button } from '../../../../../../components/ui/Button';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import ABI from '../../../../../../contracts/TokenTransfer/TokenTransfer.json';
import { useSDK } from '@metamask/sdk-react';
import Web3 from 'web3';
import SummaryCard from '../../../../../../components/SummaryCard';
import ConfirmWithdrawDialogue from './ConfirmWithdrawDialogue';
import { useMutation } from '@tanstack/react-query';
import { fetchFeeBalance, widthrawFdx } from '../../../../../../services/api/widthrawls';
import showToast from '../../../../../../components/ui/Toast';

export default function WithdrawBalance() {
  const [amount, setAmount] = useState(0);
  const [confirmWithdraw, setConfirmWithdraw] = useState(false);
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const { sdk, connected, connecting, provider, chainId } = useSDK();
  const [txFee, setTxFee] = useState(false);

  const { mutateAsync: createWidthrawl } = useMutation({
    mutationFn: widthrawFdx,
    onSuccess: async (response) => {
      showToast('success', 'widthrawlSuccessful');
      console.log(response);
    },
    onError: (err: any) => {
      console.log(err);

      showToast('error', 'error', {}, err?.response?.data?.message);
    },
  });

  const { mutateAsync: checkFeeInitial } = useMutation({
    mutationFn: fetchFeeBalance,
    onSuccess: async (response) => {
      setTxFee(response?.data?.feeByFoundation);
      console.log(response?.data);
    },
    onError: (err: any) => {
      console.log(err);

      showToast('error', 'error', {}, err?.response?.data?.message);
    },
  });

  const { mutateAsync: checkFee } = useMutation({
    mutationFn: fetchFeeBalance,
    onSuccess: async (response) => {
      setTxFee(response?.data?.feeByFoundation);
      if (response?.data?.issuerBalance > amount) {
        handleWithdraw(response?.data?.feeByFoundation);
      }
    },
    onError: (err: any) => {
      console.log(err);

      showToast('error', 'error', {}, err?.response?.data?.message);
    },
  });

  const toAddress = persistedUserInfo?.badges?.find((badge: any) => badge?.web3?.hasOwnProperty('etherium-wallet'))
    ?.web3['etherium-wallet'];

  const handleFdxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fdxValue = parseFloat(e.target.value);
    setAmount(fdxValue);
  };

  const checkWeb3Badge = () =>
    persistedUserInfo?.badges?.some((badge: any) => badge?.web3?.hasOwnProperty('etherium-wallet') || false) || false;

  function stringifyBigInt(obj: any) {
    return JSON.stringify(obj, (key, value) => (typeof value === 'bigint' ? value.toString() : value));
  }

  const handleWithdraw = async (feeByFoundation: boolean) => {
    if (!checkWeb3Badge()) {
      toast.warning('Please add Ethereum badge first!');
      return;
    }

    if (amount <= 0 || Number.isNaN(amount)) {
      toast.warning('Please enter a valid value');
      return;
    }

    if (amount > persistedUserInfo?.balance) {
      toast.warning('Insufficient balance');
      return;
    }

    try {
      let transaction;
      if (!feeByFoundation) {
        const accounts = (await sdk?.connect()) as string[] | null;

        if (!accounts || accounts.length === 0) {
          toast.error('No accounts found. Please connect your wallet.');
          return;
        }

        if (connected && provider) {
          const web3 = new Web3(provider);
          const contract = new web3.eth.Contract(ABI, import.meta.env.VITE_TRANSFERTOKEN_AGREEMENT);

          // Convert amount value to Wei
          const amountInWei = web3.utils.toWei(amount.toString(), 'ether');

          // Calling the transferTokens method on the contract
          const transaction = await contract.methods
            .transferTokens(import.meta.env.VITE_DEPLOYER_ACCOUNT, toAddress, amountInWei)
            .send({
              from: accounts[0],
            });

          console.log({ transaction });
        } else {
          toast.error('Please install metamask first');
        }
      }

      createWidthrawl({
        uuid: persistedUserInfo?.uuid,
        amount: amount,
        data: stringifyBigInt(transaction),
        from: import.meta.env.VITE_DEPLOYER_ACCOUNT,
        to: toAddress,
        feesPaid: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const closeConfirmWithdraw = () => {
    setConfirmWithdraw(false);
  };

  return (
    <SummaryCard headerIcon="/assets/svgs/crypto-withdraw.svg" headerTitle="Crypto Withdraw">
      <div className="flex flex-col gap-[10px] text-[#707175] tablet:gap-[25px]">
        <div className="flex flex-col gap-2 tablet:gap-[15px]">
          <p className="min-w-[120px] text-[12px] font-semibold leading-[113%] tablet:min-w-[180px] tablet:text-[18px] tablet:leading-normal">
            Token Name
          </p>
          <input
            type="text"
            value="FDX"
            disabled
            className="w-full rounded-[8.62px] border border-white-500 bg-[#FBFBFB] px-[12px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#707175] focus:outline-none dark:border-gray-100 dark:bg-accent-100 dark:text-gray-300 tablet:rounded-[10px] tablet:border-[3px] tablet:px-[28px] tablet:py-3 tablet:text-[18px] tablet:leading-[21px]"
          />
        </div>
        <div className="flex flex-col gap-2 tablet:gap-[15px]">
          <p className="min-w-[120px] text-[12px] font-semibold leading-[113%] tablet:min-w-[180px] tablet:text-[18px] tablet:leading-normal">
            Withdraw to
          </p>
          <p className="min-w-[120px] text-[12px] font-semibold leading-[113%] text-gray-1 tablet:min-w-[180px] tablet:text-[18px] tablet:leading-normal">
            Address
          </p>
          <input
            type="text"
            value={toAddress}
            disabled
            className="w-full rounded-[8.62px] border border-white-500 bg-[#FBFBFB] px-[12px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#707175] focus:outline-none dark:border-gray-100 dark:bg-accent-100 dark:text-gray-300 tablet:rounded-[10px] tablet:border-[3px] tablet:px-[28px] tablet:py-3 tablet:text-[18px] tablet:leading-[21px]"
          />
        </div>
        <div className="flex flex-col gap-2 tablet:gap-[15px]">
          <p className="min-w-[120px] text-[12px] font-semibold leading-[113%] text-gray-1 tablet:min-w-[180px] tablet:text-[18px] tablet:leading-normal">
            Withdrawal Network
          </p>
          <input
            type="text"
            value="Base"
            disabled
            className="w-full rounded-[8.62px] border border-white-500 bg-[#FBFBFB] px-[12px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#707175] focus:outline-none dark:border-gray-100 dark:bg-accent-100 dark:text-gray-300 tablet:rounded-[10px] tablet:border-[3px] tablet:px-[28px] tablet:py-3 tablet:text-[18px] tablet:leading-[21px]"
          />
        </div>
        <div className="flex flex-col gap-2 tablet:gap-[15px]">
          <p className="min-w-[120px] text-[12px] font-semibold leading-[113%] text-gray-1 tablet:min-w-[180px] tablet:text-[18px] tablet:leading-normal">
            Amount Withdraw
          </p>
          <div className="flex items-center gap-5">
            <div className="relative w-full max-w-[380px]">
              <input
                type="number"
                value={amount}
                onChange={handleFdxChange}
                className="w-full rounded-[8.62px] border border-white-500 bg-[#FBFBFB] px-[12px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#707175] focus:outline-none dark:border-gray-100 dark:bg-accent-100 dark:text-gray-300 tablet:rounded-[10px] tablet:border-[3px] tablet:px-[28px] tablet:py-3 tablet:text-[18px] tablet:leading-[21px]"
              />
              <div className="absolute flex w-full justify-between gap-2 tablet:gap-[15px]">
                <p className="whitespace-nowrap text-[10px] font-normal leading-[113%] tablet:text-[18px] tablet:leading-normal">
                  Remaining Amount
                </p>
                <p className="whitespace-nowrap text-[10px] font-normal leading-[113%] tablet:text-[18px] tablet:leading-normal">
                  {Number(persistedUserInfo?.balance || 0) - Number(amount || 0)} FDX
                </p>
              </div>
            </div>
            <p className="text-nowrap text-end text-[9px] font-semibold leading-[113%] text-green-200 tablet:text-[15px] tablet:leading-[15px]">
              Available Amount = {persistedUserInfo.balance.toFixed(2)} FDX
            </p>
          </div>
        </div>
        <Button
          variant={amount > 0 ? 'submit' : 'hollow-submit'}
          type={'submit'}
          disabled={checkWeb3Badge() && amount > 0 ? false : true}
          onClick={() => {
            checkFeeInitial();
            setConfirmWithdraw(true);
          }}
          className="max-w-1/2 tablet:max-w-1/2 mx-auto mt-[10px] w-1/2 tablet:mt-[25px] tablet:min-w-[50%]"
        >
          Withdraw
        </Button>
      </div>
      {confirmWithdraw && (
        <ConfirmWithdrawDialogue
          handleClose={closeConfirmWithdraw}
          modalVisible={confirmWithdraw}
          title={'Confirm Withdrawal'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/confirm-withdraw.svg`}
          handleWithdraw={checkFee}
          address={toAddress}
          amount={amount}
          remainingAmount={Number(persistedUserInfo?.balance || 0) - Number(amount || 0)}
          txFee={txFee}
        />
      )}
    </SummaryCard>
  );
}
