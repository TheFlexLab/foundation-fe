import { useState, useRef, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ImagePopUp from '../ui/ImagePopUp';
import '../test.css';

export default function SwiperMainCarousel({ images, id }) {
  const swiperRef = useRef(null);
  const thumbSwiperRef = useRef(null);
  const [imageDialogue, setImageDialogue] = useState(false);
  const [selectedImg, setSelectedImg] = useState('');
  const [activeSlideIndex1, setActiveSlideIndex1] = useState(0);

  const closeDialogue = () => setImageDialogue(false);

  useEffect(() => {
    const swiperEl = swiperRef.current;
    if (swiperEl) {
      swiperEl.initialize();
      swiperEl.swiper.on('slideChange', () => {
        setActiveSlideIndex1(swiperEl.swiper.activeIndex);
      });
    }
  }, []);

  useEffect(() => {
    if (thumbSwiperRef.current && thumbSwiperRef.current.swiper) {
      thumbSwiperRef.current.swiper.slideTo(activeSlideIndex1);
    }
  }, [activeSlideIndex1]);

  return (
    <>
      {imageDialogue && (
        <ImagePopUp
          images={images}
          selectedImg={selectedImg}
          imageDialogue={imageDialogue}
          closeDialogue={closeDialogue}
          id={id}
        />
      )}
      <main className="slider-main-container">
        <swiper-container
          ref={swiperRef}
          class={`mySwiper${id}`}
          thumbs-swiper={`.mySwiperThumbs${id}`}
          navigation="true"
          navigation-next-el={`.custom-next-button${id}`}
          navigation-prev-el={`.custom-prev-button${id}`}
          loop="true"
          centeredSlides="true"
        >
          {images.map((image, index) => (
            <swiper-slide key={index}>
              <div className="flex h-full items-center">
                <div
                  className="relative mx-auto h-fit w-fit p-4"
                  onClick={() => {
                    setImageDialogue(true);
                    setSelectedImg(image);
                  }}
                >
                  <img src={image} alt={`Slide ${index + 1}`} />
                  <p className="absolute left-1 top-1 flex size-6 items-center justify-center rounded-full bg-[#647785] p-[5px] text-center text-[10px] font-semibold text-white [text-shadow:1px_1px_1px_rgba(0,_0,_0,_0.9)]">
                    {index + 1}
                  </p>
                </div>
              </div>
            </swiper-slide>
          ))}
        </swiper-container>

        <div className={`nav-btn custom-prev-button${id} left-[0em] top-[calc(50%-10px)]`}>
          <div className="flex size-5 items-center justify-center rounded-full bg-[#647785] tablet:size-8">
            <FiChevronLeft className="size-4 text-white tablet:size-6" />
          </div>
        </div>

        <div className={`nav-btn custom-next-button${id} right-[0em] top-[calc(50%-10px)]`}>
          <div className="flex size-5 items-center justify-center rounded-full bg-[#647785] tablet:size-8">
            <FiChevronRight className="size-4 text-white tablet:size-6" />
          </div>
        </div>
      </main>

      <swiper-container
        ref={thumbSwiperRef}
        class={`mySwiperThumbs${id} mySwiper2 swipperNormal`}
        slides-per-view="auto"
        free-mode="true"
        watch-slides-progress="true"
        initialSlide={activeSlideIndex1}
      >
        {images.map((image, index) => (
          <swiper-slide key={index}>
            <div className={`flex h-full w-full min-w-[90px] items-center justify-center tablet:min-w-fit`}>
              <div className="relative px-2 tablet:px-3 tablet:py-0">
                <img src={image} className="max-h-[80px] tablet:max-h-[90px]" alt={`Thumbnail ${index + 1}`} />
                <p className="absolute -top-2 left-0 flex size-6 items-center justify-center rounded-full bg-[#647785] p-1 text-center text-[10px] font-semibold text-white [text-shadow:1px_1px_1px_rgba(0,_0,_0,_0.9)] tablet:-top-1 tablet:left-1">
                  {index + 1}
                </p>
              </div>
            </div>
          </swiper-slide>
        ))}
      </swiper-container>
    </>
  );
}
