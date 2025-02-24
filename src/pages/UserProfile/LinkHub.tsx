import { useSelector } from 'react-redux';
import HomepageBadge from '../Dashboard/pages/Profile/pages/verification-badges/HomepageBadge';
import SummaryCard from '../../components/SummaryCard';
import { Button } from '../../components/ui/Button';
import LinkHubPopup from '../../components/dialogue-boxes/LinkHubPopup';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../../services/api/Axios';
import { formatCountNumber } from '../../utils/utils';
import { getIcon } from '../../services/imageProcessing';
import defaultLink from '../../assets/profile/default-link.svg';

export default function LinkHub({ linkHub, domain }: { linkHub: any; domain: string }) {
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const checkPseudoBadge = () => persistedUserInfo?.badges?.some((badge: any) => (badge?.pseudo ? true : false));
  const isPublicProfile = location.pathname.startsWith('/h/');
  const persistedTheme = useSelector((state: any) => state.utils.theme);
  const [isPersonalPopup, setIsPersonalPopup] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const linkHubInc = async ({
    domainName,
    badgeLinkId,
    viewerUuid,
  }: {
    domainName: string;
    badgeLinkId: string;
    viewerUuid: string;
  }) => {
    const response = await api.post('/linkhubInc', {
      domainName,
      badgeLinkId,
      viewerUuid,
    });

    return response.data;
  };

  const { mutateAsync: handleLinkHubIncrement } = useMutation({
    mutationFn: linkHubInc,
    onError: (err) => {
      console.log(err.message);
    },
  });

  const displayedBadges = showAll ? linkHub?.personal?.linkHub : linkHub?.personal?.linkHub?.slice(0, 5);

  const totalViewerCount =
    linkHub?.personal?.linkHub?.reduce((sum: number, item: { viewerCount: any[] }) => {
      return sum + (Array.isArray(item.viewerCount) ? item.viewerCount.length : 0);
    }, 0) || 0;

  return (
    <>
      {/* @ts-ignore */}
      <LinkHubPopup
        isPopup={isPersonalPopup}
        setIsPopup={setIsPersonalPopup}
        title="Link Hub"
        logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/linkhub.svg`}
        type={'linkHub'}
        setIsPersonalPopup={setIsPersonalPopup}
      />
      <SummaryCard headerIcon="/assets/svgs/linkhub-logo.svg" headerTitle="Link Hub" isPublicProfile={isPublicProfile}>
        {!isPublicProfile && (
          <>
            <h1 className="summary-text">
              Put all your essential links in one place on your Home Page, making it easier for others to find and
              connect with you across platforms
            </h1>
            <div className="mt-3 flex items-center justify-center gap-3 tablet:mt-5 tablet:gap-6">
              <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
                <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
                  Shared Links
                </h1>
                <h5 className="text-center text-[18px] font-normal">{linkHub?.personal?.linkHub?.length || 0}</h5>
              </div>
              <div>
                <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
                  Total views
                </h1>

                <h5 className="text-center text-[18px] font-normal">{totalViewerCount}</h5>
              </div>
            </div>
            <div className="mt-3 flex w-full justify-center tablet:mt-5">
              <Button variant={'submit'} onClick={() => setIsPersonalPopup(true)}>
                Manage shared links
              </Button>
            </div>
          </>
        )}
      </SummaryCard>
      <div className="mx-auto flex w-full max-w-[730px] flex-col items-center gap-3 tablet:gap-6">
        {/* <div className="relative mx-auto flex w-full max-w-[730px] flex-col items-center gap-[6px] rounded-[13.84px] border-2 border-[#D9D9D9] bg-white p-[18px] dark:border-gray-100 dark:bg-gray-200 tablet:gap-[10px] tablet:p-5"> */}
        {linkHub === 'No Link Hub badge added yet!' ? (
          <div className="w-full rounded-[10px] border-[1.85px] border-gray-250 bg-[#FDFDFD] px-5 py-[10px] text-gray-1 dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:py-[18.73px]">
            <h1 className="summary-text">You must add this badge to enable this feature.</h1>
            <HomepageBadge checkPseudoBadge={checkPseudoBadge} isProfile={true} isDomain={false} />
          </div>
        ) : (
          <>
            {displayedBadges?.map((badge: any) => (
              <button
                key={badge.id}
                className="flex w-full items-center justify-between rounded-[9.228px] border-[2.768px] border-gray-250 bg-[#FDFDFD] px-3 py-1 dark:border-gray-100 dark:bg-gray-200 tablet:px-6 tablet:py-2"
                onClick={() => {
                  handleLinkHubIncrement({
                    domainName: domain,
                    badgeLinkId: badge.id,
                    viewerUuid: persistedUserInfo?.uuid,
                  });
                  let link = null;
                  if (badge.link.includes('https://')) {
                    link = badge.link;
                  } else {
                    link = `https://${badge.link}`;
                  }
                  window.open(link, '_blank');
                }}
              >
                <div className="flex items-center gap-[10px] tablet:gap-[15px]">
                  <img
                    src={getIcon(badge.link)}
                    alt="save icon"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = defaultLink;
                    }}
                    className="size-[24.5px] rounded-full tablet:size-[35px]"
                  />
                  <h1 className="text-[12px] font-semibold leading-normal text-gray dark:text-[#f1f1f1] tablet:text-[18px]">
                    {badge.title}
                  </h1>
                </div>
                {!isPublicProfile && (
                  <div className="flex items-center justify-center gap-2">
                    <img
                      src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/clicks.svg' : 'assets/svgs/clicks.svg'}`}
                      alt="clicks"
                      className="h-3 w-3 tablet:h-6 tablet:w-6"
                    />
                    <h1 className="text-[12px] leading-normal text-gray dark:text-[#f1f1f1] tablet:text-[16px]">
                      {formatCountNumber(badge?.viewerCount?.length || 0)}
                    </h1>
                  </div>
                )}
              </button>
            ))}
            {!showAll && linkHub?.personal.linkHub?.length > 5 && (
              <Button variant="submit" onClick={() => setShowAll(true)}>
                See All Links
              </Button>
            )}
          </>
        )}
      </div>
      {/* </div> */}
    </>
  );
}
