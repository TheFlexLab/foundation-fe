import { useEffect, useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function SwiperFullScreen({ images, selectedImg, id }) {
  const thumbSwiperRef = useRef(null);
  const index = images.indexOf(selectedImg);

  useEffect(() => {
    if (thumbSwiperRef.current && thumbSwiperRef.current.swiper) {
      thumbSwiperRef.current.swiper.slideTo(index);
    }
  }, [index]);

  return (
    <>
      <main className="slider-main-container slider-main-fullscreen">
        <swiper-container
          id="fullscreen-swiper-container"
          class="mySwiper"
          thumbs-swiper={`.mySwiperThumbs${id}`}
          navigation="true"
          navigation-next-el=".custom-next-button"
          navigation-prev-el=".custom-prev-button"
          initial-slide={`${images.indexOf(selectedImg)}`}
          loop="true"
          centeredSlides="true"
        >
          {images.map((image, index) => (
            <swiper-slide key={index} id="swiper-slide" className="swiperFullscreen">
              <div className=" mx-auto my-4 flex h-[70dvh] w-fit items-center tablet:h-[80dvh] ">
                <div className="relative h-fit w-fit p-4">
                  <img src={image} className="h-fit max-h-full w-full object-contain tablet:h-full" />
                  <p className="absolute left-1 top-1 flex size-6 items-center justify-center rounded-full bg-[#647785] p-[5px] text-center text-[10px] font-semibold text-white [text-shadow:1px_1px_1px_rgba(0,_0,_0,_0.9)]">
                    {index + 1}
                  </p>
                </div>
              </div>
            </swiper-slide>
          ))}
        </swiper-container>

        <div className="nav-btn custom-prev-button">
          <div className="flex size-5 items-center justify-center rounded-full bg-[#647785] tablet:size-8">
            <FiChevronLeft className="size-4 text-white tablet:size-6" />
          </div>
        </div>

        <div className="nav-btn custom-next-button">
          <div className="flex size-5 items-center justify-center rounded-full bg-[#647785] tablet:size-8">
            <FiChevronRight className="size-4 text-white tablet:size-6" />
          </div>
        </div>
      </main>

      <swiper-container
        ref={thumbSwiperRef}
        class={`mySwiperThumbs${id} mySwiper2 swiperFull`}
        slides-per-view="auto"
        free-mode="true"
        watch-slides-progress="true"
        initial-slide={`${images.indexOf(selectedImg)}`}
      >
        {images.map((image, index) => (
          <swiper-slide key={index}>
            <div className="flex h-full items-center">
              <div className="relative px-2 tablet:px-3 tablet:py-0">
                <img src={image} className="max-h-[80px] tablet:max-h-[90px]" />{' '}
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
