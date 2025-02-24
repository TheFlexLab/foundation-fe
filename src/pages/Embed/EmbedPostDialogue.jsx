import { toast } from 'sonner';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../../components/ui/Button';
import PopUp from '../../components/ui/PopUp';
import CustomSwitch from '../../components/CustomSwitch';

export default function EmbedPostDialogue({ handleClose, modalVisible, postLink }) {
  const [darkMode, setDarkMode] = useState(false);
  const [resultsMode, setResultsMode] = useState(true);
  const [dynamicHeight, setDynamicHeight] = useState('auto');
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef(null);

  // onload="window.addEventListener('message', e => {
  //   if (e.data.height) {
  //     document.querySelector('iframe').style.height = e.data.height + 'px';
  //   }
  // });"

  const generateIframeCode = () => {
    const url = `${import.meta.env.VITE_FRONTEND_URL}/embed/${postLink}?darkMode=${darkMode}&results=${resultsMode}`;

    return `
    <iframe
      src="${url}"
      style="border: none; width: 100%; max-width: 600px; border-radius: 15px;"
      title="Embedded Content"
    ></iframe>`;
  };

  const copyToClipboard = () => {
    const iframeCode = generateIframeCode();
    navigator.clipboard
      .writeText(iframeCode)
      .then(() => {
        toast.success('Code copied successfully');
      })
      .catch((err) => console.error('Failed to copy:', err));
  };

  useEffect(() => {
    const handleResizeMessage = (e) => {
      const message = e.data;

      // Check if message has height and it's different from the current one
      if (message.height && message.height !== dynamicHeight && message.height !== 150) {
        setDynamicHeight(message.height);
      }
    };

    window.addEventListener('message', handleResizeMessage);

    return () => {
      window.removeEventListener('message', handleResizeMessage);
    };
  }, [dynamicHeight]);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
  }, [darkMode, resultsMode]);

  return (
    <PopUp
      logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/embedPostIcon.svg`}
      title={'Embed Post'}
      open={modalVisible}
      handleClose={() => handleClose()}
    >
      <div className="flex h-full max-h-[80dvh] flex-col items-center gap-3 overflow-y-scroll p-4 no-scrollbar tablet:gap-6 tablet:p-8">
        <div className="relative mx-auto size-full w-fit bg-white dark:bg-gray-200">
          {loading && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <p className="text-[10px] text-blue-100 tablet:text-[20px]">Generating Preview...</p>
            </div>
          )}
          <iframe
            ref={iframeRef}
            src={generateIframeCode().match(/src="([^"]+)"/)[1]}
            height={dynamicHeight}
            title="Embedded iframe"
            className={`${loading ? 'invisible' : ''} w-full max-w-[599px] rounded-[12.3px] border-0 tablet:w-full tablet:min-w-[600px] tablet:max-w-[600px] tablet:rounded-[15.5px]`}
            onLoad={handleIframeLoad}
          />
        </div>
        <div className="w-full max-w-[730px]">
          <h5 className="mt-4 text-[10px] font-semibold leading-[10px] text-gray-1 dark:text-white-400 tablet:block tablet:text-[22.81px] tablet:leading-[22.81px] laptop:text-[25px] laptop:leading-[25px]">
            Embed Post Settings
          </h5>
          <div className="mt-1 flex flex-col gap-[5px] rounded-[0.30925rem] border border-white-500 bg-[#FCFCFC] py-[10px] dark:border-gray-100 dark:bg-accent-100 tablet:mt-2 tablet:gap-[15px] tablet:rounded-[16px] tablet:border-[3px] tablet:py-[20px]">
            <div className="mx-[15px] flex cursor-not-allowed items-center justify-between rounded-[0.30925rem] border border-white-500 px-[8.62px] py-[6px] dark:border-gray-100 dark:bg-gray-200 tablet:rounded-[16px] tablet:border-[3px] tablet:px-[20.26px] tablet:pb-[13.72px] tablet:pt-[14.83px] laptop:mx-[28px] laptop:px-7 laptop:py-[20px]">
              <h5 className="text-[9px] font-normal leading-normal text-gray-1 dark:text-white-600 tablet:w-[300px] tablet:text-[18.662px] laptop:w-full laptop:text-[20px]">
                Dark Mode
              </h5>
              <CustomSwitch enabled={darkMode} setEnabled={setDarkMode} />
            </div>
            <div className="mx-[15px] flex cursor-not-allowed items-center justify-between rounded-[0.30925rem] border border-white-500 px-[8.62px] py-[6px] dark:border-gray-100 dark:bg-gray-200 tablet:rounded-[16px] tablet:border-[3px] tablet:px-[20.26px] tablet:pb-[13.72px] tablet:pt-[14.83px] laptop:mx-[28px] laptop:px-7 laptop:py-[20px]">
              <h5 className="text-[9px] font-normal leading-normal text-gray-1 dark:text-white-600 tablet:w-[300px] tablet:text-[18.662px] laptop:w-full laptop:text-[20px]">
                Results Mode
              </h5>
              <CustomSwitch enabled={resultsMode} setEnabled={setResultsMode} />
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-[730px] flex-col items-center justify-center gap-6">
          <div className="rounded-[5.128px] border border-blue-500 tablet:rounded-[0.625rem] tablet:border-[3px]">
            <p className="mx-auto p-2.5 text-[10px] text-gray-1 tablet:px-5 tablet:pb-4 tablet:text-[18px]">
              {generateIframeCode()}
            </p>
          </div>
          <Button variant={loading ? 'hollow-submit' : 'submit'} disabled={loading} onClick={copyToClipboard}>
            Copy Code
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
