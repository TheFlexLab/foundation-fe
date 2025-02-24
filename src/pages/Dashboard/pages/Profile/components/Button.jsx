import classNames from 'classnames';

const Button = ({ children, type = 'button', color, onClick, disabled }) => {
  const buttonClasses = classNames(
    'w-[120px] h-[21.5px] tablet:w-[207px] tablet:h-[50px] rounded-[1.31vw] tablet:rounded-[8px] laptop:rounded-[15px] text-[2.65vw] tablet:text-[20px] font-semibold leading-normal flex items-center justify-center',
    {
      'text-white dark:bg-yellow-200 bg-[#FAD308]': color === 'yellow',
      'border-[1px] border-[#BABABA] text-[#949494] dark-bg-[#252D37] bg-[#fff]': color === 'gray-light',
      'bg-gray cursor-not-allowed border-[1px] border-[#BABABA] text-white': color === 'gray',
      'bg-red-400 dark:bg-[#C13232] text-white': color === 'red',
      'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3] dark:bg-[#252D37] dark:from-[#252D37] dark:to-[#252D37] text-white':
        color === 'blue',
    },
  );

  return (
    <button type={type} className={buttonClasses} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
