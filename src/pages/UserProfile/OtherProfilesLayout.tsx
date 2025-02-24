import { useLayoutEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SearchOtherProfiles from './components/SearchOtherProfiles';

const OtherProfilesLayout = () => {
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <div className="mx-auto h-[calc(100dvh-91px)] w-full max-w-[1440px] bg-gray-400 pb-8 dark:bg-black md:pb-12 tablet:h-[calc(100vh-96px)] laptop:mx-[331px] laptop:h-[calc(100vh-70px)] desktop:mx-auto">
      <div className="flex h-[43px] items-center justify-center bg-white px-4 py-[10px] dark:bg-gray-200 tablet:hidden tablet:px-[37px] tablet:py-5 laptop:py-[26px]">
        <SearchOtherProfiles />
      </div>
      <div className="fixed left-1/2 flex w-full max-w-full -translate-x-1/2 justify-center laptop:max-w-[calc(100%-662px)] desktop:max-w-[calc(1440px-662px)]">
        <div className="hidden items-center justify-center tablet:h-[78px] laptop:flex">
          <h1 className="text-[24px] font-semibold leading-[24px] text-[#707175] dark:text-white">Other Profiles</h1>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="mx-auto mt-3 h-[calc(100dvh-134px)] max-w-[778px] overflow-y-scroll no-scrollbar tablet:h-[calc(100dvh-200px)] laptop:mt-[77.63px] laptop:h-[calc(100dvh-147.6px)]"
      >
        <Outlet />
      </div>
    </div>
  );
};

export default OtherProfilesLayout;
