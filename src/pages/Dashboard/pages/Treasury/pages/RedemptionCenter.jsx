import { FaPlus, FaMinus } from 'react-icons/fa6';
import { Button } from '../../../../../components/ui/Button';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addRedeemCode,
  createRedeeemCode,
  getHistoryData,
  getUnredeemedData,
} from '../../../../../services/api/redemptionApi';
import { FaSpinner } from 'react-icons/fa';
import DeleteHistoryPopup from '../../../../../components/dialogue-boxes/deleteHistoryPopup';
import showToast from '../../../../../components/ui/Toast';
import { formatDate } from '../../../../../utils/utils';
import usePulse from '../../../../../hooks/usePulse';
import { setGuestSignUpDialogue } from '../../../../../features/extras/extrasSlice';

export default function RedemptionCenter() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [fdx, setFdx] = useState(0);
  const [description, setDescription] = useState('');
  const [expiry, setExpiry] = useState('30 days');
  const [code, setCode] = useState('');
  const [isPulse, setIsPulse] = useState(false);
  const [addCodeLoading, setAddCodeLoading] = useState(false);
  const [radeemLoading, setRadeemLoading] = useState('');
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [deleteHistoryCode, setDeleteHistoryCode] = useState(false);
  const [createRadeemPulse, triggerCreateRadeemPulse] = usePulse(5000);

  const handleClose = () => setIsDeleteModal(false);

  const { mutateAsync: createRedemptionCode, isPending: createPending } = useMutation({
    mutationFn: createRedeeemCode,
    onSuccess: (resp) => {
      showToast('success', 'redemptionCreated');
      queryClient.invalidateQueries(['userInfo']);
      queryClient.invalidateQueries('unredeemedData');
      triggerCreateRadeemPulse();
      setExpiry('30 days');
      setDescription('');
      setFdx(0);
    },
    onError: (err) => {
      showToast('error', 'error', {}, err.response.data.message.split(':')[1]);
    },
  });

  useEffect(() => {
    const url = window.location.href;
    // const extractedCode = url.substring(url.lastIndexOf('/') + 1);
    const extractedCode = new URL(url).pathname;
    if (extractedCode !== '/treasury/redemption-center') {
      const parts = extractedCode.split('/');
      const extractedText = parts[2];
      setCode(extractedText);
      setTimeout(() => {
        if (extractedText) showToast('info', 'redeemAdd');
      }, 500);
    }
  }, []);

  const handleShareLink = async (code) => {
    const url = window.location.href + '/' + code;
    try {
      await navigator.clipboard.writeText(url);
    } catch (err) {
      console.error('Unable to copy text to clipboard:', err);
    }
  };

  const copyToClipboard = async (code) => {
    const textToCopy = code;

    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (err) {
      console.error('Unable to copy text to clipboard:', err);
    }
  };

  const { mutateAsync: addRedemptionCode } = useMutation({
    mutationFn: addRedeemCode,
    onSuccess: (resp) => {
      queryClient.invalidateQueries(['userInfo']);
      queryClient.invalidateQueries('history');
      showToast('success', 'redemptionSuccessful');
      setCode('');
      setIsPulse(true);
      setAddCodeLoading(false);
      setRadeemLoading('');
    },
    onError: (err) => {
      setAddCodeLoading(false);
      setRadeemLoading('');
      showToast('error', 'error', {}, err.response.data.message.split(':')[1]);
    },
  });

  // const { mutateAsync: redeem } = useMutation({
  //   mutationFn: redeemCode,
  //   onSuccess: (resp) => {
  //     queryClient.invalidateQueries('unredeemedData');
  //     toast.success('Code Redeemed Successfully');
  //     setCode('');
  //   },
  //   onError: (err) => {
  //     toast.error(err.response.data.message.split(':')[1]);
  //   },
  // });

  const { data: unredeemedData } = useQuery({
    queryFn: async () => {
      return await getUnredeemedData(persistedUserInfo._id, persistedUserInfo.uuid);
    },
    queryKey: ['unredeemedData'],
  });

  const { data: history } = useQuery({
    queryFn: async () => {
      return await getHistoryData(persistedUserInfo._id, persistedUserInfo.uuid);
    },
    queryKey: ['history'],
  });

  const handleAdd = () => {
    if (persistedUserInfo?.role === 'guest' || persistedUserInfo?.role === 'visitor') {
      dispatch(setGuestSignUpDialogue(true));
      return;
    } else {
      if (code === '') return showToast('warning', 'enterCode');
      setAddCodeLoading(true);

      const params = {
        uuid: persistedUserInfo?.uuid,
        code: code,
      };
      addRedemptionCode(params);
    }
  };

  const handleRedeeem = (code) => {
    if (code === '') return showToast('warning', 'enterCode');
    setRadeemLoading(code);

    const params = {
      uuid: persistedUserInfo?.uuid,
      code: code,
    };
    addRedemptionCode(params);
  };

  const handleCreate = () => {
    if (persistedUserInfo?.role === 'guest' || persistedUserInfo?.role === 'visitor') {
      dispatch(setGuestSignUpDialogue(true));
      return;
    } else {
      if (fdx === 0) return showToast('warning', 'selectAmount');
      if (description === '') return showToast('warning', 'emptyPostDescription');
      let newExpiryDate;

      if (expiry === '30 days') {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 30);
        newExpiryDate = currentDate.toISOString().split('T')[0];
      } else if (expiry === '7 days') {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 7);
        newExpiryDate = currentDate.toISOString();
      } else {
        newExpiryDate = null;
      }

      const params = {
        creator: persistedUserInfo._id,
        owner: persistedUserInfo._id,
        uuid: persistedUserInfo.uuid,
        amount: fdx,
        description: description,
        to: 'any',
        expiry: newExpiryDate,
      };

      createRedemptionCode(params);
    }
  };

  // const calculateExpiry = (expiry) => {
  //   if (expiry) {
  //     const targetDate = new Date(expiry);
  //     const currentDate = new Date();
  //     // Calculate the difference in milliseconds
  //     const differenceMs = targetDate - currentDate;
  //     // Convert milliseconds to days
  //     const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

  //     return differenceDays + ' ' + 'days'; // Output the difference in days
  //   } else {
  //     return 'Never';
  //   }
  // };

  useEffect(() => {
    if (isPulse) {
      const timer = setTimeout(() => {
        setIsPulse(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isPulse]);

  return (
    <div className="mx-auto mb-4 flex max-w-[778px] flex-col gap-3 px-4 tablet:mb-8 tablet:gap-6 tablet:px-6">
      {/* Create */}
      <div>
        <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
          <div className="flex items-center gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/redemption-code-activity.svg`}
              alt={'redemption-code-activity'}
              className="h-[18.5px] w-[15px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
            />
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">
              Create Redemption Code
            </h1>
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-b-[10px] border-gray-250 bg-[#FDFDFD] px-5 py-[10px] tablet:gap-[15px] tablet:border-[1.85px] tablet:px-12 tablet:py-[18.73px]">
          <input
            type="text"
            value={description}
            onChange={(e) => {
              if (e.target.value.length <= 35) {
                setDescription(e.target.value);
              }
            }}
            placeholder="Description here....."
            className="w-full max-w-[368px] rounded-[2.76px] border-[1.17px] border-white-500 bg-[#F9F9F9] p-1 text-[10px] font-medium leading-normal text-[#707175] focus:outline-none tablet:rounded-[7.07px] tablet:border-[3px] tablet:px-4 tablet:py-3 tablet:text-[16px]"
          />
          <p className="text-gray-1 text-[7.5px] font-normal leading-normal tablet:text-[14.7px]">
            Create FDX and maximize your access to all features.
          </p>
          <div className="flex items-center gap-5 tablet:gap-6">
            <h2 className="text-gray-1 text-[10px] font-semibold leading-normal tablet:text-[20px]">FDX</h2>
            <div className="text-gray-1 flex w-full max-w-[70px] items-center justify-between rounded-[2.76px] border-[1.17px] border-white-500 bg-[#F9F9F9] px-[6px] py-[3px] tablet:max-w-[124px] tablet:rounded-[7px] tablet:border-[3px] tablet:px-[18px] tablet:py-2">
              <FaMinus
                className="w-[7px] cursor-pointer tablet:w-[23px]"
                onClick={() => {
                  if (fdx * 1 - 1 > 0) setFdx(fdx - 1);
                  else setFdx(0);
                }}
              />
              <input
                type="number"
                className="hide-input-arrows text-gray-1 w-full bg-transparent text-center text-[10px] font-semibold leading-normal focus:outline-none tablet:text-[20px]"
                value={fdx === 0 ? '' : fdx}
                placeholder="0"
                onChange={(e) => {
                  let x = parseFloat(e.target.value);
                  if (!isNaN(x)) {
                    x = Math.round(x * 100) / 100;
                    if (Number.isInteger(x)) {
                      setFdx(x.toString());
                    } else {
                      setFdx(x);
                    }
                  } else {
                    setFdx(0);
                  }
                }}
              />

              <FaPlus
                className="w-[7px] cursor-pointer tablet:w-[23px]"
                onClick={() => {
                  if (persistedUserInfo.balance - 1 > fdx) {
                    setFdx(fdx * 1 + 1);
                  } else {
                    setFdx(fdx * 1 + (Math.floor(persistedUserInfo.balance) - fdx));
                  }
                }}
              />
            </div>
          </div>
          <div className="flex w-full justify-center">
            <Button variant={'submit'} onClick={handleCreate}>
              {createPending === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Create'}
            </Button>
          </div>
        </div>
      </div>
      {/* Add  */}
      <div>
        <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
          <div className="flex items-center gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/add-redemption.svg`}
              alt={'add-redemption'}
              className="h-[18.5px] w-[18px] min-w-[14.6px] tablet:h-[29px] tablet:w-[27.8px]"
            />
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">
              Add Redemption Code
            </h1>
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-b-[10px] border-gray-250 bg-[#FDFDFD] px-5 py-[10px] tablet:gap-[15px] tablet:border-[1.85px] tablet:px-12 tablet:py-[18.73px]">
          <p className="text-gray-1 text-[7.5px] font-normal leading-normal tablet:text-[14.7px]">
            You can add redemption code and earn reworded coins
          </p>
          <div className="flex items-center gap-5 tablet:gap-6">
            <h2 className="text-gray-1 text-[10px] font-semibold leading-normal tablet:text-[20px]">Code</h2>
            <input
              type="text"
              placeholder="eg (rG57HK)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="text-gray-1 min-w-[80px] max-w-[80px] rounded-[2.76px] border-[1.17px] border-white-500 bg-[#F9F9F9] px-2 py-1 text-[7.8px] font-semibold leading-[7.8px] focus:outline-none tablet:min-w-[230px] tablet:max-w-[230px] tablet:rounded-[7.07px] tablet:border-[3px] tablet:py-2 tablet:text-[25px] tablet:leading-[25px]"
            />
          </div>
          <div className="flex w-full justify-center">
            <Button variant={'submit'} onClick={handleAdd}>
              {addCodeLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Add'}
            </Button>
          </div>
        </div>
      </div>
      {/* UnRedeemed Code */}
      <div>
        <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
          <div className="flex items-center gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/un-radeem.svg`}
              alt={'un-radeem'}
              className="h-[18.5px] w-[14.8px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
            />
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">
              Un-Redeemed Codes
            </h1>
          </div>
        </div>
        <div className="flex flex-col gap-[5px] rounded-b-[10px] border-gray-250 bg-[#FDFDFD] px-2 py-[10px] tablet:gap-[15px] tablet:border-[1.85px] tablet:px-4 tablet:py-[18.73px]">
          <div>
            {!unredeemedData || unredeemedData.data.data.length === 0 ? (
              <div className="rounded-[5.85px] border-[1.84px] border-gray-250 bg-white py-2 tablet:rounded-[15px] tablet:py-6">
                <p className="text-center text-[11px] font-medium leading-normal text-[#C9C8C8] tablet:text-[22px]">
                  Your have no un-redeemed codes
                </p>
              </div>
            ) : (
              <div>
                <div className="mx-3 mb-2 flex tablet:mx-3 tablet:mb-[9px] tablet:gap-5">
                  <div className="flex w-full items-center justify-start gap-[10px] tablet:gap-2 desktop:max-w-[422px]">
                    <p className="min-w-[65px] max-w-[65px] text-[10px] font-bold leading-normal text-[#707175] tablet:min-w-[105px] tablet:max-w-[105px] tablet:text-[18px] tablet:leading-[134.149%]">
                      Created
                    </p>
                    <p className="min-w-[65px] max-w-[65px] text-[10px] font-bold leading-normal text-[#707175] tablet:min-w-[105px] tablet:max-w-[105px] tablet:text-[18px] tablet:leading-[134.149%]">
                      Code
                    </p>
                    <p className="min-w-[95px] max-w-[95px] text-[10px] font-bold leading-normal text-[#707175] tablet:min-w-[140px] tablet:max-w-[140px] tablet:text-[18px]">
                      Description
                    </p>
                    <p className="min-w-[20px] max-w-[20px] text-[10px] font-bold leading-normal text-[#707175] tablet:min-w-12 tablet:max-w-12 tablet:text-[18px]">
                      FDX
                    </p>
                  </div>
                  <div className="hidden items-center tablet:gap-2 desktop:flex">
                    <p className="min-w-[51px] max-w-[51px] text-[10px] font-bold leading-normal text-[#707175] tablet:text-[18px] tablet:leading-[134.149%]">
                      Share
                    </p>
                    <p className="min-w-[95px] max-w-[95px] text-[10px] font-bold leading-normal text-[#707175] tablet:text-[18px]">
                      Copy
                    </p>
                    <p className="min-w-[20px] max-w-[20px] text-[10px] font-bold leading-normal text-[#707175] tablet:min-w-12 tablet:max-w-12 tablet:text-[18px]">
                      {' '}
                    </p>
                  </div>
                </div>
                <div className="rounded-[5.85px] border-[1.84px] border-gray-250 bg-white tablet:rounded-[10px]">
                  {unredeemedData?.data?.data?.map((item, index) => (
                    <div key={index + 1}>
                      <div
                        className={`flex flex-col justify-between gap-2 px-3 py-2 tablet:gap-5 tablet:px-3 tablet:py-[13.4px] laptop:items-center desktop:flex-row ${index === 0 && createRadeemPulse ? 'animate-pulse bg-[#EEF8EA] text-[#049952]' : 'text-[#707175]'}`}
                      >
                        <div className="flex w-full items-center justify-start gap-[10px] tablet:gap-2">
                          <p className="min-w-[65px] max-w-[65px] text-[10px] font-medium leading-normal text-[#707175] tablet:min-w-[105px] tablet:max-w-[105px] tablet:text-[16px]">
                            {formatDate(item.createdAt)}
                          </p>
                          <p className="min-w-[65px] max-w-[65px] text-[10px] font-medium leading-normal text-[#707175] tablet:min-w-[105px] tablet:max-w-[105px] tablet:text-[16px]">
                            {item.code}
                          </p>
                          <div className="flex items-center text-[10px] font-medium leading-normal text-[#707175] tablet:text-[16px]">
                            <div className="tooltip text-start" data-tip={item.description}>
                              <p className="min-w-[95px] max-w-[95px] truncate tablet:min-w-[140px] tablet:max-w-[140px]">
                                {item.description}
                              </p>
                            </div>
                          </div>
                          <p className="min-w-[20px] max-w-[20px] text-[10px] font-medium leading-normal text-[#707175] tablet:min-w-12 tablet:max-w-12 tablet:text-[16px]">
                            {item.amount}
                          </p>
                        </div>
                        <div className="flex w-full items-center justify-end gap-4 tablet:gap-2">
                          <div className="tablet:min-w-[51px] tablet:max-w-[51px]">
                            <img
                              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/sharelink.svg`}
                              alt="copy"
                              className="h-3 w-3 cursor-pointer tablet:h-[23px] tablet:w-[23px]"
                              onClick={() => {
                                handleShareLink(item.code);
                                showToast('success', 'shareLinkCopied');
                              }}
                            />
                          </div>
                          <div className="tablet:min-w-[46.2px] tablet:max-w-[46.2px]">
                            <img
                              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/copy.svg`}
                              alt="copy"
                              className="h-3 w-3 cursor-pointer tablet:h-[23px] tablet:w-[23px]"
                              onClick={() => {
                                copyToClipboard(item.code);
                                showToast('success', 'codeCopied');
                              }}
                            />
                          </div>
                          <Button
                            variant="result"
                            className={'max-w-[124px] tablet:max-h-[37px] tablet:max-w-[115px]'}
                            onClick={() => handleRedeeem(item.code)}
                          >
                            {radeemLoading === item.code ? (
                              <FaSpinner className="animate-spin text-[#EAEAEA]" />
                            ) : (
                              'Redeem'
                            )}
                          </Button>
                        </div>
                      </div>
                      {index !== unredeemedData?.data?.data.length - 1 && (
                        <div className="mx-[7px] h-[1.84px] rounded-md bg-[#EEE] tablet:mx-6" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Referral code activity */}
      <div>
        <DeleteHistoryPopup
          isDeleteModal={isDeleteModal}
          handleClose={handleClose}
          deleteHistoryCode={deleteHistoryCode}
        />
        <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A8DBD] px-5 py-[10px]">
          <div className="flex items-center gap-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/raferral-code-activity.svg`}
              alt={'raferral-code-activity'}
              className="h-[18.5px] w-[14.6px] min-w-[14.6px] tablet:h-[40.714px] tablet:w-[32.134px] tablet:min-w-[32.134px] laptop:h-[29px] laptop:w-[22.888px] laptop:min-w-[22.888px]"
            />
            <h1 className="text-[12px] font-medium text-white tablet:text-[18px] tablet:font-normal">
              Redemption Code Activity
            </h1>
          </div>
        </div>

        <div className="flex flex-col gap-[5px] rounded-b-[10px] border-gray-250 bg-[#FDFDFD] px-2 py-[10px] tablet:gap-[15px] tablet:border-[1.85px] tablet:px-[15.5px] tablet:py-[18.73px]">
          {!history || history.data.data.length === 0 ? (
            <div className="rounded-[5.85px] border-[1.84px] border-gray-250 bg-white py-2 tablet:rounded-[15px] tablet:py-6">
              <p className="text-center text-[11px] font-medium leading-normal text-[#C9C8C8] tablet:text-[22px]">
                You have no records.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-[5px] rounded-b-[10px] bg-[#FDFDFD] tablet:gap-[15px]">
              <div>
                <div className="mx-3 mb-2 flex items-center justify-between tablet:mx-5 tablet:mb-[13px]">
                  <div className="grid w-full grid-cols-4 gap-[10px] tablet:gap-5">
                    <p className="text-[10px] font-medium leading-normal text-[#707175] tablet:text-[18px] tablet:font-bold tablet:leading-[120%]">
                      Redeemed
                    </p>
                    <p className="text-[10px] font-medium leading-normal text-[#707175] tablet:text-[18px] tablet:font-bold tablet:leading-[120%]">
                      Code
                    </p>
                    <p className="text-[10px] font-medium leading-normal text-[#707175] tablet:text-[18px] tablet:font-bold tablet:leading-[120%]">
                      Description
                    </p>
                    <p className="text-[10px] font-medium leading-normal text-[#707175] tablet:text-[18px] tablet:font-bold tablet:leading-[120%]">
                      FDX
                    </p>
                  </div>
                </div>
                <div className="rounded-[5.85px] border-[1.84px] border-gray-250 bg-white tablet:rounded-[15px]">
                  {history?.data?.data
                    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    ?.map((item, index) => (
                      <div
                        key={item._id}
                        className={`flex w-full justify-between gap-2 px-3 py-2 tablet:h-[112px] tablet:gap-4 tablet:px-5 tablet:py-5 laptop:h-[57px] laptop:flex-row laptop:items-center laptop:gap-0 ${index !== history?.data?.data?.length - 1 && 'border-b-[1.84px] border-gray-250'} ${index === 0 && isPulse ? 'animate-pulse bg-[#EEF8EA] text-[#049952]' : 'text-[#707175]'}`}
                      >
                        <div className="grid w-full grid-cols-4 gap-[10px] tablet:gap-5">
                          <p className="text-[10px] font-medium leading-normal tablet:min-w-[152px] tablet:max-w-[152px] tablet:text-[16px]">
                            {formatDate(item.createdAt)}
                          </p>
                          <p className="text-[10px] font-medium leading-normal tablet:min-w-[152px] tablet:max-w-[152px] tablet:text-[16px]">
                            {item.code}
                          </p>
                          <div className="tooltip text-start" data-tip={item.description}>
                            <p className="truncate text-start text-[10px] font-medium leading-normal tablet:min-w-[152px] tablet:max-w-[152px] tablet:text-[16px]">
                              {item.description}
                            </p>
                          </div>
                          <p className="text-[10px] font-medium leading-normal tablet:min-w-[152px] tablet:max-w-[152px] tablet:text-[16px]">
                            {item.amount}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
