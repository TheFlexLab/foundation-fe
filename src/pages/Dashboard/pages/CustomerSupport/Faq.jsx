import { faqData, faqData2, faqs10, faqs3, faqs4, faqs5, faqs6, faqs7, faqs8, faqs9 } from '../../../../constants/faq';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const Faq = () => {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState([]);
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const toggleItem = (id) => {
    if (openItems.includes(id)) {
      setOpenItems(openItems.filter((item) => item !== id));
    } else {
      setOpenItems([...openItems, id]);
    }
  };

  return (
    <div className="text-gray-1 h-[calc(100dvh-98px)] w-full overflow-scroll overflow-y-auto bg-white no-scrollbar dark:bg-gray-200 dark:text-gray-300 tablet:h-[calc(100dvh-96px)] tablet:rounded-t-[0.86513rem] laptop:h-[calc(100dvh-70px)]">
      <h1 className="mx-[1.13rem] my-[0.94rem] text-[14px] font-semibold leading-none -tracking-[2%] tablet:mx-[35px] tablet:my-6 tablet:text-[25px]">
        General Information
      </h1>
      {faqData.map((item) => (
        <div key={item.id}>
          <button
            key={item.id}
            className={`${openItems.includes(item.id) ? 'border-y-[0.5px] tablet:border-y' : 'border-t-[0.5px] tablet:border-t'} flex w-full items-center gap-[5px] border-black px-[1.13rem] dark:border-gray-100`}
            onClick={() => toggleItem(item.id)}
          >
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/faq/arrow.svg`}
              alt="account"
              className={`${openItems.includes(item.id) ? 'rotate-180' : ''} size-5 tablet:size-[1.875rem]`}
            />
            <h1 className="my-[0.94rem] text-start text-[12px] font-medium leading-none tablet:my-6 tablet:text-[22px] tablet:leading-[137.2%]">
              {item.title}
            </h1>
          </button>
          {openItems.includes(item.id) && (
            <div className="flex flex-col gap-2 bg-[#F5F6F8] px-[1.94rem] py-[0.62rem] dark:bg-silver-400 tablet:gap-4 tablet:px-[50px] tablet:py-[15px]">
              {item.desc.map((i, index) => (
                <p
                  key={index + 1}
                  className="text-[0.75rem] font-normal leading-[125%] tablet:text-[18px] tablet:leading-[167%]"
                >
                  {i}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
      <h1 className="border-t-[0.5px] border-black px-[1.13rem] py-[0.94rem] text-[14px] font-semibold leading-none -tracking-[2%] dark:border-gray-100 tablet:border-t tablet:px-[35px] tablet:py-6 tablet:text-[25px]">
        Earning and Using FDX Tokens
      </h1>
      {faqData2.map((item) => (
        <div key={item.id}>
          <button
            key={item.id}
            className={`${openItems.includes(item.id) ? 'border-y-[0.5px] tablet:border-y' : 'border-t-[0.5px] tablet:border-t'} flex w-full items-center gap-[5px] border-black px-[1.13rem] dark:border-gray-100`}
            onClick={() => toggleItem(item.id)}
          >
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/faq/arrow.svg`}
              alt="account"
              className={`${openItems.includes(item.id) ? 'rotate-180' : ''} size-5 tablet:size-[1.875rem]`}
            />
            <h1 className="my-[0.94rem] text-start text-[12px] font-medium leading-none tablet:my-6 tablet:text-[22px] tablet:leading-[137.2%]">
              {item.title}
            </h1>
          </button>
          {openItems.includes(item.id) && (
            <div className="flex flex-col gap-2 bg-[#F5F6F8] px-[1.94rem] py-[0.62rem] dark:bg-silver-400 tablet:gap-4 tablet:px-[50px] tablet:py-[15px]">
              <ul className="ml-3 list-decimal tablet:ml-5">
                {item.steps &&
                  item.steps.length >= 0 &&
                  item.steps.map((i, index) => (
                    <li
                      key={index + 1}
                      className="text-[0.75rem] font-normal leading-[125%] tablet:text-[18px] tablet:leading-[167%]"
                    >
                      {i}
                    </li>
                  ))}
              </ul>
              {item.desc.map((i, index) => (
                <p
                  key={index + 1}
                  className="text-[0.75rem] font-normal leading-[125%] tablet:text-[18px] tablet:leading-[167%]"
                >
                  {i}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
      <h1 className="border-t-[0.5px] border-black px-[1.13rem] py-[0.94rem] text-[14px] font-semibold leading-none -tracking-[2%] dark:border-gray-100 tablet:border-t tablet:px-[35px] tablet:py-6 tablet:text-[25px]">
        Posts and Engagement
      </h1>
      {faqs3.map((item) => (
        <div key={item.id}>
          <button
            key={item.id}
            className={`${openItems.includes(item.id) ? 'border-y-[0.5px] tablet:border-y' : 'border-t-[0.5px] tablet:border-t'} flex w-full items-center gap-[5px] border-black px-[1.13rem] dark:border-gray-100`}
            onClick={() => toggleItem(item.id)}
          >
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/faq/arrow.svg`}
              alt="account"
              className={`${openItems.includes(item.id) ? 'rotate-180' : ''} size-5 tablet:size-[1.875rem]`}
            />
            <h1 className="my-[0.94rem] text-start text-[12px] font-medium leading-none tablet:my-6 tablet:text-[22px] tablet:leading-[137.2%]">
              {item.title}
            </h1>
          </button>
          {openItems.includes(item.id) && (
            <div className="flex flex-col gap-2 bg-[#F5F6F8] px-[1.94rem] py-[0.62rem] dark:bg-silver-400 tablet:gap-4 tablet:px-[50px] tablet:py-[15px]">
              <ul className="ml-3 list-decimal tablet:ml-5">
                {item.steps &&
                  item.steps.length >= 0 &&
                  item.steps.map((i, index) => (
                    <li
                      key={index + 1}
                      className="text-[0.75rem] font-normal leading-[125%] tablet:text-[18px] tablet:leading-[167%]"
                    >
                      {i}
                    </li>
                  ))}
              </ul>
              {item.desc.map((i, index) => (
                <p
                  key={index + 1}
                  className="text-[0.75rem] font-normal leading-[125%] tablet:text-[18px] tablet:leading-[167%]"
                >
                  {i}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
      <h1 className="border-t-[0.5px] border-black px-[1.13rem] py-[0.94rem] text-[14px] font-semibold leading-none -tracking-[2%] dark:border-gray-100 tablet:border-t tablet:px-[35px] tablet:py-6 tablet:text-[25px]">
        Privacy and Security
      </h1>
      {faqs4.map((item) => (
        <div key={item.id}>
          <button
            key={item.id}
            className={`${openItems.includes(item.id) ? 'border-y-[0.5px] tablet:border-y' : 'border-t-[0.5px] tablet:border-t'} flex w-full items-center gap-[5px] border-black px-[1.13rem] dark:border-gray-100`}
            onClick={() => toggleItem(item.id)}
          >
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/faq/arrow.svg`}
              alt="account"
              className={`${openItems.includes(item.id) ? 'rotate-180' : ''} size-5 tablet:size-[1.875rem]`}
            />
            <h1 className="my-[0.94rem] text-start text-[12px] font-medium leading-none tablet:my-6 tablet:text-[22px] tablet:leading-[137.2%]">
              {item.title}
            </h1>
          </button>
          {openItems.includes(item.id) && (
            <div className="flex flex-col gap-2 bg-[#F5F6F8] px-[1.94rem] py-[0.62rem] dark:bg-silver-400 tablet:gap-4 tablet:px-[50px] tablet:py-[15px]">
              <ul className="ml-3 list-decimal tablet:ml-5">
                {item.steps &&
                  item.steps.length >= 0 &&
                  item.steps.map((i, index) => (
                    <li
                      key={index + 1}
                      className="text-[0.75rem] font-normal leading-[125%] tablet:text-[18px] tablet:leading-[167%]"
                    >
                      {i}
                    </li>
                  ))}
              </ul>
              {item.desc.map((i, index) => (
                <p
                  key={index + 1}
                  className="text-[0.75rem] font-normal leading-[125%] tablet:text-[18px] tablet:leading-[167%]"
                >
                  {i}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
      <h1 className="border-t-[0.5px] border-black px-[1.13rem] py-[0.94rem] text-[14px] font-semibold leading-none -tracking-[2%] dark:border-gray-100 tablet:border-t tablet:px-[35px] tablet:py-6 tablet:text-[25px]">
        Verification Badges
      </h1>
      {faqs5.map((item) => (
        <div key={item.id}>
          <button
            key={item.id}
            className={`${openItems.includes(item.id) ? 'border-y-[0.5px] tablet:border-y' : 'border-t-[0.5px] tablet:border-t'} flex w-full items-center gap-[5px] border-black px-[1.13rem] dark:border-gray-100`}
            onClick={() => toggleItem(item.id)}
          >
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/faq/arrow.svg`}
              alt="account"
              className={`${openItems.includes(item.id) ? 'rotate-180' : ''} size-5 tablet:size-[1.875rem]`}
            />
            <h1 className="my-[0.94rem] text-start text-[12px] font-medium leading-none tablet:my-6 tablet:text-[22px] tablet:leading-[137.2%]">
              {item.title}
            </h1>
          </button>
          {openItems.includes(item.id) && (
            <div className="flex flex-col gap-2 bg-[#F5F6F8] px-[1.94rem] py-[0.62rem] dark:bg-silver-400 tablet:gap-4 tablet:px-[50px] tablet:py-[15px]">
              <ul className="ml-3 list-decimal tablet:ml-5">
                {item.steps &&
                  item.steps.length >= 0 &&
                  item.steps.map((i, index) => (
                    <li
                      key={index + 1}
                      className="text-[0.75rem] font-normal leading-[125%] tablet:text-[18px] tablet:leading-[167%]"
                    >
                      {i}
                    </li>
                  ))}
              </ul>
              {item.desc.map((i, index) => (
                <p
                  key={index + 1}
                  className="text-[0.75rem] font-normal leading-[125%] tablet:text-[18px] tablet:leading-[167%]"
                >
                  {i}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
      <h1 className="border-t-[0.5px] border-black px-[1.13rem] py-[0.94rem] text-[14px] font-semibold leading-none -tracking-[2%] dark:border-gray-100 tablet:border-t tablet:px-[35px] tablet:py-6 tablet:text-[25px]">
        News and Research
      </h1>
      {faqs6.map((item) => (
        <div key={item.id}>
          <button
            key={item.id}
            className={`${openItems.includes(item.id) ? 'border-y-[0.5px] tablet:border-y' : 'border-t-[0.5px] tablet:border-t'} flex w-full items-center gap-[5px] border-black px-[1.13rem] dark:border-gray-100`}
            onClick={() => toggleItem(item.id)}
          >
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/faq/arrow.svg`}
              alt="account"
              className={`${openItems.includes(item.id) ? 'rotate-180' : ''} size-5 tablet:size-[1.875rem]`}
            />
            <h1 className="my-[0.94rem] text-start text-[12px] font-medium leading-none tablet:my-6 tablet:text-[22px] tablet:leading-[137.2%]">
              {item.title}
            </h1>
          </button>
          {openItems.includes(item.id) && (
            <div className="flex flex-col gap-2 bg-[#F5F6F8] px-[1.94rem] py-[0.62rem] dark:bg-silver-400 tablet:gap-4 tablet:px-[50px] tablet:py-[15px]">
              <ul className="ml-3 list-decimal tablet:ml-5">
                {item.steps &&
                  item.steps.length >= 0 &&
                  item.steps.map((i, index) => (
                    <li
                      key={index + 1}
                      className="text-[0.75rem] font-normal leading-[125%] tablet:text-[18px] tablet:leading-[167%]"
                    >
                      {i}
                    </li>
                  ))}
              </ul>
              {item.desc.map((i, index) => (
                <p
                  key={index + 1}
                  className="text-[0.75rem] font-normal leading-[125%] tablet:text-[18px] tablet:leading-[167%]"
                >
                  {i}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
      <h1 className="border-t-[0.5px] border-black px-[1.13rem] py-[0.94rem] text-[14px] font-semibold leading-none -tracking-[2%] dark:border-gray-100 tablet:border-t tablet:px-[35px] tablet:py-6 tablet:text-[25px]">
        Sharing
      </h1>
      {faqs7.map((item) => (
        <div key={item.id}>
          <button
            key={item.id}
            className={`${openItems.includes(item.id) ? 'border-y-[0.5px] tablet:border-y' : 'border-t-[0.5px] tablet:border-t'} flex w-full items-center gap-[5px] border-black px-[1.13rem] dark:border-gray-100`}
            onClick={() => toggleItem(item.id)}
          >
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/faq/arrow.svg`}
              alt="account"
              className={`${openItems.includes(item.id) ? 'rotate-180' : ''} size-5 tablet:size-[1.875rem]`}
            />
            <h1 className="my-[0.94rem] text-start text-[12px] font-medium leading-none tablet:my-6 tablet:text-[22px] tablet:leading-[137.2%]">
              {item.title}
            </h1>
          </button>
          {openItems.includes(item.id) && (
            <div className="flex flex-col gap-2 bg-[#F5F6F8] px-[1.94rem] py-[0.62rem] dark:bg-silver-400 tablet:gap-4 tablet:px-[50px] tablet:py-[15px]">
              <ul className="ml-3 list-decimal tablet:ml-5">
                {item.steps &&
                  item.steps.length >= 0 &&
                  item.steps.map((i, index) => (
                    <li
                      key={index + 1}
                      className="text-[0.75rem] font-normal leading-[125%] tablet:text-[18px] tablet:leading-[167%]"
                    >
                      {i}
                    </li>
                  ))}
              </ul>
              {item.desc.map((i, index) => (
                <p
                  key={index + 1}
                  className="text-[0.75rem] font-normal leading-[125%] tablet:text-[18px] tablet:leading-[167%]"
                >
                  {i}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
      <h1 className="border-t-[0.5px] border-black px-[1.13rem] py-[0.94rem] text-[14px] font-semibold leading-none -tracking-[2%] dark:border-gray-100 tablet:border-t tablet:px-[35px] tablet:py-6 tablet:text-[25px]">
        Home Page
      </h1>
      {faqs8.map((item) => (
        <div key={item.id}>
          <button
            key={item.id}
            className={`${openItems.includes(item.id) ? 'border-y-[0.5px] tablet:border-y' : 'border-t-[0.5px] tablet:border-t'} flex w-full items-center gap-[5px] border-black px-[1.13rem] dark:border-gray-100`}
            onClick={() => toggleItem(item.id)}
          >
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/faq/arrow.svg`}
              alt="account"
              className={`${openItems.includes(item.id) ? 'rotate-180' : ''} size-5 tablet:size-[1.875rem]`}
            />
            <h1 className="my-[0.94rem] text-start text-[12px] font-medium leading-none tablet:my-6 tablet:text-[22px] tablet:leading-[137.2%]">
              {item.title}
            </h1>
          </button>
          {openItems.includes(item.id) && (
            <div className="flex flex-col gap-2 bg-[#F5F6F8] px-[1.94rem] py-[0.62rem] dark:bg-silver-400 tablet:gap-4 tablet:px-[50px] tablet:py-[15px]">
              <ul className="ml-3 list-decimal tablet:ml-5">
                {item.steps &&
                  item.steps.length >= 0 &&
                  item.steps.map((i, index) => (
                    <li
                      key={index + 1}
                      className="text-[0.75rem] font-normal leading-[125%] tablet:text-[18px] tablet:leading-[167%]"
                    >
                      {i}
                    </li>
                  ))}
              </ul>
              {item.desc.map((i, index) => (
                <p
                  key={index + 1}
                  className="text-[0.75rem] font-normal leading-[125%] tablet:text-[18px] tablet:leading-[167%]"
                >
                  {i}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
      <h1 className="border-t-[0.5px] border-black px-[1.13rem] py-[0.94rem] text-[14px] font-semibold leading-none -tracking-[2%] dark:border-gray-100 tablet:border-t tablet:px-[35px] tablet:py-6 tablet:text-[25px]">
        Analytics and Insights
      </h1>
      {faqs9.map((item) => (
        <div key={item.id}>
          <button
            key={item.id}
            className={`${openItems.includes(item.id) ? 'border-y-[0.5px] tablet:border-y' : 'border-t-[0.5px] tablet:border-t'} flex w-full items-center gap-[5px] border-black px-[1.13rem] dark:border-gray-100`}
            onClick={() => toggleItem(item.id)}
          >
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/faq/arrow.svg`}
              alt="account"
              className={`${openItems.includes(item.id) ? 'rotate-180' : ''} size-5 tablet:size-[1.875rem]`}
            />
            <h1 className="my-[0.94rem] text-start text-[12px] font-medium leading-none tablet:my-6 tablet:text-[22px] tablet:leading-[137.2%]">
              {item.title}
            </h1>
          </button>
          {openItems.includes(item.id) && (
            <div className="flex flex-col gap-2 bg-[#F5F6F8] px-[1.94rem] py-[0.62rem] dark:bg-silver-400 tablet:gap-4 tablet:px-[50px] tablet:py-[15px]">
              <ul className="ml-3 list-decimal tablet:ml-5">
                {item.steps &&
                  item.steps.length >= 0 &&
                  item.steps.map((i, index) => (
                    <li
                      key={index + 1}
                      className="text-[0.75rem] font-normal leading-[125%] tablet:text-[18px] tablet:leading-[167%]"
                    >
                      {i}
                    </li>
                  ))}
              </ul>
              {item.desc.map((i, index) => (
                <p
                  key={index + 1}
                  className="text-[0.75rem] font-normal leading-[125%] tablet:text-[18px] tablet:leading-[167%]"
                >
                  {i}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
      <h1 className="border-t-[0.5px] border-black px-[1.13rem] py-[0.94rem] text-[14px] font-semibold leading-none -tracking-[2%] dark:border-gray-100 tablet:border-t tablet:px-[35px] tablet:py-6 tablet:text-[25px]">
        Technical Support and Feedback
      </h1>
      {faqs10.map((item) => (
        <div key={item.id}>
          <button
            key={item.id}
            className={`${openItems.includes(item.id) ? 'border-y-[0.5px] tablet:border-y' : 'border-t-[0.5px] tablet:border-t'} flex w-full items-center gap-[5px] border-black px-[1.13rem] dark:border-gray-100`}
            onClick={() => toggleItem(item.id)}
          >
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/faq/arrow.svg`}
              alt="account"
              className={`${openItems.includes(item.id) ? 'rotate-180' : ''} size-5 tablet:size-[1.875rem]`}
            />
            <h1 className="my-[0.94rem] text-start text-[12px] font-medium leading-none tablet:my-6 tablet:text-[22px] tablet:leading-[137.2%]">
              {item.title}
            </h1>
          </button>
          {openItems.includes(item.id) && (
            <div className="flex flex-col gap-2 bg-[#F5F6F8] px-[1.94rem] py-[0.62rem] dark:bg-silver-400 tablet:gap-4 tablet:px-[50px] tablet:py-[15px]">
              <ul className="ml-3 list-decimal tablet:ml-5">
                {item.steps &&
                  item.steps.length >= 0 &&
                  item.steps.map((i, index) => (
                    <li
                      key={index + 1}
                      className="text-[0.75rem] font-normal leading-[125%] tablet:text-[18px] tablet:leading-[167%]"
                    >
                      {i}
                    </li>
                  ))}
              </ul>
              {item.desc.map((i, index) => (
                <p
                  key={index + 1}
                  className="text-[0.75rem] font-normal leading-[125%] tablet:text-[18px] tablet:leading-[167%]"
                >
                  {i}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
      <div className="flex w-full flex-col items-center justify-center gap-[1.31rem] bg-[#4A8DBD] py-7 dark:bg-silver-200 tablet:gap-[35px] tablet:py-[53px]">
        <h1 className="text-[14px] font-bold text-white tablet:text-[22px]">
          Didn’t find the answer you were looking for?
        </h1>
        <button
          className="dark:text-gray-1 w-48 rounded-[0.31rem] bg-white py-[0.6rem] text-center text-[0.75rem] font-semibold text-[#4A8DBD] tablet:w-[24.3rem] tablet:rounded-[0.75rem] tablet:py-3 tablet:text-[1.25rem]"
          onClick={() => {
            navigate('/help/contact-us');
          }}
        >
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default Faq;
