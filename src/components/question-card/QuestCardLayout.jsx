import { Link } from 'react-router-dom';
import { EmbededImage } from './EmbededImage';
import { EmbededVideo } from './EmbededVideo';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { isImageUrl } from '../../utils/embeddedutils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import showToast from '../ui/Toast';
import CardTopbar from './CardTopbar';
import PostTopBar from './PostTopBar';
import QuestBottombar from './QuestBottombar';
import EmbedStatusBar from '../../pages/Embed/EmbedStatusBar';
import DeletePostPopup from '../dialogue-boxes/DeletePostPopup';
import PostArticlesCard from '../../pages/features/seldon-ai/components/PostArticlesCard';
import * as HomepageApis from '../../services/api/homepageApis';
import SharedLinkAdminSection from '../admin-card-section/sharedlink-admin-section';

const QuestCardLayout = ({
  questStartData,
  playing,
  postProperties,
  questType,
  handleViewResults,
  handleStartTest,
  startTest,
  children,
}) => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const queryClient = useQueryClient();
  const [bookmarkStatus, setbookmarkStatus] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const imageGetter = useRef(null);

  useEffect(() => {
    setbookmarkStatus(questStartData.bookmark);
  }, [questStartData.bookmark]);

  const { mutateAsync: AddBookmark } = useMutation({
    mutationFn: HomepageApis.createBookmark,
    onSuccess: (resp) => {
      queryClient.setQueryData(['posts'], (oldData) => ({
        ...oldData,
        pages: oldData?.pages?.map((page) =>
          page.map((item) => (item._id === resp.data.id ? { ...item, bookmark: true } : item))
        ),
      }));
    },
    onError: (error) => {
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
    },
  });

  const { mutateAsync: DelBookmark } = useMutation({
    mutationFn: HomepageApis.deleteBookmarkById,
    onSuccess: (resp) => {
      queryClient.setQueryData(['posts'], (oldData) => ({
        ...oldData,
        pages: oldData?.pages?.map((page) =>
          page.map((item) => (item._id === resp.data.id ? { ...item, bookmark: false } : item))
        ),
      }));
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleBookmark = () => {
    if (questType === 'feedback') return;

    setbookmarkStatus((prevIsBookmarked) => !prevIsBookmarked);
    if (bookmarkStatus) {
      const params = {
        questForeignKey: questStartData._id,
        uuid: persistedUserInfo.uuid,
      };
      DelBookmark(params);
    } else {
      const params = {
        questForeignKey: questStartData._id,
        Question: questStartData.Question,
        whichTypeQuestion: questStartData.whichTypeQuestion,
        moderationRatingCount: questStartData.moderationRatingCount,
        uuid: persistedUserInfo.uuid,
      };
      AddBookmark(params);
    }
  };

  const handleClose = () => setModalVisible(false);

  return (
    <div
      className="card-iframe h-full max-w-[730px] rounded-[12.3px] border-2 border-gray-250 bg-white dark:border-gray-100 dark:bg-gray-200 tablet:rounded-[15px]"
      ref={imageGetter}
    >
      {postProperties === 'Embed' && <EmbedStatusBar />}
      <PostTopBar
        questStartData={questStartData}
        postProperties={postProperties}
        setDelModalVisible={setModalVisible}
      />
      {modalVisible && (
        <DeletePostPopup
          handleClose={handleClose}
          modalVisible={modalVisible}
          title={'Delete Post'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/hiddenposts/unhide/delIcon.svg`}
          id={questStartData._id}
        />
      )}
      {questStartData?.suppressed &&
        questStartData?.uuid === persistedUserInfo.uuid &&
        questStartData?.type !== 'embed' && (
          <div className="flex items-center justify-between border-b-2 border-gray-250 bg-white-300 px-5 py-2 text-[0.75rem] font-semibold leading-[15px] text-red-100 dark:border-gray-100 dark:bg-red-300 dark:text-red-400 tablet:py-[10px] tablet:text-[1.25rem] tablet:leading-[23px]">
            <h4 className="">SUPPRESSED</h4>
            {questStartData.uuid === localStorage.getItem('uuid') && (
              <Link to="/profile/feedback" className="underline">
                See Why
              </Link>
            )}
          </div>
        )}

      {questStartData.url &&
        questStartData.url.length !== 0 &&
        questStartData.url[0] !== '' &&
        (isImageUrl(questStartData.url) ? (
          <EmbededImage description={questStartData.description} url={questStartData.url} id={questStartData._id} />
        ) : (
          <EmbededVideo
            description={questStartData.description}
            url={questStartData.url}
            questId={questStartData._id}
            playing={playing}
          />
        ))}
      <CardTopbar
        questStartData={questStartData}
        bookmarkStatus={bookmarkStatus}
        handleBookmark={handleBookmark}
        postProperties={postProperties}
      />
      {children}
      <QuestBottombar questStartData={questStartData} postProperties={postProperties} />
      <PostArticlesCard questStartData={questStartData} />
      {(postProperties === 'SharedLinks' || postProperties === 'user-profile') && (
        <SharedLinkAdminSection
          questStartData={questStartData}
          postProperties={postProperties}
          handleStartTest={handleStartTest}
          handleViewResults={handleViewResults}
          startTest={startTest}
        />
      )}
    </div>
  );
};

export default QuestCardLayout;
