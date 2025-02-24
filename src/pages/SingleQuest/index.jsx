import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { getQuestsCustom, questImpression } from '../../services/api/questsApi';
import { getQuestByUniqueShareLink } from '../../services/api/homepageApis';
import Topbar from '../Dashboard/components/Topbar';
import DashboardLayout from '../Dashboard/components/DashboardLayout';
import QuestionCardWithToggle from '../Dashboard/pages/QuestStartSection/components/QuestionCardWithToggle';
import SystemNotificationCard from '../../components/posts/SystemNotificationCard';
import Loader from '../../components/ui/Loader';

const SingleQuest = () => {
  let { id } = useParams();
  const postId = id?.split('=')[1];
  const location = useLocation();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [postData, setPostData] = useState(null);

  const {
    data: singleQuestData,
    error,
    isError,
    isLoading,
    isSuccess,
    isFetching,
  } = useQuery({
    queryKey: ['questByShareLink'],
    queryFn: () => getQuestByUniqueShareLink(id),
    enabled: persistedUserInfo !== null && postId === undefined,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isSuccess && singleQuestData) {
      setPostData(singleQuestData?.data?.data);
      questImpression(id);
    }
  }, [isSuccess, singleQuestData?.data?.data]);

  const {
    data: sourcePosts,
    isSuccess: singlePostSuccess,
    isFetching: postByIdLoading,
    isError: postByIdError,
    error: postByIdErrorData,
  } = useQuery({
    queryKey: ['singlePostById'],
    queryFn: () => getQuestsCustom({ ids: [postId], uuid: persistedUserInfo?.uuid }),
    enabled: postId !== undefined,
  });

  useEffect(() => {
    if (singlePostSuccess && sourcePosts) {
      setPostData(sourcePosts);
    }
  }, [singlePostSuccess, sourcePosts]);

  // Add Meta Pixel script to the page head
  useEffect(() => {
    // Function to insert the script tag for Meta Pixel
    const insertMetaPixelScript = () => {
      // Check if the script is already added to avoid duplicate scripts
      if (document.getElementById('meta-pixel-script')) return;

      const script = document.createElement('script');
      script.id = 'meta-pixel-script';
      script.async = true;
      script.innerHTML = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1534508323834469');
          fbq('track', 'PageView');
        `;
      document.head.appendChild(script);

      // Add the noscript fallback for users with JavaScript disabled
      const noscript = document.createElement('noscript');
      noscript.innerHTML = `
          <img height="1" width="1" style="display:none"
          src="https://www.facebook.com/tr?id=1534508323834469&ev=PageView&noscript=1" />
        `;
      document.body.appendChild(noscript);
    };

    insertMetaPixelScript();

    // Cleanup to remove the script when the component unmounts
    return () => {
      const script = document.getElementById('meta-pixel-script');
      if (script) document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      {/* <WelcomePopup modalVisible={modalVisible} handleClose={closeWelcomeDialogue} /> */}
      {/* <SEO
        title={'Foundation'}
          description={singleQuestResp?.Question}
          url={import.meta.env.VITE_CLIENT_URL}
          image={`${import.meta.env.VITE_CLIENT_URL}/seo.svg`}
          type={'website'}
      /> */}
      {/* {singleQuestResp && (
        <SEO
          title={'Foundation'}
          description={singleQuestResp?.Question}
          url={import.meta.env.VITE_CLIENT_URL}
          image={`${import.meta.env.VITE_CLIENT_URL}/seo.svg`}
          type={'website'}
        />
      )} */}
      <Helmet>
        <script>
          {`
            window.prerenderReady = false;
          `}
        </script>
        {/* Meta prop */}
        <title>Foundation</title>
        <meta name="description" content={postData?.Question} />
        {/* OG */}
        <meta property="og:title" content="Foundation" />
        <meta property="og:description" content={postData?.Question} />
        <meta property="og:type" content="website" />
        {/* <meta name="theme-color" content={seoMeta.color} />
        <meta property="og:video" content={seoMeta.video} />
        <meta property="og:video:width" content={seoMeta.videoWidth} />
        <meta property="og:video:height" content={seoMeta.videoHeight} />
        <meta property="og:video:type" content={seoMeta.videoType} /> */}
        {/* Show Image Meta Tags */}
        <meta
          property="og:image"
          itemprop="image"
          content={`https://foundation-seo.s3.amazonaws.com/seo-logo-v2.png`}
        />
        <meta
          property="og:image:secure_url"
          itemprop="image"
          content={`https://foundation-seo.s3.amazonaws.com/seo-logo-v2.png`}
        />
        {/* <meta property="og:image:type" content="image/svg" /> */}
        {/* <meta property="og:audio" content={seoMeta.preview} />
        <meta property="og:audio:type" content="audio/vnd.facebook.bridge" />
        <meta property="og:audio:type" content="audio/mpeg" /> */}
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Foundation" />
        <meta property="twitter:description" content={postData?.Question} />
        <meta property="twitter:domain" content="on.foundation" />
        <meta property="twitter:image" content={`https://foundation-seo.s3.amazonaws.com/seo-logo-v2.png`} />
        <meta name="google" content="notranslate"></meta>
      </Helmet>
      <Topbar />
      <div className="w-full bg-[#F2F3F5] dark:bg-black">
        <DashboardLayout>
          <div className="relative mx-auto flex h-[calc(100dvh-91px)] w-full max-w-[778px] flex-col gap-2 overflow-y-auto py-2 no-scrollbar tablet:h-[calc(100vh-101px)] tablet:gap-5 laptop:mx-[331px] laptop:h-[calc(100vh-70px)] laptop:py-5">
            {(isLoading || isFetching || postByIdLoading) && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[24px] font-bold tablet:text-[25px]">
                <Loader />
              </div>
            )}
            {(isError || postByIdError) && (
              <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[24px] font-bold tablet:text-[25px]">
                {error?.response?.data?.message || postByIdErrorData?.response?.data?.message}
              </p>
            )}
            {/* {!postData && error !== '' ? (
              <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[24px] font-bold tablet:text-[25px]">
                {error?.response?.data?.message
                  ? error?.response?.data?.message
                  : 'An error occurred while fetching the quest.'}
              </p>
            ) : null} */}
            {postData &&
              postData?.map((item, index) =>
                item.id === 'guest_notification' ? (
                  <div key={index + 1} className="mx-auto w-full max-w-[778px] px-4 tablet:px-6">
                    <SystemNotificationCard post={item} />
                  </div>
                ) : (
                  <div key={index + 1} className="mx-auto w-full max-w-[778px] px-4 tablet:px-6">
                    <QuestionCardWithToggle
                      questStartData={item}
                      isBookmarked={false}
                      isSingleQuest={location.pathname.includes('/p/') ? true : false}
                      postLink={id}
                    />
                  </div>
                )
              )}
          </div>
        </DashboardLayout>
      </div>
    </>
  );
};

export default SingleQuest;
