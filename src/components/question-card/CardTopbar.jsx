import { useSelector } from 'react-redux';
import { capitalizeFirstLetter } from '../../utils/utils';
import BookmarkIcon from '../../pages/Dashboard/pages/QuestStartSection/components/BookmarkIcon';

const CardTopbar = ({ questStartData, bookmarkStatus, handleBookmark, postProperties }) => {
  const persistedTheme = useSelector((state) => state.utils.theme);

  return (
    <div className="flex flex-col justify-between border-gray-250 px-[0.87rem] pt-2 tablet:px-10 tablet:pt-4">
      <div className="flex items-start justify-between border-gray-250">
        <div className="flex flex-col gap-[10px] tablet:gap-[18px]">
          <div className="mt-[1.5px] flex gap-1.5 pr-5 tablet:mt-[3px] tablet:gap-3 tablet:pr-6">
            <h4 className="text-gray text-[0.75rem] font-semibold leading-[15px] dark:text-white-400 tablet:text-[1.25rem] tablet:leading-[23px]">
              {capitalizeFirstLetter(questStartData.Question)}
            </h4>
          </div>
        </div>

        {postProperties !== 'HiddenPosts' &&
          postProperties !== 'preview' &&
          questStartData?.type !== 'embed' &&
          questStartData?.page !== 'advance-analytics' && (
            <BookmarkIcon
              bookmarkStatus={bookmarkStatus}
              persistedTheme={persistedTheme}
              handleBookmark={handleBookmark}
            />
          )}
      </div>
    </div>
  );
};

export default CardTopbar;
