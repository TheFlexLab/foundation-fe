import SwiperMainCarousel from '../swiper/SwiperMainCarousel';
import SwiperSingleImage from '../swiper/SwiperSingleImage';

export const EmbededImage = ({ description, url, id }) => {
  return (
    <div className="mx-[22px] mt-[12px] rounded-[9.183px] border border-white-500 px-4 py-2 tablet:mx-[60px] tablet:mt-[23px] tablet:border-[2.755px] dark:border-gray-100">
      {url?.length === 1 ? <SwiperSingleImage image={url[0]} /> : <SwiperMainCarousel images={url} id={id} />}
    </div>
  );
};
