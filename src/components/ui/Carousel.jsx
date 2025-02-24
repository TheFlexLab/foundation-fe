import { useState, useEffect } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { Carousel } from 'react-responsive-carousel';
import FullScreenPicturePopup from '../dialogue-boxes/FullScreenPicturePopup';
import { useLocation } from 'react-router-dom';
import { delOption } from '../../features/createQuest/pictureMediaSlice';
import { useDispatch } from 'react-redux';

// Custom arrow component for the left arrow
const CustomLeftArrow = ({ onClick }) => (
  <div
    className="absolute bottom-0 left-0 top-0 flex w-12 cursor-pointer items-center justify-center"
    onClick={onClick}
  >
    <div className="flex size-5 items-center justify-center rounded-full bg-[#647785] tablet:size-8">
      <FiChevronLeft className="size-4 text-white tablet:size-6" />
    </div>
  </div>
);

// Custom arrow component for the right arrow
const CustomRightArrow = ({ onClick }) => (
  <div
    className="absolute bottom-0 right-0 top-0 flex w-12 cursor-pointer items-center justify-center"
    onClick={onClick}
  >
    <div className="flex size-5 items-center justify-center rounded-full bg-[#647785] tablet:size-8">
      <FiChevronRight className="size-4 text-white tablet:size-6" />
    </div>
  </div>
);

// Inside your component, define a function to render the thumbnail images along with slide numbers
const renderThumbnails = (children) => {
  return (
    <div className="flex items-center justify-center">
      {children.map((item, index) => (
        <div key={index} className="relative mx-1">
          {item}
          <span className="absolute bottom-1 right-1 text-xs text-white">{index + 1}</span>
        </div>
      ))}
    </div>
  );
};

const renderThumbs = (children) => {
  return children.map((child, index) => (
    <div key={index} className="thumbItem" draggable="false" onMouseDown={(event) => event.preventDefault()}>
      {child}
      {/* <span className="thumbIndex">{index + 1}</span> */} 
    </div>
  ));
};

export default ({ data }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [imageDialogue, setImageDialogue] = useState(false);
  const [selectedImg, setSelectedImg] = useState('');
  const [shouldEmulateTouch, setShouldEmulateTouch] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setShouldEmulateTouch(window.innerWidth > 744);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const openDialogue = (img, event) => {
    if (event.target.closest('.thumbItem')) {
      return;
    }

    setSelectedImg(img);
    setImageDialogue(true);
  };

  const closeDialogue = () => setImageDialogue(false);

  return (
    <div className="carouselContainer">
      {/* <FullScreenPicturePopup
        handleClose={closeDialogue}
        modalVisible={imageDialogue}
        content={selectedImg}
        imgArr={data}
      /> */}
      <Carousel
        // autoPlay
        swipeable={shouldEmulateTouch}
        infiniteLoop={true}
        stopOnHover={true}
        showArrows={true}
        showIndicators={false}
        emulateTouch={true}
        useKeyboardArrows={true}
        renderArrowPrev={(onClickHandler, hasPrev, label) => hasPrev && <CustomLeftArrow onClick={onClickHandler} />}
        renderArrowNext={(onClickHandler, hasNext, label) => hasNext && <CustomRightArrow onClick={onClickHandler} />}
        statusFormatter={(currentItem, total) => ''}
        renderThumbs={(children) => renderThumbs(children)}
        selectedItem={data?.length - 1}
        // onChange={onChange}
        // onClickItem={onClickItem}
        // onClickThumb={onClickThumb}
      >
        {data &&
          data.length >= 1 &&
          data.map((item, index) => (
            <div className="relative" key={index}>
              <div
                onClick={(event) => openDialogue(index + 1, event)}
                onTouchStart={(event) => event.stopPropagation()}
                onMouseDown={(event) => event.stopPropagation()}
              >
                <img alt={index} src={item} />
              </div>
              {location.pathname === '/post' && (
                <p
                  onClick={() => dispatch(delOption({ id: `index-${index}` }))}
                  className="absolute -right-3 -top-3 flex size-6 items-center justify-center rounded-full bg-[#647785] p-[5px] text-center text-[10px] font-semibold text-white [text-shadow:1px_1px_1px_rgba(0,_0,_0,_0.9)]"
                >
                  <IoClose className="size-4" />
                </p>
              )}
              <p className="absolute -left-3 -top-3 flex size-6 items-center justify-center rounded-full bg-[#647785] p-[5px] text-center text-[10px] font-semibold text-white [text-shadow:1px_1px_1px_rgba(0,_0,_0,_0.9)]">
                {index + 1}
              </p>
            </div>
          ))}
      </Carousel>
    </div>
  );
};
