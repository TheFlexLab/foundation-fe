import { useState } from 'react';
import { ActivityProps } from '../../../../types/advanceAnalytics';
import { comparisonOperators } from '../../../../constants/advanceAnalytics';

export default function ActivityFollowers({ state, dispatch, parentDropdown }: ActivityProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="space-y-2 tablet:space-y-[10px]">
      <input
        type="number"
        value={state.twitter.followers || ''}
        placeholder={`Enter no of followers here`}
        className="flex w-full items-center justify-between rounded border border-white-500 bg-transparent px-2 py-1 text-start text-[10px] text-accent-600 focus:outline-none dark:border-gray-100 dark:text-gray-300 tablet:rounded-[10px] tablet:border-[3px] tablet:px-4 tablet:py-2 tablet:text-[20px]"
        onChange={(e) => {
          const value = e.target.value;

          if (value === '') {
            dispatch({ type: 'SET_TWITTER_FOLLOWERS', payload: 0 });
          } else {
            const followers = parseInt(value, 10);
            if (!isNaN(followers)) {
              dispatch({ type: 'SET_TWITTER_FOLLOWERS', payload: followers });
            }
          }
        }}
      />
      <div className="relative inline-block w-full">
        <button
          onClick={toggleDropdown}
          className="flex w-full items-center justify-between rounded border border-white-500 px-2 py-1 text-start text-[10px] text-accent-600 focus:outline-none dark:border-gray-100 dark:text-gray-300 tablet:rounded-[10px] tablet:border-[3px] tablet:px-4 tablet:py-2 tablet:text-[20px]"
        >
          {state?.twitter.name || 'Select the operator'}
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/arrow-right.svg`}
            alt="arrow-right.svg"
            className={`size-[10px] transition-all duration-500 tablet:size-6 ${isOpen ? '-rotate-90' : 'rotate-90'}`}
          />
        </button>
        {!parentDropdown && isOpen && (
          <ul className="absolute z-10 mt-2 max-h-32 w-fit min-w-[160px] overflow-y-scroll rounded border border-white-500 bg-white text-[10px] dark:border-gray-100 dark:bg-gray-200 tablet:max-h-48 tablet:border-[2px] tablet:text-[20px]">
            {comparisonOperators.map((operator) => (
              <li
                key={operator.id}
                className="block cursor-pointer px-2 py-1 text-accent-600 hover:bg-blue-300 hover:text-white dark:text-gray-300 tablet:px-4 tablet:py-2"
                onClick={() => {
                  dispatch({ type: 'SET_TWITTER_NAME', payload: operator.name });
                  dispatch({ type: 'SET_TWITTER_OPERAND', payload: operator.id });
                  toggleDropdown();
                }}
              >
                {operator.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
