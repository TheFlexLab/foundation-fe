import { toast } from 'sonner';
import { Button } from '../ui/Button';
import showToast from '../ui/Toast'
const EmbedeDialogue = ({ handleClose, setIsShowPreview, url, setUrl }) => {
  const validate = () => {
    if (url !== '') {
      handleClose();
      setIsShowPreview(true);
    } else {
      showToast('error', 'emptyUrl')
    }
  };
  return (
    <div className="relative w-[90vw] laptop:w-[52.6rem]">
      <div className="social-blue-gradiant relative flex items-center gap-[10px] rounded-t-[9.251px] px-[15px] py-1 tablet:gap-4 tablet:rounded-t-[26px] tablet:px-[30px] tablet:py-[8px]">
        <div className="w-fit rounded-full bg-white p-[5px] tablet:p-[10px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 31 30"
            fill="none"
            className="h-[14px] w-[14px] tablet:h-[31px] tablet:w-[31px]"
          >
            <path
              d="M24.7022 28.1248H11.1396C9.98347 28.1248 8.87465 27.6803 8.05711 26.8891C7.23956 26.0979 6.78027 25.0249 6.78027 23.906V10.781C6.78027 9.66213 7.23956 8.58907 8.05711 7.7979C8.87465 7.00673 9.98347 6.56226 11.1396 6.56226H24.7022C25.8583 6.56226 26.9672 7.00673 27.7847 7.7979C28.6022 8.58907 29.0615 9.66213 29.0615 10.781V23.906C29.0615 25.0249 28.6022 26.0979 27.7847 26.8891C26.9672 27.6803 25.8583 28.1248 24.7022 28.1248Z"
              fill="#707175"
            />
            <path
              d="M9.68847 4.68799H23.9703C23.6689 3.86606 23.112 3.15452 22.3762 2.65097C21.6404 2.14742 20.7616 1.87654 19.8603 1.87549H6.29785C5.14167 1.87549 4.03285 2.31996 3.21531 3.11113C2.39777 3.9023 1.93848 4.97536 1.93848 6.09424V19.2192C1.93956 20.0914 2.21947 20.9418 2.73981 21.6539C3.26014 22.366 3.9954 22.9049 4.84473 23.1966V9.37549C4.84473 8.13228 5.35505 6.94 6.26343 6.06092C7.17181 5.18185 8.40383 4.68799 9.68847 4.68799Z"
              fill="#707175"
            />
          </svg>
        </div>
        <p className="text-[12px] font-bold text-white tablet:text-[20px] tablet:font-medium">Embeded Post</p>
        <div
          className="absolute right-[12px] top-1/2 -translate-y-1/2 cursor-pointer tablet:right-[26px]"
          onClick={handleClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 23 23"
            fill="none"
            className="h-[10px] w-[10px] tablet:h-[23px] tablet:w-[23px]"
          >
            <path
              d="M0.742781 4.71145C-0.210937 3.77788 -0.251625 2.22222 0.651895 1.23678C1.55542 0.251347 3.06101 0.209303 4.01472 1.14287L10.9221 7.9044L17.466 0.76724C18.3696 -0.218195 19.8751 -0.260239 20.8289 0.673332C21.7826 1.6069 21.8233 3.16257 20.9197 4.148L14.3759 11.2852L21.2833 18.0467C22.237 18.9803 22.2777 20.5359 21.3742 21.5213C20.4706 22.5068 18.9651 22.5488 18.0113 21.6153L11.1039 14.8537L4.56004 21.9909C3.65651 22.9763 2.15092 23.0184 1.19721 22.0848C0.243494 21.1512 0.202803 19.5956 1.10632 18.6101L7.65021 11.473L0.742781 4.71145Z"
              fill="#F3F3F3"
            />
          </svg>
        </div>
      </div>
      <div className="flex flex-col justify-start px-[40px] py-[15px] tablet:py-[44px] laptop:px-[80px]">
        <p className="mb-[0.48rem]  text-[10px] font-semibold text-[#5B5B5B] tablet:mb-[15px] tablet:text-[22px]">
          Paste link here
        </p>
        <div className="flex">
          <input
            type="text"
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-[9.42px] bg-[#F3F3F3] py-[10.51px] pl-[9.43px] pr-[1.58rem] tablet:py-[30px] tablet:pl-[26px] tablet:leading-[30px] laptop:rounded-[26px] laptop:pr-[70px]"
          />
        </div>
        <div className={'mt-[0.48rem] flex justify-end tablet:mt-4'}>
          <Button variant={'submit'} className={'w-fit'} onClick={validate}>
            Paste
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmbedeDialogue;
