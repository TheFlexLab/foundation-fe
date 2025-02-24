import { Link } from 'react-router-dom';
import { PostArticlesCardProps } from '../../../../types/seldon';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

const splideOptions = {
  perPage: 2,
  perMove: 1,
  pagination: false,
  gap: '1rem',
  padding: '2rem',
  omitEnd: true,
  focus: 'center' as const,
  width: '100%',
  breakpoints: {
    600: {
      perPage: 2,
      padding: '1rem',
    },
    1280: {
      perPage: 3,
    },
  },
};

export default function PostArticlesCard({ questStartData }: PostArticlesCardProps) {
  const { articles } = questStartData;

  return (
    <>
      {articles?.length > 0 && (
        <div className="flex flex-col gap-2 border-t-2 border-gray-250 py-2 dark:border-gray-100 tablet:gap-4 tablet:py-4">
          <h4 className="text-gray-1 px-4 text-[0.75rem] font-semibold leading-[15px] dark:text-white tablet:text-[1.25rem] tablet:leading-[23px]">
            Related articles {`(${articles?.length})`}
          </h4>
          {articles?.length > 1 ? (
            <Splide options={splideOptions}>
              {articles?.map((article: any) => (
                <SplideSlide key={article._id}>
                  <div className="flex h-[90px] max-h-[90px] w-full flex-col justify-between gap-[10px] rounded-lg border border-l-[16px] border-white-500 p-2 dark:border-gray-100 tablet:h-[140px] tablet:max-h-[140px] tablet:gap-3 tablet:rounded-2xl tablet:border-y-2 tablet:border-l-[25px] tablet:border-r-2 tablet:p-4">
                    <h5 className="text-gray line-clamp-3 overflow-hidden text-ellipsis break-words text-[10px] font-semibold italic leading-normal dark:text-white-400 tablet:text-[1rem]">
                      {article.title}
                    </h5>
                    <div className="flex w-full justify-end">
                      <Link
                        to={`/r/${article._id}`}
                        className="text-[10px] font-semibold leading-[121.4%] text-blue-200 underline dark:text-blue-600 tablet:text-[16px]"
                      >
                        Read Now
                      </Link>
                    </div>
                  </div>
                </SplideSlide>
              ))}
            </Splide>
          ) : (
            <div className="px-4">
              <div className="flex h-[90px] max-h-[90px] w-full flex-col justify-between gap-[10px] rounded-lg border border-l-[16px] border-white-500 p-2 dark:border-gray-100 tablet:h-[140px] tablet:max-h-[140px] tablet:gap-3 tablet:rounded-2xl tablet:border-y-2 tablet:border-l-[25px] tablet:border-r-2 tablet:p-4">
                <h5 className="text-gray line-clamp-3 overflow-hidden text-ellipsis break-words text-[10px] font-semibold italic leading-normal dark:text-white-400 tablet:text-[1rem]">
                  {articles[0].title}
                </h5>
                <div className="flex w-full justify-end">
                  <Link
                    to={`/r/${articles[0]._id}`}
                    className="text-[10px] font-semibold leading-[121.4%] text-blue-200 underline dark:text-blue-600 tablet:text-[16px]"
                  >
                    Read Now
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
