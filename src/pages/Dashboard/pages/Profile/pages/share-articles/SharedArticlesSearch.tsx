import { GrClose } from 'react-icons/gr';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from '../../../../../../utils/useDebounce';
import { newsFeedFilters, updateNewsFeedSearch } from '../../../../../../features/news-feed/newsFeedSlice';

export default function SharedArticlesSearch() {
  const dispatch = useDispatch();
  const getNewsFeedFilters = useSelector(newsFeedFilters);
  const [sharedArticlesSearch, setSharedArticlesSearch] = useState('');

  const handleSharedLinkSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSharedArticlesSearch(e.target.value);
  };

  const debouncedSharedSearch = useDebounce(sharedArticlesSearch, 1000);

  useEffect(() => {
    dispatch(updateNewsFeedSearch(debouncedSharedSearch));
  }, [debouncedSharedSearch]);

  useEffect(() => {
    if (getNewsFeedFilters.searchData === '') {
      setSharedArticlesSearch('');
    }
  }, [getNewsFeedFilters.searchData]);

  return (
    <>
      {location.pathname === '/profile/shared-articles' && (
        <div className="my-[15px] ml-[31px] hidden h-fit w-[18.75rem] min-w-[18.75rem] rounded-[15px] bg-white py-[23px] pl-[1.3rem] pr-[2.1rem] dark:border dark:border-gray-100 dark:bg-gray-200 laptop:block">
          <div className="relative">
            <div className="relative h-[45px] w-full">
              <input
                type="text"
                id="floating_outlined"
                className="peer block h-full w-full appearance-none rounded-[10px] border-2 border-[#707175] bg-transparent py-2 pl-5 pr-8 text-sm text-[#707175] focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-gray-300 dark:focus:border-blue-500 tablet:text-[18.23px]"
                value={sharedArticlesSearch}
                placeholder=""
                onChange={handleSharedLinkSearch}
              />
              <label
                htmlFor="floating_outlined"
                className="absolute left-[15px] start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-200 dark:text-white-100 peer-focus:dark:text-blue-500 tablet:text-[17px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
              >
                Search
              </label>
            </div>
            {getNewsFeedFilters.searchData && (
              <button
                className="absolute right-3 top-4"
                onClick={() => {
                  dispatch(updateNewsFeedSearch(''));
                }}
              >
                <GrClose className="h-4 w-4 text-[#ACACAC] dark:text-white" />
              </button>
            )}
            {!getNewsFeedFilters.searchData && (
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/search.svg`}
                alt="search"
                className="absolute right-3 top-4 h-4 w-4"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
