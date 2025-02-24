import { BsCalendar2Date } from 'react-icons/bs';
import React from 'react';

export const DateInput = ({
  setVal,
  value,
  id,
}: {
  setVal: React.Dispatch<React.SetStateAction<string>>;
  value?: string;
  id: string;
}) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setVal(dateValue);
  };

  return (
    <div className="relative w-full">
      <input
        type="date"
        className="h-[25px] w-full rounded border border-white-500 bg-[#FBFBFB] px-[16px] py-2 text-[9.28px] font-medium leading-[9.28px] text-[#707175] focus:outline-none dark:border-gray-100 dark:bg-transparent dark:text-gray-300 tablet:h-[52px] tablet:rounded-[10px] tablet:border-[3px] tablet:py-3 tablet:text-[18px] tablet:leading-[21px]"
        onChange={handleDateChange}
        value={value}
        id={id}
      />
      <BsCalendar2Date className="pointer-events-none absolute right-3 top-1/2 size-3 -translate-y-1/2 transform text-gray-500 dark:text-gray-400 tablet:size-5" />
    </div>
  );
};
