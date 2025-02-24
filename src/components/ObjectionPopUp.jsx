import { Button } from './ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import PopUp from './ui/PopUp';
import { getConstantsValues } from '../features/constants/constantsSlice';
import { setGuestSignUpDialogue } from '../features/extras/extrasSlice';

export default function ObjectionPopUp({ modalVisible, handleClose, handleContendChange, option }) {
  const dispatch = useDispatch();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedContants = useSelector(getConstantsValues);

  return (
    <PopUp
      logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon19.svg`}
      title={'Object Option'}
      open={modalVisible}
      handleClose={handleClose}
    >
      <div className="px-[17px] py-[10px] tablet:px-[80px] tablet:py-[25px]">
        <h1 className="text-gray-1 text-[10px] font-medium leading-[12px] dark:text-gray-300 tablet:text-[20px] tablet:leading-[24.2px]">
          Are you sure you want to object to this option:
        </h1>
        <p className="mt-2 text-center text-[11px] font-semibold leading-[12.5px] text-[#707175] tablet:mt-[14px] tablet:text-[22px] tablet:leading-[25.63px]">
          "{option}"
        </p>
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[26px] tablet:gap-[34px]">
          <Button
            variant="submit"
            onClick={() => {
              if (persistedUserInfo?.role === 'guest' || persistedUserInfo?.role === 'visitor') {
                dispatch(setGuestSignUpDialogue(true));
                return;
              } else {
                handleContendChange(true);
                handleClose();
              }
            }}
          >
            Object{' '}
            <span className="pl-1 text-[6px] leading-[0px] tablet:pl-2 tablet:text-[15px]">
              (-{persistedContants?.QUEST_OPTION_CONTENTION_GIVEN_AMOUNT} FDX)
            </span>
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleContendChange(false);
              handleClose();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
