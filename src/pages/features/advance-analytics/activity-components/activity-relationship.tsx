import { useState } from 'react';
import { ActivityProps } from '../../../../types/advanceAnalytics';

export default function ActivityRelationShip({ state, dispatch, parentDropdown }: ActivityProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const relationshipData = [
    { id: 1, name: 'Single' },
    { id: 2, name: 'In a relationship' },
    { id: 3, name: 'Engaged' },
    { id: 4, name: 'Married' },
    { id: 5, name: "It's complicated" },
    { id: 6, name: 'In an open relationship' },
    { id: 7, name: 'Widowed' },
    { id: 8, name: 'Separated' },
    { id: 9, name: 'Divorced' },
  ];

  return (
    <div className="relative inline-block w-full space-y-3">
      <button
        onClick={toggleDropdown}
        className="flex w-full items-center justify-between rounded border border-white-500 px-2 py-1 text-start text-[10px] text-accent-600 focus:outline-none dark:border-gray-100 dark:text-gray-300 tablet:rounded-[10px] tablet:border-[3px] tablet:px-4 tablet:py-2 tablet:text-[20px]"
      >
        {state?.relationship.relationshipStatus || 'Select Relationship'}
        <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/arrow-right.svg`}
          alt="arrow-right.svg"
          className={`size-[10px] transition-all duration-500 tablet:size-6 ${isOpen ? '-rotate-90' : 'rotate-90'}`}
        />
      </button>
      {!parentDropdown && isOpen && (
        <ul className="absolute z-10 mt-2 max-h-32 w-full min-w-[160px] overflow-y-scroll rounded border border-white-500 bg-white text-[10px] dark:border-gray-100 dark:bg-gray-200 tablet:max-h-48 tablet:border-[2px] tablet:text-[20px]">
          {relationshipData.map((item, index) => (
            <li
              key={index}
              className="block cursor-pointer px-2 py-1 text-accent-600 hover:bg-blue-300 hover:text-white dark:text-gray-300 tablet:px-4 tablet:py-2"
              onClick={() => {
                dispatch({ type: 'SET_RELATIONSHIP_STATUS', payload: item.name });
                toggleDropdown();
              }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
