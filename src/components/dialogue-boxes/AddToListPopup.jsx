import { toast } from 'sonner';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '../ui/Button';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { GrClose } from 'react-icons/gr';
import { addPostinAList, createList, fetchLists } from '../../services/api/listsApi';
import PopUp from '../ui/PopUp';
import { useEffect } from 'react';
import { useDebounce } from '../../utils/useDebounce';
import showToast from '../ui/Toast';
import { useNavigate } from 'react-router-dom';

export default function AddToListPopup({ handleClose, modalVisible, questStartData, page }) {
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [listName, setListName] = useState('');
  const [search, setSearch] = useState('');
  const [selectedOption, setSelectedOption] = useState([]);
  const debouncedSearch = useDebounce(search, 1000);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const { mutateAsync: createNewList, isPending: IsLoadingCreate } = useMutation({
    mutationFn: createList,
    onSuccess: (resp) => {
      if (resp.status === 200) {
        queryClient.invalidateQueries(['collection']);
        setSelectedOption((prev) => [resp.data.userList[resp.data.userList.length - 1]._id, ...prev]);
        setListName('');
        if (page === 'my-collection') {
          handleClose();
        }
      }

      if (resp?.response?.status === 500) {
        showToast('warning', 'listAlreadyExists');
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutateAsync: addPostInList, isPending: isLoading } = useMutation({
    mutationFn: addPostinAList,
    onSuccess: (resp) => {
      if (resp.response?.status === 409) {
        toast.warning(resp.response.data.message);
      }
      if (resp.status === 200) {
        showToast('success', 'postAddedtoList');
        queryClient.invalidateQueries(['collection']);
        handleClose();
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const {
    data: listData,
    isError,
    isPending,
  } = useQuery({
    queryFn: fetchLists,
    queryKey: ['collection'],
  });

  if (isError) {
    console.log('some error occur');
  }

  const handleCheckboxChange = (itemId) => {
    setSelectedOption((prevSelectedOption) => {
      if (prevSelectedOption.includes(itemId)) {
        return prevSelectedOption.filter((id) => id !== itemId);
      } else {
        return [...prevSelectedOption, itemId];
      }
    });
  };

  useEffect(() => {
    const selectedItems =
      listData &&
      listData
        ?.map((collection) => {
          if (Array.isArray(collection?.post)) {
            const matchingPosts = collection?.post.filter((post) => post?.questForeginKey?._id === questStartData?._id);
            return matchingPosts.length > 0 ? collection._id : null;
          }
          return null;
        })
        .filter((id) => id !== null);

    if (selectedItems && selectedItems.length > 0) {
      setSelectedOption((prev) => [...prev, ...selectedItems]);
    }
  }, [listData]);

  return (
    <PopUp
      logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/addToListWhite.svg`}
      title={page === 'my-collection' ? 'Create a new collection' : 'Add to Collections'}
      open={modalVisible}
      handleClose={handleClose}
      isBackground={false}
    >
      <div className="px-[27px] py-3 tablet:px-[74px] tablet:py-[37px]">
        {page !== 'my-collection' && (
          <p className="summary-text mb-2 tablet:mb-[25px]">
            Collections allow you to organize posts by topic and can function like surveys or playlists. Use the “Manage
            Collections” button to share them on other platforms. Shared collections will also be visible on your Home
            Page for everyone to see.
          </p>
        )}
        <div className="flex flex-col gap-2 tablet:gap-[10px]">
          {listData?.length === 0 && (
            <label className="text-gray-1 text-[10px] font-medium leading-normal dark:text-gray-300 tablet:text-[20px] tablet:font-semibold">
              You currently have no collections created. Enter a collection name below and the post will be added to it.
            </label>
          )}
          <input
            type="text"
            className="peer block h-[23px] w-full min-w-[280px] appearance-none rounded-[4.161px] border-[1.248px] border-white-500 bg-transparent py-[5px] pl-[6px] pr-8 text-[10px] font-normal leading-[10px] text-[#707175] focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-100 dark:bg-accent-100 dark:text-gray-300 tablet:h-full tablet:min-w-full tablet:rounded-[10px] tablet:border-2 tablet:py-2 tablet:pl-5 tablet:text-[18.23px]"
            value={listName}
            placeholder="Collection name"
            onChange={(e) => setListName(e.target.value)}
          />
        </div>
        <div className="mt-2 flex justify-end tablet:mt-[25px]">
          <Button
            variant={'submit'}
            className={'bg-[#7C7C7C]'}
            onClick={() => {
              if (!listName) {
                showToast('warning', 'emptyList');
                return;
              }
              createNewList({
                userUuid: persistedUserInfo.uuid,
                category: listName,
              });
            }}
          >
            {IsLoadingCreate === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Create'}
          </Button>
        </div>

        {page !== 'my-collection' && listData?.length >= 1 && (
          <>
            <hr className="mx-auto my-3 h-[0.86px] max-w-[90%] bg-[#9C9C9C] dark:bg-white tablet:my-[25px] tablet:h-[1.325px] tablet:max-w-[645px]" />
            <div>
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
                    className="te xt-sm absolute left-[15px] start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-[9px] text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-accent-100 dark:text-gray-300 peer-focus:dark:text-blue-500 tablet:text-[17px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
                  >
                    Search
                  </label>
                </div>
                {search && (
                  <button
                    className="absolute right-3 top-1/2 translate-y-[-50%] transform"
                    onClick={() => setSearch('')}
                  >
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
              <div className="mt-3 h-fit max-h-[160px] space-y-3 overflow-y-auto no-scrollbar tablet:mt-[15px] tablet:max-h-[280px] tablet:space-y-[15px]">
                {listData
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  ?.filter((collection) => {
                    if (debouncedSearch === '') {
                      return true;
                    }
                    return collection.category.toLowerCase().includes(debouncedSearch.toLowerCase());
                  })
                  .map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between rounded-[4.161px] border-[1.248px] border-white-500 bg-[#FBFBFB] p-2 dark:border-gray-100 dark:bg-accent-100 tablet:rounded-[10px] tablet:border-[3px] tablet:p-5"
                      onClick={() => handleCheckboxChange(item._id)}
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
                          readOnly
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="mt-[10px] flex justify-end gap-4 tablet:mt-[25px]">
              <Button
                variant="submit"
                className={'bg-[#7C7C7C]'}
                onClick={() => {
                  navigate('/profile/collection');
                }}
              >
                Manage Collections
              </Button>
              {selectedOption.length !== 0 ? (
                <Button
                  variant={'submit'}
                  onClick={() => {
                    addPostInList({
                      userUuid: persistedUserInfo.uuid,
                      categoryIdArray: selectedOption,
                      questForeginKey: questStartData._id,
                    });
                  }}
                >
                  {isLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Save'}
                </Button>
              ) : (
                <Button
                  variant="submit-hollow"
                  onClick={() => {
                    showToast('warning', 'emptyPostList');
                  }}
                >
                  Save
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </PopUp>
  );
}
