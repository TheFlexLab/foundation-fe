import { useState } from 'react';
import { GrClose } from 'react-icons/gr';
import { Button } from '../../../../components/ui/Button';
import { useDebounce } from '../../../../utils/useDebounce';
import { fetchLists } from '../../../../services/api/listsApi';
import { useQuery } from '@tanstack/react-query';
import PopUp from '../../../../components/ui/PopUp';
import { useDispatch } from 'react-redux';
import { addMultipleSourcesAtStart } from '../../../../features/seldon-ai/seldonDataSlice';

export default function ViewMyLists({ handleClose, modalVisible }) {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [selectedOption, setSelectedOption] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // Track selected item
  const debouncedSearch = useDebounce(search, 1000);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const { data: listData, isError } = useQuery({
    queryFn: fetchLists,
    queryKey: ['collection'],
  });

  if (isError) {
    console.log('some error occur');
  }

  const handleCheckboxChange = (item) => {
    setSelectedItem(item);
    setSelectedOption((prevSelectedOption) => {
      if (prevSelectedOption.includes(item._id)) {
        return prevSelectedOption.filter((id) => id !== item._id);
      } else {
        return [...prevSelectedOption, item._id];
      }
    });
  };

  const handleSelectedList = () => {
    if (!selectedItem) return;

    const questIds = selectedItem.post.map((post) => post.questForeginKey._id);

    dispatch(addMultipleSourcesAtStart(questIds));

    handleClose();
  };

  return (
    <PopUp
      logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/addToListWhite.svg`}
      title={'Collections'}
      open={modalVisible}
      handleClose={handleClose}
      isBackground={false}
    >
      <div className="px-[27px] py-3 tablet:px-[74px] tablet:py-[37px]">
        {listData?.length >= 1 && (
          <>
            <h4 className="text-gray-1 text-[10px] font-medium leading-normal dark:text-gray-300 tablet:text-[20px] tablet:font-semibold">
              Collections
            </h4>
            <div className="relative my-3 tablet:my-[25px]">
              <div className="relative h-[23px] w-full tablet:h-[46px]">
                <input
                  type="text"
                  id="floating_outlined"
                  className="peer block h-full w-full min-w-[280px] appearance-none rounded-[8px] border-[0.59px] border-[#707175] bg-transparent py-2 pl-5 pr-8 text-sm text-[#707175] focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-100 dark:bg-accent-100 dark:text-gray-300 dark:focus:border-blue-500 tablet:min-w-full tablet:rounded-[10px] tablet:border-2 tablet:text-[18.23px]"
                  value={search}
                  placeholder=""
                  onChange={handleSearch}
                />
                <label
                  htmlFor="floating_outlined"
                  className="absolute left-[15px] start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-[9px] text-sm text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-accent-100 dark:text-gray-300 peer-focus:dark:text-blue-500 tablet:text-[17px]"
                >
                  Search
                </label>
              </div>
              {search && (
                <button className="absolute right-3 top-1/2 translate-y-[-50%] transform" onClick={() => setSearch('')}>
                  <GrClose className="h-4 w-4 text-[#ACACAC] dark:text-white" />
                </button>
              )}
              {!search && (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/search.svg`}
                  alt="search"
                  className="absolute right-3 top-1/2 h-4 w-4 translate-y-[-50%] transform"
                />
              )}
            </div>
            <div className="flex h-fit max-h-[160px] flex-col gap-2 overflow-y-auto no-scrollbar tablet:max-h-[280px] tablet:gap-4">
              {listData
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                ?.filter((list) => {
                  if (debouncedSearch === '') {
                    return true;
                  }
                  return list.category.toLowerCase().includes(debouncedSearch.toLowerCase());
                })
                .map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between rounded-[4.161px] border-[1.248px] border-white-500 bg-[#FBFBFB] p-2 dark:border-gray-100 dark:bg-accent-100 tablet:rounded-[10px] tablet:border-[3px] tablet:p-5"
                  >
                    <div className="w-fit space-y-2 tablet:space-y-5">
                      <h4 className="text-gray-1 text-[10px] font-normal leading-[10px] dark:text-gray-300 tablet:text-[20px] tablet:font-medium tablet:leading-[20px]">
                        {item.category}
                      </h4>
                      <h4 className="text-[8px] font-normal leading-[8px] text-[#9A9A9A] dark:text-gray-300 tablet:text-[18px] tablet:font-medium tablet:leading-[18px]">
                        {item.post.length} Post{item.post.length > 1 ? 's' : ''}
                      </h4>
                    </div>
                    <div id="custom-rating-checkbox" className="flex h-full items-center">
                      <input
                        id={`checkbox-${item._id}`}
                        type="checkbox"
                        className="checkbox h-[13.5px] w-[13.5px] rounded-full tablet:h-[25px] tablet:w-[25px]"
                        checked={selectedOption.includes(item._id)}
                        onChange={() => {
                          handleCheckboxChange(item);
                        }}
                        readOnly
                      />
                    </div>
                  </div>
                ))}
              <div className="flex justify-end gap-4">
                <Button
                  variant="submit"
                  className={'bg-[#7C7C7C]'}
                  onClick={handleSelectedList}
                  disabled={!selectedItem} // Disable if no item is selected
                >
                  Import list
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </PopUp>
  );
}
