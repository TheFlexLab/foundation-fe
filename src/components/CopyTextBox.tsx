import { useSelector } from 'react-redux';
import Copy from '../assets/optionbar/Copy';
import showToast from './ui/Toast';

const CopyTextBox = ({ url }: { url: string }) => {
  const { protocol, host } = window.location;
  const urlToCopy = `${protocol}//${host}${url}`;

  const persistedTheme = useSelector((state: any) => state.utils.theme);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(urlToCopy);
      showToast('success', 'copyLink');
    } catch (err) {
      console.error('Unable to copy text to clipboard:', err);
    }
  };

  return (
    <div className="flex max-w-[680px] rounded-[9.42px] border border-white-500 dark:border-gray-100 dark:bg-accent-100 tablet:rounded-[15px] tablet:border-[3px]">
      <div className="flex h-[28.38px] flex-grow items-center tablet:h-[62.92px]">
        <p className="pl-[9.43px] text-[9.42px] font-normal leading-[9.42px] text-[#435059] dark:text-gray-300 tablet:pl-4 tablet:text-[26px] tablet:leading-[30px]">
          {urlToCopy}
        </p>
      </div>
      <button
        className="rounded-r-[9px] bg-white-500 px-[11px] py-[6px] dark:bg-gray-100 tablet:rounded-r-[10px] tablet:px-5 tablet:py-[14px]"
        onClick={copyToClipboard}
        aria-label="Copy to clipboard"
      >
        <Copy color={persistedTheme === 'dark' ? '#293138' : '#8BAAC0'} />
      </button>
    </div>
  );
};

export default CopyTextBox;
