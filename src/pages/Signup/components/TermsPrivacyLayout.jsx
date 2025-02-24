const TermsPrivacyLayout = ({ children, title, timeStamp }) => {
  return (
    <div className="h-full bg-[#F2F3F5]">
      <div className="bg-blue-gradient flex items-center justify-center py-[14px] tablet:h-[70px]">
        <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/logo.svg`}
          alt="logo"
          className="w-[34.5px] tablet:w-[69.2px] laptop:w-[10rem]"
        />
      </div>
      <div className="term-privacy-scrollbar h-full overflow-y-auto bg-white pb-[5rem] pl-6 pr-5 pt-[2px] text-[#707175] dark:bg-gray-200 dark:text-gray-300 tablet:px-[46px] tablet:pt-[15px]">
        <h1 className="text-center text-[12px] font-semibold text-[#707175] dark:text-gray-300 tablet:text-[30px]">
          {title}
        </h1>
        <p className="text-center text-[7.5px] font-normal text-[#707175] dark:text-gray-300 tablet:text-[19.36px]">
          {timeStamp}
        </p>
        {children}
      </div>
    </div>
  );
};

export default TermsPrivacyLayout;
