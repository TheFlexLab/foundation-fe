import classNames from 'classnames';

const Button = ({
  children,
  type = 'button',
  size = 'medium',
  color = 'primary',
  group = '',
  disabled = false,
  onClick,
  className,
}) => {
  const buttonClasses = classNames(
    'inline-flex items-center py-0 rounded-[6.043px] 2xl:rounded-[11.703px] flex justify-center items-center',
    {
      'bg-dark-blue text-white': color === 'blue',
      'bg-white dark:bg-dark-gray text-black dark:text-white': color === 'gray',
      'bg-white dark:bg-gray-500 text-black dark:text-white': color === 'darkgray',
      'bg-gradient-to-tr from-[#6BA5CF] to-[#389CE3] dark:from-[#2759A5] dark:to-[#2759A5]': color === 'blue-200',
      'text-primary bg-white hover:bg-gray-200 border-[1px] border-gray-300': color === 'light',
      // 'disabled:bg-gray-300 disabled:cursor-not-allowed': disabled,
    },
    {
      'text-[13px] justify-center font-[500] px-[10px] h-[30px] gap-[15px]': size === 'small',
      'px-2 text-[8.951px] justify-center md:text-[17.554px] font-[500] text-center h-[34.3px] taller:h-[52px] md:h-[67.2px] w-fit border-[1px] border-gray-200 dark:border-white whitespace-nowrap':
        size === 'medium',
      'px-2 lg:px-4 text-[2.5vw] sm:text-[2.3vw] lg:text-[1vw] font-[500] text-center h-[36px] sm:h-[50px] lg:h-[60px] w-full border-[1px] border-gray-200 dark:border-white whitespace-nowrap':
        size === 'login-btn',
      'taller:text-[18px] justify-center taller:h-[44px] text-[14.91px] md:text-[29.257px] font-[500] text-center py-3 h-[33.23px] md:h-[67.2px] w-full':
        size === 'large',
    },
    {
      'rounded-r-none': group === 'left',
      'rounded-none': group === 'middle',
      'rounded-l-none': group === 'right',
    },
    className,
  );

  return (
    <button type={type} className={buttonClasses} disabled={disabled} onClick={onClick}>
      <div className="flex min-w-[75px] max-w-[75px] items-center justify-center whitespace-nowrap tablet:min-w-[136px] tablet:max-w-[136px]">
        {children}
      </div>
    </button>
  );
};

export default Button;
