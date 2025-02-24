import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getQuestUtils } from '../../features/quest/utilsSlice';
import { useUpdateSpotLight } from '../../services/api/profile';
import CollectionCard from '../Dashboard/pages/Collection/components/CollectionCard';
import NewsFeedCard from '../features/news-feed/components/NewsFeedCard';
import QuestionCardWithToggle from '../Dashboard/pages/QuestStartSection/components/QuestionCardWithToggle';
import SummaryCard from '../../components/SummaryCard';
import { Button } from '../../components/ui/Button';

export default function Spotlight({ spotlight }: any) {
  const location = useLocation();
  const questUtils = useSelector(getQuestUtils);
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const isPublicProfile = location.pathname.startsWith('/h/');

  const { mutateAsync: handleSpotLight } = useUpdateSpotLight();

  return (
    <>
      <SummaryCard
        headerIcon="/assets/profile/homepagebadges.svg"
        headerTitle="Spotlight"
        isPublicProfile={isPublicProfile}
      >
        {!isPublicProfile && (
          <>
            {/* <h1 className="summary-text">
              Need Copy
            </h1> */}

            <div className="mt-3 flex w-full justify-center gap-3 tablet:mt-5">
              <Button
                variant={'submit'}
                onClick={() => {
                  const domain = persistedUserInfo.badges.find((badge: any) => badge.domain)?.domain.name;
                  const id = spotlight.spotLightType === 'lists' ? spotlight.category._id : spotlight._id;

                  handleSpotLight({ domain, type: spotlight.spotLightType, id, status: 'reset' });
                }}
              >
                Remove From Spotlight
              </Button>
            </div>
          </>
        )}
      </SummaryCard>

      <div className="mx-auto flex w-full max-w-[730px] flex-col items-center gap-3 tablet:gap-6">
        <div className="flex w-full flex-col gap-3 tablet:gap-5">
          {spotlight?.spotLightType === 'posts' ? (
            <QuestionCardWithToggle
              key={spotlight._id}
              questStartData={spotlight}
              playing={spotlight._id === questUtils.playerPlayingId && questUtils.isMediaPlaying}
            />
          ) : spotlight?.spotLightType === 'news' ? (
            <NewsFeedCard key={spotlight._id} data={spotlight} innerRef={null} />
          ) : spotlight?.spotLightType === 'lists' ? (
            <CollectionCard listData={[spotlight.category]} page="spotlight" />
          ) : null}
        </div>
      </div>
    </>
  );
}
