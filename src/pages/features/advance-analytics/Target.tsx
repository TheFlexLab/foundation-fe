import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { TextareaAutosize } from '@mui/material';
import { Button } from '../../../components/ui/Button';
import { useDebounce } from '../../../utils/useDebounce';
import { searchPosts } from '../../../services/api/listsApi';
import { AddBadgeProps } from '../../../types/advanceAnalytics';
import { getSingleQuest } from '../../../services/api/homepageApis';
import { useAnalyzeTargetMutation } from '../../../services/mutations/advance-analytics';
import SelectionOption from '../../../components/SelectionOption';
import QuestionCardWithToggle from '../../Dashboard/pages/QuestStartSection/components/QuestionCardWithToggle';

export default function Target({ handleClose, questStartData, update, selectedItem, userQuestSettingRef = "false" }: AddBadgeProps) {
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [searchPost, setSearchPost] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [searchPostLoad, setSearchPostLoad] = useState(false);
  const debouncedSearch = useDebounce(searchPost, 1000);
  const { mutateAsync: handleAnalyzePost, isPending } = useAnalyzeTargetMutation({ handleClose });

  function filterQuestAnswers(selectedPost: any[], advanceAnalytics: any[]): any[] {
    return selectedPost.map((item: any) => ({
      ...item,
      selected: advanceAnalytics?.some(
        (analytic: any) =>
          analytic.targetedQuestForeignKey === item.questForeignKey &&
          analytic.targetedOptionsArray.includes(item.option),
      ),
    }));
  }

  const transformSelectedPost = (selectedPost: any) => {
    let options;

    switch (selectedPost?.whichTypeQuestion) {
      case 'yes/no':
        options = ['Yes', 'No'];
        break;
      case 'agree/disagree':
        options = ['Agree', 'Disagree'];
        break;
      case 'like/dislike':
        options = ['Like', 'Dislike'];
        break;
      default:
        options = selectedPost.QuestAnswers?.map((option: any) => option.question) || [];
        break;
    }

    let transformedPost = options.map((option: any, index: number) => ({
      id: index + 1,
      question: selectedPost?.Question,
      option: option,
      questForeignKey: selectedPost._id,
      selected: false,
    }));

    transformedPost = filterQuestAnswers(transformedPost, questStartData?.advanceAnalytics);

    setSelectedPost(transformedPost);
  };

  useEffect(() => {
    const handleSearchPost = async () => {
      setSearchPostLoad(true);
      if (debouncedSearch) {
        const resp = await searchPosts(debouncedSearch, persistedUserInfo.uuid, userQuestSettingRef === "true" ? "SharedLink" : "");
        setSearchResult(resp?.data);
      }
      setSearchPostLoad(false);
    };

    handleSearchPost();
  }, [debouncedSearch]);

  const handleOptionSelection = (data: any) => {
    setSelectedPost((prevSelected: any[]) => {
      if (update) {
        return prevSelected.map((option: any) =>
          option.id === data.id ? { ...option, selected: true } : { ...option, selected: false },
        );
      } else {
        return prevSelected.map((option: any) =>
          option.id === data.id ? { ...option, selected: !option.selected } : option,
        );
      }
    });
  };

  const { data: targetPost, isFetching } = useQuery({
    queryFn: async () => {
      return (await getSingleQuest(persistedUserInfo.uuid, selectedItem?.targetedQuestForeignKey)).data.data[0];
    },
    queryKey: ['editTargetPost', selectedItem?.targetedQuestForeignKey],
    enabled: update,
  });

  useEffect(() => {
    if (update && targetPost) {
      transformSelectedPost(targetPost);
    }
  }, [update, targetPost]);

  return (
    <div className="flex flex-col">
      <h1 className="summary-text my-2 text-center tablet:my-4">You can select a targeted option</h1>
      <div className="flex flex-col items-center justify-center gap-[15px]">
        <div className="relative w-full rounded-[5.387px] border border-white-500 dark:border-gray-100 tablet:rounded-[10px] tablet:border-[3px]">
          <TextareaAutosize
            value={(selectedPost && selectedPost[0]?.question) ?? searchPost}
            placeholder="Search Post"
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
              <ul className="absolute z-10 h-fit max-h-80 w-full overflow-y-auto border border-white-500 bg-white text-[10px] font-medium leading-normal text-[#707175] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:max-h-96 tablet:rounded-b-[10px] tablet:border-[3px] tablet:text-[15.7px]">
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
        {!isFetching ? (
          selectedPost?.length > 0 && (
            <ul className="flex h-full max-h-[82.77px] w-full flex-col gap-[5.7px] overflow-y-scroll tablet:max-h-[167px] tablet:gap-[10px]">
              {selectedPost?.map((post: any) => (
                <SelectionOption key={post.id} data={post} handleSelection={handleOptionSelection} />
              ))}
            </ul>
          )
        ) : (
          <div className="flex w-full items-center justify-center py-6">
            <FaSpinner className="size-6 animate-spin text-blue-200 tablet:size-16" />
          </div>
        )}
      </div>
      <div className="mt-2 flex w-full justify-end tablet:mt-4">
        <Button
          variant={selectedPost?.some((option: any) => option.selected) ? 'submit' : 'submit-hollow'}
          className=""
          disabled={isPending || !selectedPost?.some((option: any) => option.selected)}
          rounded={false}
          onClick={() => {
            const modifiedArray = selectedPost
              ?.filter((item: { selected: boolean }) => item.selected)
              .map((item: { option: string }) => item.option);

            handleAnalyzePost({
              userUuid: persistedUserInfo.uuid,
              questForeignKey: questStartData._id,
              targetedOptionsArray: modifiedArray,
              targetedQuestForeignKey: selectedPost[0].questForeignKey,
              id: update ? selectedItem?._id : null,
              order: update ? selectedItem?.order : null,
            } as any);
          }}
        >
          {isPending === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Target'}
        </Button>
      </div>
    </div>
  );
}
