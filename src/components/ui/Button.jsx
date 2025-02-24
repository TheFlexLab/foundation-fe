import PropTypes from 'prop-types';
import classNames from 'classnames';

export const Button = ({ className = '', children, rounded = false, variant = '', ...props }) => (
  <button
    className={classNames(
      'flex cursor-pointer select-none items-center justify-center [outline:none] disabled:cursor-not-allowed',
      rounded ? 'rounded' : '',
      variant === 'auth'
        ? 'h-[36px] w-full max-w-[297px] rounded-[6.043px] border-[1.463px] border-[#E4D9D9] bg-white text-[9px] font-medium text-black dark:border-gray-100 dark:bg-accent-100 dark:text-gray-300 2xl:rounded-[11.703px] tablet:h-[60px] tablet:rounded-[11.703px] tablet:text-[17.554px]'
        : '',
      variant === 'addOption'
        ? 'addoption-boxShadow h-[1.375rem] w-fit max-w-fit gap-[0.27rem] rounded-[0.28688rem] bg-gray-250 text-[0.625rem] font-normal text-[#435059] tablet:h-[3.125rem] tablet:rounded-[0.9375rem] tablet:text-[1.25rem]'
        : '',
      variant === 'addOption'
        ? 'addoption-boxShadow text-gray h-[1.375rem] w-fit gap-[0.27rem] rounded-[0.28688rem] bg-gray-250 p-2 text-[0.625rem] font-normal tablet:h-[3.125rem] tablet:rounded-[0.9375rem] tablet:text-[1.25rem]'
        : '',
      variant === 'addEmbeded'
        ? 'addoption-boxShadow h-[1.375rem] w-fit gap-[0.27rem] whitespace-nowrap rounded-[0.28688rem] bg-gray-250 px-[5px] py-2 text-[0.625rem] font-normal text-[#435059] tablet:h-[3.125rem] tablet:rounded-[0.9375rem] tablet:text-[1.25rem]'
        : '',
      variant === 'cancel'
        ? 'addoption-boxShadow h-[1.375rem] w-[4.875rem] max-w-[10.8125rem] rounded-[0.28688rem] bg-[#707175] text-[0.625rem] font-semibold text-white tablet:h-[3.125rem] tablet:w-[10.8125rem] tablet:rounded-[0.9375rem] tablet:text-[1.25rem] laptop:w-[12vw]'
        : '',
      variant === 'cancel-full'
        ? 'addoption-boxShadow h-[1.375rem] w-full rounded-[0.28688rem] bg-[#707175] text-[0.625rem] font-semibold text-white tablet:h-[3.125rem] tablet:rounded-[0.9375rem] tablet:text-[1.25rem]'
        : '',
      variant === 'submit'
        ? 'addoption-boxShadow h-[1.375rem] min-w-[4.875rem] rounded-[0.28688rem] bg-gradient-to-tr from-[#6BA5CF] to-[#389CE3] px-[6.63px] text-[0.625rem] font-semibold text-white tablet:h-[3.125rem] tablet:min-w-[10.8125rem] tablet:rounded-[0.9375rem] tablet:text-[1.25rem] laptop:px-[17px]'
        : '',
      variant === 'g-submit'
        ? 'h-[1.375rem] w-full rounded-[0.28688rem] bg-green-200 text-[0.625rem] font-semibold text-white tablet:h-[3.125rem] tablet:rounded-[0.9375rem] tablet:text-[1.25rem]'
        : '',
      variant === 'verification-badge-edit'
        ? 'addoption-boxShadow h-[1.375rem] min-w-[103px] rounded-[0.28688rem] bg-[#FAD308] px-[6.63px] text-[0.625rem] font-semibold text-white dark:bg-yellow-200 tablet:h-[3.125rem] tablet:min-w-[207px] tablet:rounded-[0.9375rem] tablet:text-[1.25rem] laptop:px-[17px]'
        : '',
      variant === 'verification-badge-remove'
        ? 'addoption-boxShadow h-[1.375rem] min-w-[103px] rounded-[0.28688rem] bg-red-400 px-[6.63px] text-[0.625rem] font-semibold text-white tablet:h-[3.125rem] tablet:min-w-[207px] tablet:rounded-[0.9375rem] tablet:text-[1.25rem] laptop:px-[17px]'
        : '',
      variant === 'verification-badge-hollow'
        ? 'h-[1.375rem] min-w-[103px] rounded-[0.28688rem] border-[1.428px] border-[#389CE3] px-[6.63px] text-[0.625rem] font-semibold text-[#389CE3] tablet:h-[3.125rem] tablet:min-w-[207px] tablet:rounded-[0.9375rem] tablet:border-[3px] tablet:text-[1.25rem] laptop:px-[17px]'
        : '',
      variant === 'submit-hollow'
        ? 'h-[1.375rem] min-w-[4.875rem] rounded-[0.28688rem] border-[1.428px] border-[#389CE3] px-[6.63px] text-[0.625rem] font-semibold text-[#389CE3] tablet:h-[3.125rem] tablet:min-w-[10.8125rem] tablet:rounded-[0.9375rem] tablet:border-[3px] tablet:text-[1.25rem] laptop:px-[17px]'
        : '',
      variant === 'submit2'
        ? 'addoption-boxShadow h-[25px] min-w-[4.875rem] rounded-[0.28688rem] bg-gradient-to-tr from-[#6BA5CF] to-[#389CE3] px-[6.63px] text-[0.625rem] font-semibold text-white tablet:h-[40px] tablet:min-w-[10.8125rem] tablet:rounded-[9px] tablet:text-[1.25rem] laptop:px-[17px]'
        : '',
      variant === 'hollow-submit'
        ? 'h-[1.375rem] rounded-[7.28px] border-[1.428px] border-[#389CE3] bg-gradient-to-tr px-[6.63px] py-[3.8px] text-[0.625rem] font-semibold leading-normal text-[#389CE3] dark:border-gray-300 dark:text-gray-300 tablet:h-[3.125rem] tablet:rounded-[15.2px] tablet:border-[3px] tablet:text-[1.25rem] tablet:leading-none laptop:rounded-[12px] laptop:px-[17px]'
        : '',
      variant === 'hollow-submit2'
        ? 'h-[25px] min-w-[4.875rem] whitespace-nowrap rounded-[0.28688rem] border-[1.428px] border-blue-100 bg-gradient-to-tr px-[6px] py-[3.8px] text-[10px] font-semibold leading-normal text-blue-100 dark:border-white-200 dark:bg-gray-200 dark:text-white-200 tablet:h-[40px] tablet:min-w-[12rem] tablet:rounded-[9px] tablet:border-2 tablet:text-[1.25rem] tablet:leading-none laptop:w-full laptop:px-[17px]'
        : '',
      variant === 'submit-welcome'
        ? 'addoption-boxShadow min-w-[4.875rem] bg-gradient-to-tr from-[#6BA5CF] to-[#389CE3] px-[6.63px] py-[9px] text-[12px] font-semibold leading-[14.562px] text-white tablet:min-w-[10.8125rem] tablet:rounded-[11.7px] tablet:py-4 tablet:text-[30px] tablet:font-semibold tablet:leading-[36px] laptop:px-[17px]'
        : '',
      variant === 'hollow-welcome'
        ? 'rounded-[7.28px] border-2 border-[#4A8DBD] bg-gradient-to-tr px-[24.5px] py-[7px] text-[12px] font-semibold leading-[14.562px] text-[#4A8DBD] tablet:rounded-[15.2px] tablet:border-[3px] tablet:px-[15.26px] tablet:py-[13px] tablet:text-[30px] tablet:font-semibold tablet:leading-[36px]'
        : '',
      variant === 'change'
        ? 'addoption-boxShadow h-[1.375rem] w-[4.875rem] rounded-[0.28688rem] bg-[#FDD503] text-[0.625rem] font-semibold text-white disabled:border-[1.428px] disabled:border-[#FDD503] disabled:bg-transparent disabled:text-[#FDD503] dark:bg-yellow-200 disabled:dark:text-[#FDD503] tablet:h-[3.125rem] tablet:w-[10.8125rem] tablet:rounded-[0.9375rem] tablet:text-[1.25rem]'
        : '',
      variant === 'change-outline'
        ? 'h-[1.375rem] w-[4.875rem] rounded-[0.28688rem] border-[1.428px] border-[#FDD503] text-[0.625rem] font-semibold text-[#FDD503] disabled:bg-transparent disabled:text-[#FDD503] dark:border-yellow-200 disabled:dark:text-[#FDD503] tablet:h-[3.125rem] tablet:w-[10.8125rem] tablet:rounded-[0.9375rem] tablet:border-[3px] tablet:text-[1.25rem]'
        : '',
      variant === 'result'
        ? 'addoption-boxShadow h-[1.375rem] w-[4.875rem] rounded-[0.28688rem] bg-[#0FB063] text-[0.625rem] font-semibold text-white tablet:h-[3.125rem] tablet:w-[10.8125rem] tablet:rounded-[0.9375rem] tablet:text-[1.25rem]'
        : '',
      variant === 'result-outline'
        ? 'h-[1.375rem] w-[4.875rem] rounded-[0.28688rem] border-[1.428px] border-[#20D47E] text-[0.625rem] font-semibold text-[#0FB063] tablet:h-[3.125rem] tablet:w-[10.8125rem] tablet:rounded-[0.9375rem] tablet:border-[3px] tablet:text-[1.25rem]'
        : '',
      variant === 'start'
        ? 'addoption-boxShadow h-[1.375rem] w-[4.875rem] max-w-[10.8125rem] rounded-[0.28688rem] bg-gradient-to-tr from-[#6BA5CF] to-[#389CE3] text-[0.625rem] font-semibold text-white tablet:h-[3.125rem] tablet:w-[10.8125rem] tablet:rounded-[0.9375rem] tablet:text-[1.25rem] laptop:w-[12vw]'
        : '',
      variant === 'personal-work'
        ? 'addoption-boxShadow h-[1.375rem] w-[4.875rem] max-w-[10.8125rem] rounded-[0.28688rem] bg-[#4A8DBD] text-[0.625rem] font-medium text-white tablet:h-[3.125rem] tablet:w-[10.8125rem] tablet:rounded-[0.9375rem] tablet:text-[20px] laptop:w-[12vw]'
        : '',
      variant === 'social-btn'
        ? 'dark:bg-dark-gray h-[36px] w-fit whitespace-nowrap rounded-[0.28688rem] border-[1px] border-gray-200 bg-white px-2 text-center text-[2.5vw] font-[500] text-black dark:border-white dark:text-white sm:h-[50px] sm:text-[2.3vw] lg:h-[60px] lg:text-[1vw] tablet:h-[3.125rem] tablet:rounded-[0.9375rem]'
        : '',
      variant === 'getintouch'
        ? 'addoption-boxShadow h-[1.375rem] text-nowrap rounded-[2.1px] bg-[#4A8DBD] px-3 text-[10px] font-semibold text-white tablet:h-[3.125rem] tablet:text-[1.25rem]'
        : '',
      variant === 'danger'
        ? 'addoption-boxShadow h-[1.375rem] w-[4.875rem] max-w-[10.8125rem] rounded-[0.28688rem] bg-[#DC1010] text-[0.625rem] font-semibold text-white tablet:h-[3.125rem] tablet:w-[10.8125rem] tablet:rounded-[0.9375rem] tablet:text-[1.25rem] laptop:w-[12vw]'
        : '',
      variant === 'remove'
        ? 'addoption-boxShadow h-[1.375rem] rounded-[0.28688rem] bg-[#DC1010] px-2 text-[0.625rem] font-semibold text-white tablet:h-[3.125rem] tablet:rounded-[0.9375rem] tablet:px-3 tablet:text-[1.25rem]'
        : '',
      variant === 'badge-remove'
        ? 'addoption-boxShadow h-[1.375rem] w-[4.875rem] max-w-[10.8125rem] rounded-[0.28688rem] bg-[#FF2C2C] text-[0.625rem] font-semibold text-white tablet:h-[3.125rem] tablet:w-[10.8125rem] tablet:rounded-[0.9375rem] tablet:text-[1.25rem] laptop:w-[12vw]'
        : '',
      variant === 'share-link'
        ? 'addoption-boxShadow h-[1.375rem] w-[4.875rem] max-w-[10.8125rem] rounded-[0.28688rem] bg-[#BABABA] text-[0.625rem] font-semibold text-white tablet:h-[3.125rem] tablet:w-[10.8125rem] tablet:rounded-[0.9375rem] tablet:text-[1.25rem] laptop:w-[12vw]'
        : '',
      variant === 'share-link-submit'
        ? 'addoption-boxShadow h-[1.375rem] w-[4.875rem] max-w-[10.8125rem] rounded-[0.28688rem] bg-gradient-to-tr from-[#6BA5CF] to-[#389CE3] text-[0.625rem] font-semibold text-white tablet:h-[3.125rem] tablet:w-[10.8125rem] tablet:rounded-[0.9375rem] tablet:text-[1.25rem] laptop:w-[12vw]'
        : '',
      variant === 'submit-green'
        ? 'addoption-boxShadow h-[1.375rem] min-w-[4.875rem] rounded-[0.28688rem] bg-[#0FB063] text-[0.625rem] font-semibold text-white tablet:h-[3.125rem] tablet:min-w-[10.8125rem] tablet:rounded-[0.9375rem] tablet:text-[1.25rem]'
        : '',
      variant === 'topics'
        ? 'h-6 whitespace-nowrap rounded-[0.28688rem] border px-[4.9px] py-[6.5px] text-[0.57944rem] font-semibold focus:outline-none focus:ring-0 tablet:h-12 tablet:rounded-[0.9375rem] tablet:border-[1.86px] tablet:px-[12px] tablet:py-[13px] tablet:text-[20px] tablet:leading-[20px]'
        : '',
      variant === 'submit-fit'
        ? 'addoption-boxShadow h-[1.375rem] w-fit rounded-[0.28688rem] bg-gradient-to-tr from-[#6BA5CF] to-[#389CE3] px-[6.63px] text-[0.625rem] font-semibold text-white tablet:h-[3.125rem] tablet:rounded-[0.9375rem] tablet:text-[1.25rem] laptop:px-[17px]'
        : '',
      variant === 'cancel-fit'
        ? 'addoption-boxShadow h-[1.375rem] w-fit rounded-[0.28688rem] bg-[#7C7C7C] px-[6.63px] text-[0.625rem] font-semibold text-white tablet:h-[3.125rem] tablet:rounded-[0.9375rem] tablet:text-[1.25rem] laptop:px-[17px]'
        : '',
      variant === 'addOption-fit'
        ? 'addoption-boxShadow h-[1.375rem] w-fit rounded-[0.28688rem] bg-gray-250 px-[6.63px] text-[0.625rem] font-semibold text-[#435059] tablet:h-[3.125rem] tablet:rounded-[0.9375rem] tablet:px-[13px] tablet:text-[1.25rem] laptop:px-[17px]'
        : '',
      variant === 'show-more-options'
        ? 'h-fit cursor-pointer text-[10px] font-semibold leading-normal tracking-[0.9px] text-blue-200 tablet:text-[18px]'
        : '',
      variant === 'hollow-feedback'
        ? 'h-[1.375rem] min-w-[4.875rem] rounded-[0.28688rem] border-accent-900 px-[6.63px] text-[0.625rem] font-semibold text-accent-600 tablet:h-[3.125rem] tablet:min-w-[10.8125rem] tablet:rounded-[0.9375rem] tablet:border-[3px] tablet:text-[1.25rem] laptop:px-[17px]'
        : '',
      className
    )}
    {...props}
  >
    {children}
  </button>
);

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  rounded: PropTypes.bool,
  variant: PropTypes.oneOf([
    'auth',
    'addOption',
    'cancel',
    'cancel-full',
    'submit',
    'g-submit',
    'change',
    'change-outline',
    'result',
    'result-outline',
    'start',
    'personal-work',
    'social-btn',
    'hollow-submit',
    'hollow-submit2',
    'verification-badge-edit',
    'verification-badge-remove',
    'verification-badge-hollow',
    'badge-remove',
    'submit2',
    'submit-hollow',
    'getintouch',
    'danger',
    'submit-green',
    'topics',
    'share-link',
    'addEmbeded',
    'submit-fit',
    'addOption-fit',
    'show-more-options',
    'hollow-feedback',
    'remove',
  ]),
};
