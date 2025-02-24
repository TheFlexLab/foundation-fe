import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';

export default function ListBox({ items, selected, setSelected, placeholder, disabled }) {
  return (
    <Listbox value={selected} onChange={setSelected} disabled={disabled}>
      <div className="relative">
        <Listbox.Button className="focus-visible:border-indigo-500 focus-visible:ring-offset-orange-300 relative w-full cursor-pointer rounded-[8.62px] border border-white-500 bg-[#FBFBFB] py-2 pl-[0.75rem] pr-10 text-left text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 dark:border-gray-100 dark:bg-accent-100 tablet:rounded-[10px] tablet:border-[3px] tablet:py-3 tablet:pl-7 tablet:text-[18px] tablet:leading-[21px]">
          <span className={`block truncate ${selected?.name ? 'text-[#707175] dark:text-gray-300' : 'text-[#b6b4b4]'}`}>
            {selected?.name ? selected.name : placeholder}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/downArrow.svg`}
              alt="down-arrow"
              className={`h-[6.3px] w-[10.3px] tablet:h-[10px] tablet:w-[16px]`}
            />
          </span>
        </Listbox.Button>
        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <Listbox.Options className="absolute z-10 mt-1 max-h-36 w-full overflow-auto rounded-md bg-white py-1 text-base leading-[10px] shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-accent-100 sm:text-sm tablet:max-h-60">
            {items.map((person, personIdx) => (
              <Listbox.Option
                key={personIdx}
                className={({ active }) =>
                  `relative cursor-default select-none py-[6px] pl-[0.75rem] pr-4 text-[10px] tablet:py-3 tablet:pl-11 tablet:text-[16px] ${
                    active ? 'bg-amber-100 text-amber-900' : 'text-gray-1 dark:text-gray-300'
                  }`
                }
                value={person}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block cursor-pointer truncate leading-normal ${selected ? 'font-medium' : 'font-normal'}`}
                    >
                      {person.name}
                    </span>
                    {/* {selected ? (
                      <span className="text-amber-600 absolute inset-y-0 left-0 flex items-center pl-3">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        <img
                          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/downArrow.svg`}
                          alt="down-arrow"
                          className={`h-[6.3px] w-[10.3px] tablet:h-[10px] tablet:w-[16px] `}
                        />
                      </span>
                    ) : null} */}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
