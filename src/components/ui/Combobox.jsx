import { Fragment, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import showToast from '../ui/Toast';
const CustomCombobox = ({
  items,
  type,
  placeholder,
  selected,
  setSelected,
  isArrow,
  query,
  verify,
  setQuery,
  handleTab,
  verification,
  wordsCheck,
  id,
  disabled,
  page,
}) => {
  const filteredItems =
    query === ''
      ? items
      : items.filter(
          type === 'city'
            ? (item) => item?.name?.toLowerCase()
            : (item) => item?.name?.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))
        );
  const validateSelection = (selection) => {
    const wordCount = selection?.name?.split(' ').filter((word) => word.length > 0).length;
    if (wordCount < 3) {
      showToast('warning', 'degreeWordsLimit');
      return false;
    }
    return true;
  };

  return (
    <Combobox
      value={selected}
      onChange={(item) => {
        if (wordsCheck) {
          if (validateSelection(item)) setSelected(item);
        } else {
          setSelected(item);
        }
        if (verification && item.name && item.name !== '') verify(item.name);
      }}
      disabled={disabled}
    >
      <div className="relative">
        <div
          className={`w-full border border-white-500 bg-[#FBFBFB] text-[9.28px] font-medium leading-[11.23px] text-[#707175] focus:outline-none dark:border-gray-100 dark:bg-accent-100 dark:text-gray-300 tablet:border-[3px] tablet:py-3 tablet:text-[18px] tablet:leading-[21px] ${page === 'advance-analytics' ? 'rounded px-2 py-[6px] dark:bg-transparent tablet:rounded-[10px] tablet:px-4' : 'rounded-[8.62px] px-[16px] py-2 tablet:rounded-[15px]'}`}
        >
          <Combobox.Input
            id={`input-${id}`}
            className="w-full bg-transparent focus-visible:outline-none"
            displayValue={(item) => item.name}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            onKeyDown={(e) => (e.key === 'Tab' && handleTab(id)) || (e.key === 'Enter' && handleTab(id, 'Enter'))}
          />
          {isArrow && (
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/downArrow.svg`}
                alt="down-arrow"
                className={`h-[6.3px] w-[10.3px] tablet:h-[10px] tablet:w-[16px]`}
              />
            </Combobox.Button>
          )}
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          // afterLeave={() => setQuery('')}
        >
          <Combobox.Options
            className={`absolute z-10 mt-1 max-h-36 w-full overflow-auto rounded-md bg-white py-1 text-base leading-[10px] shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm tablet:max-h-60 ${page === 'advance-analytics' ? 'dark:bg-gray-200' : ''}`}
          >
            {filteredItems?.length === 0 && query !== '' ? (
              <div className="text-gray-1' relative cursor-default select-none px-4 py-2 text-[10px] tablet:text-[16px]">
                Nothing found.
              </div>
            ) : (
              filteredItems?.map((item) => (
                <Combobox.Option
                  key={item.id}
                  className={({ active }) =>
                    `relative flex cursor-default select-none justify-between gap-2 py-2 pl-[0.75rem] pr-4 text-[10px] tablet:gap-3 tablet:py-3 tablet:pl-11 tablet:text-[16px] ${
                      active
                        ? `${page === 'advance-analytics' ? 'text-gray-1 dark:text-white' : 'bg-amber-100 text-amber-900'}`
                        : `${page === 'advance-analytics' ? 'text-gray-1 dark:text-white' : 'text-gray-1'}`
                    }`
                  }
                  value={item}
                >
                  {({ selected, active }) => (
                    <>
                      {item.name !== '' && (
                        <span
                          className={`block truncate ${selected ? 'font-medium' : 'font-normal'} flex justify-between`}
                        >
                          {item.name}
                        </span>
                      )}
                      {item.button && item.name !== '' && <span>Add</span>}
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? 'text-white' : 'text-[#B6B4B4]'
                          }`}
                        ></span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};

export default CustomCombobox;
