import { useQuery } from '@tanstack/react-query';
import { getQuestsCustom } from '../../../../services/api/questsApi';
import { useDispatch, useSelector } from 'react-redux';
import { getQuestUtils } from '../../../../features/quest/utilsSlice';
import { FaSpinner } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import { useDebounce } from '../../../../utils/useDebounce';
import { TextareaAutosize } from '@mui/material';
import { searchPosts } from '../../../../services/api/listsApi';
import DotsLoading from '../../../../components/ui/DotsLoading';
import QuestionCardWithToggle from '../../../Dashboard/pages/QuestStartSection/components/QuestionCardWithToggle';
import {
  addMultipleSourcesAtStart,
  addSourceAtStart,
  getSeldonDataStates,
  removeSource,
} from '../../../../features/seldon-ai/seldonDataSlice';
import { Button } from '../../../../components/ui/Button';
import { useLocation } from 'react-router-dom';
import ViewMyLists from './ViewMyLists';

export default function SourcePosts({ apiResp }: { apiResp?: any }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const link = location.pathname.split('/');
  const getSeldonDataState = useSelector(getSeldonDataStates);
  const [seldonsData, setSeldonsData] = useState(location.pathname.startsWith('/r') ? apiResp : getSeldonDataState);
  const questUtils = useSelector(getQuestUtils);
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [searchPost, setSearchPost] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [showMorePosts, setShowMorePosts] = useState(false);
  const [searchPostLoad, setSearchPostLoad] = useState(false);
  const debouncedSearch = useDebounce(searchPost, 1000);
  const [viewLists, setViewLists] = useState(false);

  const closeViewList = () => setViewLists(false);

  useEffect(() => {
    if (location.pathname.startsWith('/r')) {
      setSeldonsData(apiResp);
    } else {
      setSeldonsData(getSeldonDataState);
    }
  }, [apiResp, getSeldonDataState]);

  const transformSelectedPost = (selectedPost: any) => {
    setSelectedPost(null);
    dispatch(addSourceAtStart(selectedPost._id));
  };

  useEffect(() => {
    const handleSearchPost = async () => {
      setSearchPostLoad(true);
      if (debouncedSearch) {
        const resp = await searchPosts(debouncedSearch, persistedUserInfo.uuid);
        setSearchResult(resp?.data);
      }
      setSearchPostLoad(false);
    };

    handleSearchPost();
  }, [debouncedSearch]);

  const { data: sourcePosts, isFetching } = useQuery({
    queryKey: ['sourcePosts', seldonsData.source],
    queryFn: () => getQuestsCustom({ ids: seldonsData.source, uuid: persistedUserInfo.uuid }),
    enabled: seldonsData.source.length === 0 ? false : true,
    refetchOnWindowFocus: false,
  });

  return (
    <div
      id="posts-list"
      className={`mt-4 flex flex-col gap-4 ${seldonsData.source.length !== 0 && 'border-t-2'} border-gray-100 pt-8 tablet:mt-4 tablet:pt-10`}
    >
      {seldonsData.source.length !== 0 && (
        <div className="space-y-1">
          <h1 className="text-center text-[16px] font-bold tablet:text-[24px]">Posts that informed this article</h1>{' '}
          <h5 className="text-center text-[14px] tablet:text-[20px]">
            Engage with these posts to further shape or refine this article's findings.
          </h5>
        </div>
      )}
      {!location.pathname.includes('/r') && (
        <>
          <div className="relative w-full rounded-[5.387px] border border-white-500 dark:border-gray-100 tablet:rounded-[10px] tablet:border-[3px]">
            <TextareaAutosize
              value={(selectedPost && selectedPost?.Question) ?? searchPost}
              placeholder="Add more sources..."
              className="flex w-full resize-none items-center rounded-[5.387px] bg-white px-2 py-[6px] text-[10px] font-normal leading-[0.625rem] text-accent-600 focus-visible:outline-none dark:border-gray-100 dark:bg-transparent dark:text-gray-300 tablet:rounded-[10px] tablet:px-4 tablet:py-3 tablet:text-[20px] tablet:leading-[20px]"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setSelectedPost(null);
                setSearchPost(e.target.value);
              }}
            />
            {searchPost !== '' &&
              (searchPostLoad ? (
                <div className="flex w-full items-center justify-center py-6">
                  <FaSpinner className="size-6 animate-spin text-blue-200 tablet:size-16" />
                </div>
              ) : (
                <ul className="h-fit max-h-80 w-full overflow-y-auto border border-white-500 bg-white text-[10px] font-medium leading-normal text-[#707175] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:max-h-96 tablet:rounded-b-[10px] tablet:border-[3px] tablet:text-[15.7px]">
                  {searchResult?.map((post: any) => (
                    <li
                      key={post._id}
                      className="cursor-pointer px-4 py-[6px] tablet:py-2"
                      onClick={() => {
                        setSearchPost('');
                        setSearchResult([]);
                        transformSelectedPost(post);
                      }}
                    >
                      <div className="relative">
                        <div className="absolute left-0 top-0 z-50 size-full cursor-grab bg-transparent" />
                        <QuestionCardWithToggle questStartData={post} />
                      </div>
                    </li>
                  ))}
                </ul>
              ))}
          </div>
          <div className="w-fit">
            {viewLists && <ViewMyLists handleClose={closeViewList} modalVisible={viewLists} />}
            <Button variant="submit" onClick={() => setViewLists(true)}>
              View collections
            </Button>
          </div>
        </>
      )}
      <div className="flex flex-col gap-4">
        {isFetching ? (
          <DotsLoading />
        ) : (
          sourcePosts?.slice(0, showMorePosts ? sourcePosts.length : 3).map((post: any, index: number) => (
            <div key={index + 1} className="relative">
              {!location.pathname.includes('/r') && (
                <button
                  className="absolute -right-3 -top-3 z-50 flex size-8 items-center justify-center rounded-full bg-gray-100"
                  onClick={() => {
                    dispatch(removeSource(post._id));
                    setSeldonsData((prev: any) => ({
                      ...prev,
                      source: prev.source.filter((item: any) => item._id !== post._id),
                    }));
                  }}
                >
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/preferences/close.png`}
                    alt="close"
                    className="size-[10px] tablet:size-3.5"
                  />
                </button>
              )}
              <QuestionCardWithToggle
                key={post._id}
                questStartData={post}
                playing={post._id === questUtils.playerPlayingId && questUtils.isMediaPlaying}
                articleId={location.pathname.startsWith('/r') ? link[link.length - 1] : apiResp?.articleId}
              />
            </div>
          ))
        )}
        <div className="flex justify-center">
          {sourcePosts?.length > 3 && !showMorePosts && (
            <Button
              variant="submit"
              className="max-w-fit"
              onClick={() => {
                setShowMorePosts(true);
              }}
            >
              Show more
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
