import ProfileCard from './ProfileCard';
import SharedPosts from './SharedPosts';
import SharedLists from './SharedLists';
import Spotlight from './Spotlight';
import NewsArticles from './NewsArticles';
import { useFetchMyProfile } from '../../services/api/profile';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Loader from '../../components/ui/Loader';
import { Button } from '../../components/ui/Button';
import LinkHub from './LinkHub';
import HomepageBadge from '../Dashboard/pages/Profile/pages/verification-badges/HomepageBadge';
import SummaryCard from '../../components/SummaryCard';
import HomepageBadgePopup from '../../components/dialogue-boxes/HomepageBadgePopup';
import BadgeHub from './BadgeHub';
import BadgeHubPopup from '../../components/dialogue-boxes/BadgeHubPopup';
import SetFDX from './components/SetFDX';

export default function UserProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const isPublicProfile = location.pathname.startsWith('/h/');
  const [isPersonalPopup, setIsPersonalPopup] = useState(false);
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const [domain, setDomain] = useState('');
  const [isBadgeHubPopup, setIsBadgeHubPopup] = useState(false);
  const checkPseudoBadge = () => persistedUserInfo?.badges?.some((badge: any) => (badge?.pseudo ? true : false));
  const isDomainBadge = persistedUserInfo?.badges?.some((badge: any) => !!badge?.domain) || false;

  useEffect(() => {
    if (location.pathname.startsWith('/h/')) {
      setDomain(location.pathname.split('/')[2]);
    } else {
      setDomain(persistedUserInfo.badges.find((badge: any) => badge.domain)?.domain.name);
    }
  }, [isDomainBadge]);

  const { data, isLoading, error, isFetching, isError } = useFetchMyProfile(
    domain,
    persistedUserInfo.uuid,
    location.pathname.startsWith('/h/') ? true : false
  );

  const totalViewerCount =
    data?.linkHub?.personal?.linkHub?.reduce((sum: number, item: { viewerCount: any[] }) => {
      return sum + (Array.isArray(item.viewerCount) ? item.viewerCount.length : 0);
    }, 0) || 0;

  if (isLoading || isFetching) {
    return (
      <div className="mt-10 flex h-fit w-full justify-center">
        <Loader />
      </div>
    );
  }

  if (error?.message === 'No such page exists.' || isError) {
    return (
      <div className="mt-16 flex h-full w-full flex-col items-center text-[#616161] dark:text-[#f1f1f1]">
        <h1 className="text-[32px] font-bold leading-normal">Sorry!</h1>
        <h2 className="text-[26px] font-semibold leading-normal text-[#616161] dark:text-[#f1f1f1]">Page not found</h2>
        <Button variant="submit" className="mt-10" onClick={() => navigate('/')}>
          Go to Homepage
        </Button>
        <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/404.svg`}
          alt="page not found"
          className="h-[286px] w-full max-w-[333px] tablet:max-w-[444px]"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto mb-4 flex w-full max-w-[778px] flex-col gap-3 px-4 tablet:mb-8 tablet:gap-6 tablet:px-6">
      {isPersonalPopup && (
        <HomepageBadgePopup
          isPopup={isPersonalPopup}
          setIsPopup={setIsPersonalPopup}
          title="Domain"
          logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/domain.svg`}
          edit={true}
          setIsPersonalPopup={setIsPersonalPopup}
          handleSkip={null}
          onboarding={null}
          progress={null}
        />
      )}
      {isBadgeHubPopup && (
        <BadgeHubPopup
          isPopup={isBadgeHubPopup}
          setIsPopup={setIsBadgeHubPopup}
          title="Badge Hub"
          logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/domain-badge.svg`}
        />
      )}
      {!domain ? (
        <div className="dar flex flex-col items-center justify-center gap-2 rounded-[10px] border-[1.85px] border-[#D9D9D9] bg-[#FDFDFD] px-5 py-3 dark:border-gray-100 dark:bg-gray-200 tablet:rounded-[10px] tablet:p-5">
          <h1 className="text-[11px] leading-normal text-gray-1 dark:text-[#f1f1f1] tablet:text-[18px]">
            Claim your domain name to enable your Home Page and create a personalized hub. Share posts, collections,
            news articles, and important links. Gain insights into your audience through key metrics and engagement
            results.
          </h1>

          <HomepageBadge checkPseudoBadge={checkPseudoBadge} isProfile={false} isDomain={true} />
        </div>
      ) : (
        <div className="mb-4 flex flex-col gap-3 pb-3 tablet:gap-6 tablet:pb-6">
          {!isPublicProfile && (
            <SummaryCard
              headerIcon="/assets/profile/domain_white.svg"
              headerTitle="Domain"
              isPublicProfile={isPublicProfile}
            >
              <>
                <h1 className="summary-text">
                  Your Home Page is the hub for connecting with your audience. Share posts, collections and news easily
                  with your audience.
                </h1>
                <div className="mt-3 flex items-center justify-center gap-3 tablet:mt-5 tablet:gap-6">
                  <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
                    <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
                      Profile Views
                    </h1>
                    <h5 className="text-center text-[18px] font-normal">{data?.profile?.domain.viewers?.length}</h5>
                  </div>
                  <div>
                    <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
                      Total engagements
                    </h1>
                    <h5 className="text-center text-[18px] font-normal">
                      {totalViewerCount +
                        persistedUserInfo?.sharedQuestsStatistics.totalQuestsCompleted +
                        persistedUserInfo?.myListStatistics?.totalSharedListsParticipentsCount +
                        persistedUserInfo?.myArticleStatistics.overAllArticleSharedEngagementCount}
                    </h5>
                  </div>
                </div>
                <div className="mt-3 grid w-full grid-cols-2 justify-center gap-3 tablet:mt-5">
                  <Button variant={'submit'} onClick={() => setIsBadgeHubPopup(true)}>
                    Show Badges
                  </Button>
                  <Button variant={'submit'} onClick={() => setIsPersonalPopup(true)}>
                    Manage Domain
                  </Button>

                  {!isPublicProfile && (
                    <Button variant="submit">
                      <Link to={`/h/${data?.profile?.domain.name}`}>View as public</Link>
                    </Button>
                  )}
                  {!isPublicProfile && <SetFDX />}
                </div>
              </>
            </SummaryCard>
          )}
          <ProfileCard profile={data?.profile} badges={data?.addedBadges} />
          {data?.linkHub && data?.linkHub === 'No Link Hub badge added yet!' && isPublicProfile ? null : (
            <LinkHub linkHub={data?.linkHub} domain={domain} />
          )}
          {data?.spotLight && data?.spotLight.message !== 'No list exists yet.' && (
            <Spotlight spotlight={data?.spotLight} />
          )}
          <SharedPosts domain={domain} profilePicture={data?.profile?.domain?.s3Urls[0]} />
          <SharedLists domain={domain} profilePicture={data?.profile?.domain?.s3Urls[0]} />
          <NewsArticles domain={domain} />
        </div>
      )}
    </div>
  );
}
