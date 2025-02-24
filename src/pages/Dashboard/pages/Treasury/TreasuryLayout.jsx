import { useLayoutEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TreasurySlider from './components/TreasurySlider';
import Breadcrumb from '../../../../components/Breadcrumb';

const TreasuryLayout = () => {
  const location = useLocation();
  const scrollRef = useRef(null);

  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <div
      className={`${location.pathname !== '/treasury/ledger' ? 'mx-auto max-w-[1440px] laptop:mx-[331px] desktop:mx-auto' : ''} w-full bg-[#F2F3F5] dark:bg-black tablet:h-[calc(100vh-70px)]`}
    >
      <Breadcrumb />
      <div className="fixed left-1/2 flex w-full max-w-full -translate-x-1/2 justify-center laptop:max-w-[calc(100%-662px)] desktop:max-w-[calc(1440px-662px)]">
        <TreasurySlider />
      </div>
      <div
        ref={scrollRef}
        className={`${location.pathname !== '/treasury/ledger' ? 'max-w-[778px] laptop:h-[calc(100dvh-147.6px)]' : 'max-w-[1440px] pb-16 laptop:mt-[128px] laptop:h-[calc(100dvh-207.6px)]'} no-scrollbar mx-auto mt-10 h-[calc(100dvh-174px)] overflow-y-scroll tablet:mt-[77.63px] tablet:h-[calc(100dvh-224px)] `}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default TreasuryLayout;
