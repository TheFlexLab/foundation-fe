import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const PopUp = ({
  open,
  handleClose,
  children,
  customStyle,
  customClasses,
  logo,
  title,
  closeIcon,
  isBackground,
  remove,
  autoSize,
}) => {
  const defaultStyle = {
    boxShadow: 'none',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  const mergedStyle = { ...defaultStyle, ...customStyle };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={mergedStyle}
        className={`${customClasses} z-[1000] max-h-[90vh] w-full min-w-[334px] max-w-[87vw] overflow-y-auto border-none outline-none no-scrollbar tablet:w-[90vw] tablet:max-w-[676px] laptop:w-full laptop:max-w-[845px]`}
      >
        <div className="bg-blue-gradient flex items-center justify-between rounded-t-[9.76px] px-[15px] py-1 dark:border dark:border-gray-100 tablet:rounded-t-[26px] tablet:px-[30px] tablet:py-2">
          <div className="flex items-center gap-[10px] tablet:gap-[17px]">
            <div className={` ${isBackground ? 'rounded-full bg-white p-1 tablet:p-2' : ''} `}>
              <img
                src={logo}
                alt="logo"
                className={`${autoSize ? 'size-[15px] tablet:size-auto' : 'h-6 w-6 tablet:h-[50px] tablet:w-[50px]'} rounded-full`}
              />
            </div>
            <p className="text-[12px] font-bold text-white tablet:text-[25px] tablet:font-medium">{title}</p>
          </div>
          {!closeIcon && (
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/preferences/close.png`}
              alt="close"
              className="h-[10px] w-[10px] cursor-pointer tablet:h-[22.7px] tablet:w-[22px]"
              onClick={handleClose}
            />
          )}
        </div>
        <div className="rounded-b-[9.76px] bg-white dark:border dark:border-gray-100 dark:bg-gray-200 tablet:rounded-b-[26px]">
          {children}
        </div>
      </Box>
    </Modal>
  );
};

export default PopUp;
