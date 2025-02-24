import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { treasuryItems } from '../../../../../constants/sliders';

export default function TreasurySlider() {
  const location = useLocation();
  const rightArrowRef = useRef(null);
  const leftArrowRef = useRef(null);
  const tabsListRef = useRef(null);
  const tabRefs = useRef([]);
  const [dragging, setDragging] = useState(false);

  const manageIcons = () => {
    if (tabsListRef.current.scrollLeft >= 20) {
      leftArrowRef.current.classList.add('active');
    } else {
      leftArrowRef.current.classList.remove('active');
    }

    let maxScrollValue = tabsListRef.current.scrollWidth - tabsListRef.current.clientWidth - 20;
    if (tabsListRef.current.scrollLeft >= maxScrollValue) {
      rightArrowRef.current.classList.remove('active');
    } else {
      rightArrowRef.current.classList.add('active');
    }
  };

  const handleRightArrowClick = () => {
    tabsListRef.current.scrollLeft += 200;
    manageIcons();
  };

  const handleLeftArrowClick = () => {
    tabsListRef.current.scrollLeft -= 200;
    manageIcons();
  };

  const drag = (e) => {
    if (!dragging) return;
    tabsListRef.current.classList.add('dragging');
    tabsListRef.current.scrollLeft -= e.movementX;
  };

  useEffect(() => {
    const tabsList = tabsListRef.current;
    const handleMouseUp = () => {
      setDragging(false);
      tabsList.classList.remove('dragging');
    };

    document.addEventListener('mouseup', handleMouseUp);
    tabsList.addEventListener('scroll', manageIcons);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      tabsList.removeEventListener('scroll', manageIcons);
    };
  }, [dragging]);

  useEffect(() => {
    const currentTab = treasuryItems.find((item) => item.path === location.pathname);
    const currentTabIndex = currentTab ? currentTab.id : 0;
    const currentTabRef = tabRefs.current[currentTabIndex];
    if (currentTabRef) {
      currentTabRef.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [location.pathname]);

  return (
    <div className="scrollable-tabs-container">
      <div ref={leftArrowRef} className="left-arrow" onClick={handleLeftArrowClick}>
        <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/arrow-right.svg`}
          alt="arrow-right.svg"
          className="size-[10px] rotate-180 tablet:size-6"
        />
      </div>
      <ul ref={tabsListRef} onMouseDown={() => setDragging(true)} onMouseMove={drag}>
        {treasuryItems.map((tab, index) => (
          <li key={index} ref={(el) => (tabRefs.current[tab.id] = el)}>
            <Link
              className={`${location.pathname === tab.path ? 'slider-link-active' : 'slider-link-inactive'} slider-link`}
              to={tab.path}
            >
              {tab.title}
            </Link>
          </li>
        ))}
      </ul>
      {/* <div ref={rightArrowRef} className="right-arrow active" onClick={handleRightArrowClick}>
        <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/arrow-right.svg`}
          alt="arrow-right.svg"
          className="size-[10px] tablet:size-6"
        />
      </div> */}
    </div>
  );
}
