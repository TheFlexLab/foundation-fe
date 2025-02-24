import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumb';
import DMSlider from './components/DMSlider';

const DirectMessageLayout = () => {
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [questStartData, setQuestStartData] = useState(location.state || null);

  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.state) {
      setQuestStartData(location.state);
    }
  }, [location.state]);

  return (
    <div className="mx-auto w-full max-w-[1440px] bg-gray-400 pb-8 dark:bg-black md:pb-12 tablet:h-[calc(100vh-96px)] laptop:mx-[331px] laptop:h-[calc(100vh-70px)] desktop:mx-auto">
      <Breadcrumb />
      {location.pathname !== '/direct-messaging/new-message' && location.pathname !== '/direct-messaging/preview' && (
        <div className="fixed left-1/2 flex w-full max-w-full -translate-x-1/2 justify-center laptop:max-w-[calc(100%-662px)] desktop:max-w-[calc(1440px-662px)]">
          <DMSlider />
        </div>
      )}
      <div
        ref={scrollRef}
        className={`${location.pathname === '/direct-messaging/new-message' || location.pathname === '/direct-messaging/preview' ? 'mt-3 tablet:mt-[15px] laptop:h-[calc(100dvh-96px)]' : 'mt-10 tablet:mt-[77.63px] laptop:h-[calc(100dvh-147.6px)]'} h-[calc(100dvh-174px)] overflow-y-auto px-4 no-scrollbar tablet:h-[calc(100dvh-173.63px)] tablet:px-6`}
      >
        <Outlet
          context={{ questStartData: questStartData?.questStartData, selectedOptions: questStartData?.selectedOptions }}
        />
      </div>
    </div>
  );
};

export default DirectMessageLayout;
