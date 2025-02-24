import { useState } from 'react';
import FullScreenPictureViewer from '../dialogue-boxes/FullScreenPictureViewer';
import '../test.css';

export default function SwiperSingleImage({ image }) {
  const [imageDialogue, setImageDialogue] = useState(false);
  const [isImageError, setIsImageError] = useState(false);

  const handleError = () => {
    setIsImageError(true);
  };

  const openDialogue = () => setImageDialogue(true);
  const closeDialogue = () => setImageDialogue(false);

  return (
    <>
      <FullScreenPictureViewer
        handleClose={closeDialogue}
        modalVisible={imageDialogue}
        content={image}
        isImageError={isImageError}
      />
      <div className="h-[260px]" onClick={openDialogue}>
        {!image || isImageError ? (
          <div className="flex h-full items-center justify-center text-center">This image is no longer available</div>
        ) : (
          <img
            src={image}
            alt="single img"
            className="mx-auto h-full max-h-[260px] w-fit rounded-[4.098px] object-contain tablet:rounded-[15px]"
            onError={handleError}
          />
        )}
      </div>
      {/* <main className="slider-main-container">
        <swiper-container centeredSlides="true">
          <swiper-slide>
            <div className="flex h-full items-center">
              <div className="relative mx-auto h-fit w-fit p-4" onClick={openDialogue}>
                <img src={image} alt={`Slide`} />
              </div>
            </div>
          </swiper-slide>
        </swiper-container>
      </main> */}
    </>
  );
}
