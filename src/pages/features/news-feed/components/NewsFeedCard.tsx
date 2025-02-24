import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../../../components/ui/Button';
import { calculateTimeAgo } from '../../../../utils/utils';
import { NewsFeedPropsType } from '../../../../types/news-feed';
import { setSeldonData } from '../../../../features/seldon-ai/seldonDataSlice';
import { setGuestSignUpDialogue } from '../../../../features/extras/extrasSlice';
import { handleSeldonInput, setInputState } from '../../../../features/seldon-ai/seldonSlice';
import Copy from '../../../../assets/Copy';
import ShareNewsArticle from './ShareNewsArticle';
import ShareArticleCard from '../../../Dashboard/pages/Profile/pages/share-articles/ShareArticleCard';

export default function NewsFeedCard(props: NewsFeedPropsType) {
  const { data, innerRef, postType } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const persistedTheme = useSelector((state: any) => state.utils.theme);
  const isPseudoBadge = persistedUserInfo?.badges?.some((badge: any) => (badge?.pseudo ? true : false));
  const [copyModal, setCopyModal] = useState(false);

  const handleCopyClose = () => {
    setCopyModal(false);
  };

  const handleUpdateArticle = () => {
    dispatch(
      setSeldonData({
        title: data?.title,
        abstract: data?.abstract,
        seoSummary: data?.seoSummary,
        groundBreakingFindings: data?.groundBreakingFindings,
        suggestions: data?.suggestions,
        source: data?.source,
        discussion: data?.discussion,
        conclusion: data?.conclusion,
        debug: '',
        articleId: data?._id,
        prompt: data?.prompt,
        createdAt: data?.createdAt,
        updatedAt: data?.updatedAt,
        seoImage: data.s3Urls[0],
      })
    );
    dispatch(handleSeldonInput({ name: 'isTitle', value: true }));
    dispatch(handleSeldonInput({ name: 'question', value: data?.prompt }));
    if (data.settings) dispatch(setInputState(data?.settings));

    navigate('/seldon-ai');
  };

  const handleSharePostClick = () => {
    if (persistedUserInfo?.role === 'guest' || persistedUserInfo?.role === 'visitor') {
      dispatch(setGuestSignUpDialogue(true));
      return;
    } else {
      setCopyModal(true);
    }
  };

  return (
    <div
      ref={innerRef}
      className="h-full max-w-[730px] rounded-[12.3px] border-2 border-gray-250 bg-white dark:border-gray-100 dark:bg-gray-200 tablet:rounded-[15px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b-2 border-gray-250 px-[0.57rem] py-[5px] dark:border-gray-100 tablet:px-[15px] tablet:py-3">
        {/* Category Name */}
        <h1 className="text-[0.6rem] font-medium text-gray-1 dark:text-white-200 tablet:text-[1.13531rem] laptop:text-[1.2rem]">
          Article
        </h1>
        <div className="flex h-4 w-fit items-center gap-1 rounded-[0.625rem] md:h-[1.75rem] tablet:gap-2">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/clock.svg' : 'assets/svgs/dashboard/clock-outline.svg'}`}
            alt="clock"
            className="h-[8.64px] w-[8.64px] tablet:h-[20.5px] tablet:w-[20.4px]"
          />
          <h4 className="whitespace-nowrap text-[0.6rem] font-normal text-gray-1 dark:text-white tablet:text-[1.13531rem] laptop:text-[1.2rem]">
            {calculateTimeAgo(data?.createdAt)}
          </h4>
        </div>
      </div>
      {/* Body */}
      <div className="flex flex-col justify-between gap-2 px-[13.92px] pb-[15px] pt-2 tablet:gap-4 tablet:px-10 tablet:pb-6 tablet:pt-4">
        <h4 className="text-[12px] font-semibold text-gray dark:text-white tablet:text-[18px]">{data?.title}</h4>
        <p className="text-[10px] font-medium leading-[13.56px] text-gray-1 dark:text-white tablet:text-[17px] tablet:leading-normal">
          {data?.seoSummary}
        </p>
        <div className="flex w-full items-center justify-between gap-4">
          {isPseudoBadge ? (
            <Button
              variant={'g-submit'}
              className={'!laptop:px-0 w-full whitespace-nowrap bg-yellow-300 !px-0'}
              onClick={handleUpdateArticle}
            >
              Update Article
            </Button>
          ) : (
            <button className="w-full cursor-default">&#x200B;</button>
          )}
          <Button
            variant={'g-submit'}
            className={'!laptop:px-0 w-full whitespace-nowrap !px-0'}
            onClick={() => {
              navigate(`/r/${data?._id}`);
            }}
          >
            Read More
          </Button>
        </div>
      </div>
      {/* Footer */}
      <div className="relative flex items-center justify-between border-t-2 border-gray-250 px-[0.57rem] py-[5px] dark:border-gray-100 tablet:px-5 tablet:py-3">
        {/* Share */}
        <button
          className={`flex h-[14.5px] w-fit items-center gap-1 tablet:h-[28.8px] tablet:gap-2`}
          onClick={handleSharePostClick}
        >
          {persistedTheme === 'dark' ? <Copy /> : <Copy />}
          <h1 className="text-[0.6rem] font-medium leading-[0.6rem] text-gray-1 dark:text-white-200 tablet:text-[1.13531rem] tablet:leading-[1.13531rem] laptop:text-[1.2rem] laptop:leading-[1.2rem]">
            Share
          </h1>
        </button>
      </div>
      {copyModal && (
        <ShareNewsArticle
          modalVisible={copyModal}
          handleClose={handleCopyClose}
          title={'Share Article'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/CopyIcon.svg`}
          questStartData={data}
        />
      )}
      {(postType === 'sharedArticles' || postType === 'user-profile') && (
        <ShareArticleCard key={data._id} data={data} innerRef={null} />
      )}
    </div>
  );
}
