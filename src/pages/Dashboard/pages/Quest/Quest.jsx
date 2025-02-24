import { useLayoutEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import CreateSlider from './components/CreateSlider';
import Breadcrumb from '../../../../components/Breadcrumb';

const Quest = () => {
  const location = useLocation();
  const scrollRef = useRef(null);

  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <div className="mx-auto w-full max-w-[1440px] bg-gray-400 pb-8 dark:bg-black md:pb-12 tablet:h-[calc(100vh-96px)] laptop:mx-[331px] laptop:h-[calc(100vh-70px)] desktop:mx-auto">
      <Breadcrumb />
      <div className="fixed left-1/2 flex w-full max-w-full -translate-x-1/2 justify-center laptop:max-w-[calc(100%-662px)] desktop:max-w-[calc(1440px-662px)]">
        <CreateSlider />
      </div>
      <div
        ref={scrollRef}
        className="mt-10 h-[calc(100dvh-174px)] overflow-y-auto no-scrollbar tablet:mx-6 tablet:mt-[77.63px] tablet:h-[calc(100dvh-173.63px)] laptop:h-[calc(100dvh-147.6px)]"
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Quest;
