import { Dialog, Transition } from '@headlessui/react';
import { useEffect } from 'react';
import { Fragment, useState } from 'react';

export default function MyModal({ modalShow, email, handleEmailType }) {
  let [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    setIsOpen(modalShow);
  }, [modalShow]);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <>
      {/* <div className="fixed inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
        >
          Open dialog
        </button>
      </div> */}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => 0}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-center text-lg font-medium leading-6 text-[#838383]">
                    {/* abc@work.com */}
                    {email}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-center text-lg font-medium text-[#838383]">
                      Please select if this email is personal or professional.
                    </p>
                  </div>
                  <div className="mt-4 flex justify-center gap-5 tablet:gap-8">
                    <label
                      htmlFor="personal"
                      className={`flex min-w-[8rem] cursor-pointer items-center justify-center gap-3 rounded-lg bg-[#4A8DBD] py-2 tablet:min-w-[10rem] ${
                        value === 'personal' ? 'border-dark-blue' : 'border-[#4A8DBD]'
                      } border-[3px]`}
                    >
                      <div>
                        <img
                          className="h-7 w-7 tablet:h-10 tablet:w-10"
                          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/personal.svg`}
                          alt="personal"
                        />
                      </div>
                      <p className="text-lg font-medium text-white">Personal</p>
                    </label>
                    <input
                      type="radio"
                      hidden
                      id="personal"
                      name="radio"
                      value="personal"
                      onChange={(e) => handleChange(e)}
                    />
                    <label
                      htmlFor="work"
                      className={`flex min-w-[8rem] cursor-pointer items-center justify-center gap-3 rounded-lg bg-[#4A8DBD] py-2 tablet:min-w-[10rem] ${
                        value === 'work' ? 'border-dark-blue' : 'border-[#4A8DBD]'
                      } border-[3px]`}
                    >
                      <div>
                        <img
                          className="h-7 w-7 tablet:h-10 tablet:w-10"
                          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/work.svg`}
                          alt="work"
                        />
                      </div>
                      <p className="text-lg font-medium text-white">Work</p>
                    </label>
                    <input type="radio" hidden id="work" name="radio" value="work" onChange={(e) => handleChange(e)} />
                  </div>

                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      className="my-4 inline-flex items-center justify-center rounded-lg bg-blue-200 px-4 py-2 text-center text-lg font-medium text-white dark:bg-[#2759A5]"
                      // onClick={closeModal}
                      onClick={() => handleEmailType(value)}
                    >
                      Submit
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
